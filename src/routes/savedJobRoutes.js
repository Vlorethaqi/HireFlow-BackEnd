const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');


router.post('/', savedJobController.saveJob); 
router.get('/user/:userId', savedJobController.getSavedJobs); 
router.delete('/:id', savedJobController.unsaveJob); 

module.exports = router;