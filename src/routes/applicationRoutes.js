const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

const { authenticateJWT } = require('../middleware/auth');
const { restrictTo } = require('../middleware/roles');


router.use(authenticateJWT);


router.post('/apply', restrictTo('CANDIDATE'), applicationController.applyToJob);
router.get('/my-applications', restrictTo('CANDIDATE'), applicationController.getMyApplications);


router.get('/company', restrictTo('ADMIN'), applicationController.getCompanyApplications);
router.put('/:id/status', restrictTo('ADMIN'), applicationController.updateStatus);

module.exports = router;