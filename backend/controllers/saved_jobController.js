const SavedJob = require('../model/SavedJob');



// @desc Save a Job 
exports.saveJob = async (req, res) => {
    try {
        const exists = await SavedJob.findOne({ job: req.params.jobId, jobseeker: req.user._id });
        if (exists) return res.status(400).json({ message: "Job already Saved " })
        
        const saved = await SavedJob.create({ job: req.params.jobId, jobseeker: req.user._id });
        res.status(201).json(saved);

    } catch (error) {
        res.status(500).json({message:"Failed to save this Job ", error:error.message})
    }
}


// @desc Un Save a Job 
exports.unsaveJob = async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({ job: req.params.jobId, jobseeker: req.user._id });
        res.json({message:'Job removed From Saved List '})
    } catch (error) {
        res.status(500).json({message:"Failed to remove this Job ", error:error.message})
    }
}
// @desc get all saved  Jobs 
exports.getMySavedJobs = async (req, res) => {
    try {
        const savedjobs = await SavedJob.find({ jobseeker: req.user._id })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name companyName companyLogo'
                }
            });
        
        res.json(savedjobs);

    } catch (error) {
        res.status(500).json({message:"Failed to get all saved  Jobs ", error:error.message})
    }
}