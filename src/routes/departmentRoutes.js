import express from "express";
import { Department } from "../models/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const DEFAULT_DEPARTMENTS = [
  "Teknologji Informative",
  "Agjent i Shitjeve",
  "Financa",
  "Marketing",
  "Burime Njerezore",
  "Operacione",
];

async function ensureDefaultDepartments(companyId) {
  if (!companyId) {
    return;
  }

  for (const name of DEFAULT_DEPARTMENTS) {
    await Department.findOrCreate({
      where: { name, companyId },
      defaults: { name, companyId },
    });
  }
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    await ensureDefaultDepartments(req.user.companyId);

    const departments = await Department.findAll({
      where: { companyId: req.user.companyId },
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", authMiddleware, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const department = await Department.create({
      ...req.body,
      companyId: req.user.companyId,
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
