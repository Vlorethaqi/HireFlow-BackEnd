import express from "express";
import ApplicationDocument from "../models/ApplicationDocument.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const document = await ApplicationDocument.create(req.body);
    res.json({ message: "Application document created", document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const documents = await ApplicationDocument.findAll();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/application/:applicationId", async (req, res) => {
  try {
    const documents = await ApplicationDocument.findAll({
      where: { applicationId: req.params.applicationId }
    });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const document = await ApplicationDocument.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await document.destroy();
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;