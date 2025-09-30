const express = require('express')
const {
    applyToJob,
    getMyApplications,
    getApplicationById,
    getApplicationsForJob,
    updateStatus

} = require('../controllers/applicationController')

const router = express.Router();
const { protect } = require('../middlewares/authmiddleware')
router.use(protect);

router.post('/:jobId', applyToJob);
router.get('/my', getMyApplications);
router.get('/job/:jobId', getApplicationsForJob);
router.get('/:id', getApplicationById);
router.put('/:id/status', updateStatus);

module.exports = router;
