const Application = require('../model/Application');
const Job=require('../model/Job')
const User = require('../model/User')




// @desc        Apply tio job
exports.applyToJob = async (req, res) => {
    try {
        console.log('=== Apply to Job Backend Debug ===');
        console.log('User ID:', req.user._id);
        console.log('Job ID:', req.params.jobId);
        console.log('User role:', req.user.role);

        // Check if user is a job seeker
        if (req.user.role !== 'jobseeker') {
            return res.status(403).json({ message: "Only Job Seekers Can Apply for Jobs" });
        }

        // Validate job ID format
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
            return res.status(400).json({ message: "Invalid job ID format" });
        }

        // Check if job exists
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if job is still open
        if (job.isClosed) {
            return res.status(400).json({ message: "This job is no longer accepting applications" });
        }

        // Check for existing application
        const existing = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id
        });

        if (existing) {
            console.log('Application already exists with status:', existing.status);
            return res.status(400).json({ 
                message: 'Already Applied to this Job',
                applicationStatus: existing.status 
            });
        }

        // Create new application
        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user._id,
            resume: req.user.resume,
        });

        console.log('Application created successfully:', application._id);

        // Populate the response with job and applicant details for better frontend handling
        const populatedApplication = await Application.findById(application._id)
            .populate('job', 'title company')
            .populate('applicant', 'name email');

        res.status(201).json({
            message: 'Application submitted successfully',
            application: populatedApplication
        });

    } catch (error) {
        console.error('Apply to job error:', error);
        res.status(500).json({ message: error.message });
    }
};
// @desc        get logge in user's applications 
exports.getMyApplications = async (req, res) => {
    try {
        

        const apps = await Application.find({ applicant: req.user._id })
            .populate('job', "title company location type")
            .sort({ createdAt: -1 });
        res.json(apps);

        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

// @desc      get all appliactions for job 
exports.getApplicationsForJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.jobId);
        if (!job || job.company.toString() !== req.user._id.toString())
            return res.status(403).json({message:"Not authorized "})
        
        const applications = await Application.find({ job: req.params.jobId })
            .populate('job', 'title location category type')
            .populate('applicant', 'name email avatar resume')
        
        res.json(applications);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}

// @desc        get application By Id 
exports.getApplicationById = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id)
            .populate('job', 'title')
            .populate('applicant', 'name email avatar resume');
        if (!app) return res.status(404).json({
            message: "Application Not Found ",
            id:req.params.id
        })

        const isOwner =
            app.applicant._id.toString() === req.user._id.toString() ||
            app.job.company.toString() === req.user._id.toString();
        
        if (!isOwner) return res.status(403).json({ message: "Not Authorized " })
       
        res.json(app);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}
// @desc        Update Application Status 
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const app = await Application.findById(req.params.id).populate('job');
        if (!app || app.job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not Authorized" })
        }
        app.status = status;
        await app.save()

        res.json({message:'Application status updated ',status})

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}
 