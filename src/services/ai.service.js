import { Op } from "sequelize";
import {
  Application,
  CandidateProfile,
  CandidateSkill,
  Job,
  JobRequirement,
  JobSkill,
  Skill,
  User,
} from "../models/index.js";

function getResponseText(data) {
  if (data.output_text) return data.output_text;

  let text = "";

  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text") {
        text += content.text;
      }
    }
  }

  return text;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      matchScore: null,
      summary: text,
      strengths: [],
      weaknesses: [],
      missingSkills: [],
      recommendation: "Review manually",
    };
  }
}

function localFallbackAnalysis(
  jobSkillNames,
  candidateSkillNames,
  providerError,
  profile,
  application
) {
  let score = 0;

  const normalizedCandidateSkills = new Set(
    candidateSkillNames.map((s) => s.toLowerCase())
  );

  const matchedSkills = jobSkillNames.filter((s) =>
    normalizedCandidateSkills.has(s.toLowerCase())
  );

  const missingSkills = jobSkillNames.filter(
    (s) => !normalizedCandidateSkills.has(s.toLowerCase())
  );

  // Skill match (60%)
  if (jobSkillNames.length > 0) {
    score += (matchedSkills.length / jobSkillNames.length) * 60;
  }

  // Experience (25%)
  if (profile?.experienceYears >= 5) score += 25;
  else if (profile?.experienceYears >= 3) score += 20;
  else if (profile?.experienceYears >= 1) score += 10;

  // Education bonus
  if (profile?.education) score += 5;

  // Cover letter keywords (10%)
  const coverLetter = application?.coverLetter?.toLowerCase() || "";
  const keywords = [
    "team",
    "backend",
    "frontend",
    "javascript",
    "react",
    "node",
    "api",
    "database",
  ];

  let keywordMatches = 0;
  keywords.forEach((k) => {
    if (coverLetter.includes(k)) keywordMatches++;
  });

  score += Math.min(keywordMatches * 2, 10);

  const finalScore = Math.min(Math.round(score), 100);

  return {
    matchScore: finalScore,

    summary: `Candidate matched ${matchedSkills.length} out of ${jobSkillNames.length} required skills and achieved a compatibility score of ${finalScore}%.`,

    strengths: matchedSkills.length
      ? matchedSkills
      : ["Candidate profile is available"],

    weaknesses: missingSkills.length
      ? ["Some required skills are missing"]
      : [],

    missingSkills,

    recommendation:
      finalScore >= 75
        ? "Strong match"
        : finalScore >= 45
        ? "Review manually"
        : "Weak match",
  };
}

async function callOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OPENAI_API_KEY is missing");
    error.statusCode = 500;
    throw error;
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "Return only valid JSON with: matchScore, summary, strengths, weaknesses, missingSkills, recommendation.",
      input: prompt,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(
      data.error?.message || "OpenAI request failed"
    );
    error.statusCode = res.status;
    throw error;
  }

  return parseJson(getResponseText(data));
}

export async function analyzeApplication(applicationId, companyId) {
  const application = await Application.findOne({
    where: { id: applicationId, companyId },
  });

  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findByPk(application.userId);

  const job = await Job.findByPk(application.jobId);

  const profile = await CandidateProfile.findOne({
    where: { userId: application.userId },
  });

  const requirements = await JobRequirement.findAll({
    where: { jobId: application.jobId },
  });

  // ✅ FIX: clean skill fetching (NO DUPLICATES)
  const jobSkillsData = await JobSkill.findAll({
    where: { jobId: application.jobId },
  });

  const candidateSkillsData = profile
    ? await CandidateSkill.findAll({
        where: { candidateProfileId: profile.id },
      })
    : [];

  const jobSkillIds = jobSkillsData.map((js) => js.skillId);
  const candidateSkillIds = candidateSkillsData.map((cs) => cs.skillId);

  const jobSkillNames = await Skill.findAll({
    where: { id: jobSkillIds },
  }).then((res) => res.map((s) => s.name));

  const candidateSkillNames = await Skill.findAll({
    where: { id: candidateSkillIds },
  }).then((res) => res.map((s) => s.name));

  const prompt = `
Job:
Title: ${job?.title || "Not provided"}
Description: ${job?.description || "Not provided"}
Employment type: ${job?.employmentType || "Not provided"}
Location: ${job?.location || "Not provided"}
Required skills: ${jobSkillNames.join(", ") || "Not provided"}
Requirements: ${requirements.map((r) => r.requirementText).join("; ") || "Not provided"}

Candidate:
Name: ${user?.name || "Not provided"}
Bio: ${profile?.bio || "Not provided"}
Experience years: ${profile?.experienceYears ?? "Not provided"}
Education: ${profile?.education || "Not provided"}
Skills: ${candidateSkillNames.join(", ") || "Not provided"}
Cover letter: ${application.coverLetter || "Not provided"}
`;

  try {
    return await callOpenAI(prompt);
  } catch (error) {
    return localFallbackAnalysis(
      jobSkillNames,
      candidateSkillNames,
      error.message,
      profile,
      application
    );
  }
}