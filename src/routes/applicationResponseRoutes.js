import express from "express";
import ApplicationResponse from "../models/ApplicationResponse.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await ApplicationResponse.create(req.body);
    res.json({ message: "Application response created", response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const responses = await ApplicationResponse.findAll();
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/application/:applicationId", async (req, res) => {
  try {
    const responses = await ApplicationResponse.findAll({
      where: { applicationId: req.params.applicationId }
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const response = await ApplicationResponse.findByPk(req.params.id);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    await response.update(req.body);
    res.json({ message: "Response updated", response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await ApplicationResponse.findByPk(req.params.id);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    await response.destroy();
    res.json({ message: "Response deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;