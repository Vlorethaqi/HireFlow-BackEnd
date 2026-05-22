import express from 'express';
import * as savedJobController from '../controllers/savedJobController.js'; 

const router = express.Router();

// Dokumentimi i Swagger u hoq përkohësisht që të mos bëjë crash serveri
router.post('/', savedJobController.saveJob); 
router.get('/user/:userId', savedJobController.getSavedJobs); 
router.delete('/:id', savedJobController.unsaveJob); 

export default router;