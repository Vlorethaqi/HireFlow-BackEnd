const { SavedJob, Job } = require('../models');

exports.saveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const companyId = req.headers['x-company-id']; 

    if (!companyId) {
      return res.status(400).json({ success: false, message: "Kompani ID (Tenant) mungon!" });
    }

  
    const existingSavedJob = await SavedJob.findOne({
      where: { userId, jobId, companyId }
    });

    if (existingSavedJob) {
      return res.status(400).json({ success: false, message: "Këtë punë e keni ruajtur më parë!" });
    }

    const savedJob = await SavedJob.create({
      userId,
      jobId,
      companyId
    });

    res.status(201).json({ success: true, message: "Puna u ruajt me sukses!", data: savedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getSavedJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    const companyId = req.headers['x-company-id'];

    const savedJobs = await SavedJob.findAll({
      where: { userId, companyId },
      include: [
        {
          model: Job,
          as: 'job', 
          attributes: ['id', 'title', 'description', 'location'] 
        }
      ]
    });

    res.status(200).json({ success: true, data: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const { id } = req.params; 
    const companyId = req.headers['x-company-id'];

    const deleted = await SavedJob.destroy({
      where: { id, companyId }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Puna e ruajtur nuk u gjet!" });
    }

    res.status(200).json({ success: true, message: "Puna u hoq nga lista e të ruajturave!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};