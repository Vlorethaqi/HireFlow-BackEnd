const state = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  skills: [],
  departments: [],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function authHeaders() {
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

function setMessage(value) {
  $("#message").textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function setSession(result) {
  state.token = result.token;
  state.user = result.user;
  localStorage.setItem("token", state.token);
  localStorage.setItem("user", JSON.stringify(state.user));
  renderSession();
}

function renderSession() {
  const loggedIn = Boolean(state.token);
  $("#authView").style.display = loggedIn ? "none" : "grid";
  $("#sessionInfo").textContent = loggedIn
    ? ` | ${state.user.name} (${state.user.role})`
    : "";
  $("#logoutBtn").style.display = loggedIn ? "inline-flex" : "none";
  $$(".companyOnly").forEach((item) => {
    item.style.display = state.user?.companyId ? "inline-flex" : "none";
  });
  showView(loggedIn ? "home" : "");
}

function showView(id) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  if (!id) return;
  if (id === "jobs") loadJobs();
  if (id === "profile") loadProfile();
  if (id === "skills") loadSkills();
  if (id === "departments") loadDepartments();
  if (id === "jobForm") loadJobFormData();
  if (id === "hr") loadApplications();
  if (id === "home") {
    $("#homeSummary").innerHTML = `
      <div>Role: <strong>${state.user?.role || "Guest"}</strong></div>
      <div>Company ID: <strong>${state.user?.companyId || "none"}</strong></div>
      <div>Email: <strong>${state.user?.email || ""}</strong></div>
    `;
  }
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const contentBase64 = String(reader.result).split(",")[1];
      resolve({
        fileName: file.name,
        contentBase64,
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function loadSkills() {
  const result = await api("/skills");
  state.skills = result.data || result;
  $("#skillsList").innerHTML = state.skills
    .map((skill) => `<span class="chip">${skill.name} · ${skill.category}</span>`)
    .join("");

  $$('select[name="skills"]').forEach((select) => {
    const selected = new Set([...select.selectedOptions].map((item) => item.value));
    select.innerHTML = state.skills
      .map((skill) => `<option value="${skill.id}" ${selected.has(String(skill.id)) ? "selected" : ""}>${skill.name}</option>`)
      .join("");
  });
}

async function loadDepartments() {
  if (!state.user?.companyId) return;
  const result = await api("/departments");
  state.departments = result.data || [];
  $("#departmentsList").innerHTML = state.departments
    .map((department) => `<span class="chip">${department.name}</span>`)
    .join("");
  const select = $('#createJobForm select[name="departmentId"]');
  select.innerHTML = `<option value="">Department</option>` + state.departments
    .map((department) => `<option value="${department.id}">${department.name}</option>`)
    .join("");
}

async function loadJobFormData() {
  await Promise.all([loadSkills(), loadDepartments()]);
}

async function loadJobs() {
  const jobs = await api("/jobs");
  $("#jobsList").innerHTML = (jobs.data || jobs)
    .map((job) => {
      const skills = (job.Skills || []).map((skill) => skill.name).join(", ");
      return `
        <article class="card">
          <h2>${job.title}</h2>
          <div class="meta">${job.location || "Remote"} · ${job.employmentType} · ${job.status}</div>
          <p>${job.description}</p>
          <div class="meta">Skills: ${skills || "Not set"}</div>
          <div class="actions">
            <button data-apply="${job.id}">Apply</button>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadProfile() {
  await loadSkills();
  const result = await api("/candidate-profiles/me");
  const profile = result.data;
  const form = $("#profileForm");
  form.reset();
  $("#currentCv").innerHTML = "";
  if (!profile) return;
  ["phone", "location", "education", "experienceYears", "githubUrl", "linkedinUrl", "bio"].forEach((name) => {
    if (form.elements[name]) form.elements[name].value = profile[name] || "";
  });
  if (profile.cvUrl) {
    $("#currentCv").innerHTML = `Current CV: <a href="${profile.cvUrl}" target="_blank" rel="noreferrer">Open file</a>`;
  }
  const selected = new Set((profile.CandidateSkills || []).map((item) => String(item.skillId)));
  [...form.elements.skills.options].forEach((option) => {
    option.selected = selected.has(option.value);
  });
}

async function loadApplications() {
  const result = await api("/applications/company");
  $("#applicationsList").innerHTML = (result.data || [])
    .map((application) => `
      <article class="card">
        <h2>${application.Job?.title || "Application"} #${application.id}</h2>
        <div class="meta">Status: ${application.ApplicationStatus?.name || application.statusId}</div>
        <div class="meta">
          CV:
          ${
            application.CandidateProfile?.cvUrl
              ? `<a href="${application.CandidateProfile.cvUrl}" target="_blank" rel="noreferrer">Open file</a>`
              : "Not uploaded"
          }
        </div>
        <p>${application.coverLetter || ""}</p>
        <div class="actions">
          <select data-status="${application.id}">
            <option value="1">PENDING</option>
            <option value="2">REVIEWED</option>
            <option value="3">INTERVIEW</option>
            <option value="4">ACCEPTED</option>
            <option value="5">REJECTED</option>
          </select>
          <button data-review="${application.id}">Save Review</button>
          <button data-response="${application.id}">Send Response</button>
          <button data-ai="${application.id}">AI Analyze</button>
        </div>
      </article>
    `)
    .join("");
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData(event.target)),
    });
    setSession(result);
    setMessage("Login successful");
  } catch (error) {
    setMessage(error.message);
  }
});

$("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData(event.target)),
    });
    setMessage("Register successful. Please login.");
    event.target.reset();
  } catch (error) {
    setMessage(error.message);
  }
});

$("#logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  state.token = null;
  state.user = null;
  renderSession();
});

$$("nav button[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

$("#companyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = formData(event.target);
    payload.adminEmail = state.user?.email;
    payload.adminName = state.user?.name;
    const result = await api("/companies", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setSession(result);
    setMessage("Company created. You are now company admin.");
  } catch (error) {
    setMessage(error.message);
  }
});

$("#profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = formData(event.target);
    delete payload.cvFile;
    payload.skills = [...event.target.elements.skills.selectedOptions].map((item) => Number(item.value));
    payload.experienceYears = Number(payload.experienceYears || 0);
    const cvFile = event.target.elements.cvFile.files[0];
    if (cvFile) {
      payload.cvFile = await readFileAsBase64(cvFile);
    }
    const result = await api("/candidate-profiles/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setMessage(result.message);
    await loadProfile();
  } catch (error) {
    setMessage(error.message);
  }
});

$("#createJobForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const payload = formData(event.target);
    payload.skills = [...event.target.elements.skills.selectedOptions].map((item) => ({
      skillId: Number(item.value),
      importanceLevel: "REQUIRED",
    }));
    payload.requirements = payload.requirements
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    ["salaryMin", "salaryMax", "departmentId"].forEach((key) => {
      payload[key] = payload[key] ? Number(payload[key]) : null;
    });
    const result = await api("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMessage(result.message);
    event.target.reset();
  } catch (error) {
    setMessage(error.message);
  }
});

$("#skillForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/skills", { method: "POST", body: JSON.stringify(formData(event.target)) });
    event.target.reset();
    await loadSkills();
  } catch (error) {
    setMessage(error.message);
  }
});

$("#departmentForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/departments", { method: "POST", body: JSON.stringify(formData(event.target)) });
    event.target.reset();
    await loadDepartments();
  } catch (error) {
    setMessage(error.message);
  }
});

$("#refreshJobs").addEventListener("click", loadJobs);
$("#refreshApplications").addEventListener("click", loadApplications);

document.addEventListener("click", async (event) => {
  const applyId = event.target.dataset.apply;
  const reviewId = event.target.dataset.review;
  const responseId = event.target.dataset.response;
  const aiId = event.target.dataset.ai;

  try {
    if (applyId) {
      const coverLetter = prompt("Cover letter") || "";
      const result = await api("/applications/apply", {
        method: "POST",
        body: JSON.stringify({ jobId: Number(applyId), coverLetter }),
      });
      setMessage(result.message);
    }

    if (reviewId) {
      const comment = prompt("Review comment") || "";
      const rating = Number(prompt("Rating 1-5") || 3);
      const statusId = Number(document.querySelector(`[data-status="${reviewId}"]`).value);
      await api("/application-reviews", {
        method: "POST",
        body: JSON.stringify({ applicationId: Number(reviewId), rating, comment }),
      });
      await api(`/applications/${reviewId}/status`, {
        method: "PUT",
        body: JSON.stringify({ statusId }),
      });
      setMessage("Review and status saved");
      await loadApplications();
    }

    if (responseId) {
      const message = prompt("Response message") || "";
      const status = prompt("Response status: ACCEPTED, REJECTED, INTERVIEW, PENDING") || "PENDING";
      const result = await api("/application-responses", {
        method: "POST",
        body: JSON.stringify({ applicationId: Number(responseId), message, status }),
      });
      setMessage(result.message);
    }

    if (aiId) {
      const result = await api(`/ai/analyze-application/${aiId}`, { method: "POST" });
      setMessage(result.data);
    }
  } catch (error) {
    setMessage(error.message);
  }
});

renderSession();
if (state.token) {
  loadSkills().catch(() => {});
}
