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
  if (data.output_text) {
    return data.output_text;
  }

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
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions:
        "You analyze job applications. Return only valid JSON with these fields: matchScore, summary, strengths, weaknesses, missingSkills, recommendation.",
      input: prompt,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data.error?.message || "OpenAI request failed";
    const error = new Error(message);
    error.statusCode = res.status;
    throw error;
  }

  return parseJson(getResponseText(data));
}

export async function analyzeApplication(applicationId, companyId) {
  const application = await Application.findOne({
    where: {
      id: applicationId,
      companyId,
    },
  });

  if (!application) {
    const error = new Error("Application not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findByPk(application.userId);
  const job = await Job.findByPk(application.jobId);
  const profile = await CandidateProfile.findOne({
    where: {
      userId: application.userId,
    },
  });

  const requirements = await JobRequirement.findAll({
    where: {
      jobId: application.jobId,
    },
  });

  const jobSkills = await JobSkill.findAll({
    where: {
      jobId: application.jobId,
    },
  });

  const candidateSkills = profile
    ? await CandidateSkill.findAll({
        where: {
          candidateProfileId: profile.id,
        },
      })
    : [];

  const jobSkillIds = jobSkills.map((item) => item.skillId);
  const candidateSkillIds = candidateSkills.map((item) => item.skillId);
  const allSkillIds = [...new Set([...jobSkillIds, ...candidateSkillIds])];

  const skills = allSkillIds.length
    ? await Skill.findAll({
        where: {
          id: {
            [Op.in]: allSkillIds,
          },
        },
      })
    : [];

  const jobSkillNames = skills
    .filter((skill) => jobSkillIds.includes(skill.id))
    .map((skill) => skill.name);

  const candidateSkillNames = skills
    .filter((skill) => candidateSkillIds.includes(skill.id))
    .map((skill) => skill.name);

  const prompt = `
Job:
Title: ${job?.title || "Not provided"}
Description: ${job?.description || "Not provided"}
Employment type: ${job?.employmentType || "Not provided"}
Location: ${job?.location || "Not provided"}
Required skills: ${jobSkillNames.join(", ") || "Not provided"}
Requirements: ${requirements.map((item) => item.requirementText).join("; ") || "Not provided"}

Candidate:
Name: ${user?.name || "Not provided"}
Bio: ${profile?.bio || "Not provided"}
Experience years: ${profile?.experienceYears ?? "Not provided"}
Education: ${profile?.education || "Not provided"}
Skills: ${candidateSkillNames.join(", ") || "Not provided"}
Cover letter: ${application.coverLetter || "Not provided"}
`;

  return callOpenAI(prompt);
}
