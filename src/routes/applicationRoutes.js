import express from 'express';
import { getAllStatuses } from '../controllers/applicationStatusController.js';

const router = express.Router();

/**
 * @swagger
 * /api/application-statuses:
 * get:
 * summary: "Merr listen e te gjitha statuseve"
 * tags: ["Application Statuses"]
 * responses:
 * 200:
 * description: "Sukses"
 */
router.get('/', getAllStatuses);

export default router;