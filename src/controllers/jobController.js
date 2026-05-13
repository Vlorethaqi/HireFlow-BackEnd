import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  const jobs = await Job.findAll();
  res.json(jobs);
};

export const createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(job);
};