const jobs = new Map();

function createJob(type) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const job = {
    id,
    type,
    status: "QUEUED",
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  jobs.set(id, job);
  return job;
}

function updateJob(id, updates) {
  const current = jobs.get(id);

  if (!current) {
    return null;
  }

  const next = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  jobs.set(id, next);
  return next;
}

export function enqueueBackgroundJob(type, task) {
  const job = createJob(type);

  setImmediate(async () => {
    updateJob(job.id, { status: "RUNNING" });

    try {
      const result = await task();
      updateJob(job.id, { status: "COMPLETED", result });
    } catch (error) {
      updateJob(job.id, {
        status: "FAILED",
        error: error.message || "Background job failed",
      });
    }
  });

  return job;
}

export function getBackgroundJob(id) {
  return jobs.get(id) || null;
}
