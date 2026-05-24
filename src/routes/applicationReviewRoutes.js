import express from "express";
import ApplicationReview from "../models/ApplicationReview.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const review = await ApplicationReview.create(req.body);
    res.json({ message: "Application review created", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await ApplicationReview.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/application/:applicationId", async (req, res) => {
  try {
    const reviews = await ApplicationReview.findAll({
      where: { applicationId: req.params.applicationId }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const review = await ApplicationReview.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.update(req.body);
    res.json({ message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const review = await ApplicationReview.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;