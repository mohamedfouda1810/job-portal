const express = require('express')
const {
    saveJob,
    unsaveJob,
    getMySavedJobs
} = require('../controllers/saved_jobController');

const router = express.Router();
const {protect}=require('../middlewares/authmiddleware')

router.use(protect)
router.post('/:jobId', saveJob);
router.delete('/:jobId', unsaveJob);
router.get('/my',getMySavedJobs)






module.exports = router;
