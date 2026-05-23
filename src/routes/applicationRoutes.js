import express from 'express';
import { getAllStatuses } from '../controllers/applicationStatusController.js';

const router = express.Router();
router.get('/', getAllStatuses);

export default router;