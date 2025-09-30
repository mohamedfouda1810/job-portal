const Job = require('../model/Job');
const User = require('../model/User');
const Application = require('../model/Application');
const SavedJob = require('../model/SavedJob');
// @desc Create a new Job (Employer Only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "You don't have permission to do this" });
    }

    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      location: req.body.location,
      category: req.body.category,
      type: req.body.type,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      company: req.user._id,   // ✅ force employer ID here
      isClosed: false
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all jobs (with filters + saved/applied status)
exports.getJobs = async (req, res) => {
  const {
    keyword,
    location,
    category,
    type,
    minSalary,
    maxSalary,
    userId,
    includeClosed // optional param to control closed jobs
  } = req.query;

  const query = {
    ...(includeClosed !== 'true' && { isClosed: false }), // default hide closed jobs
    ...(keyword && { title: { $regex: keyword, $options: 'i' } }),
    ...(location && { location: { $regex: location, $options: 'i' } }),
    ...(category && { category: { $regex: category, $options: 'i' } }),
    ...(type && { type: { $regex: type, $options: 'i' } }),
  };

  if (minSalary || maxSalary) query.$and = [];
  if (minSalary) query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
  if (maxSalary) query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
  if (query.$and && query.$and.length === 0) delete query.$and;

  try {
    const jobs = await Job.find(query).populate('company', 'name companyName companyLogo');

    let savedJobIds = [];
    let appliedJobStatusMap = {};

    if (userId) {
      // Saved jobs
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select('job');
      savedJobIds = savedJobs.map(s => String(s.job));

      // Applications - Fixed the field name from 'jobseeker' to 'applicant'
      const applications = await Application.find({ applicant: userId }).select('job status');
      applications.forEach(app => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }

    const jobsWithExtras = jobs.map(job => {
      const jobIdStr = String(job._id);
      const hasApplication = appliedJobStatusMap[jobIdStr];
      
      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdStr),
        applicationStatus: hasApplication || null,
        hasApplied: !!hasApplication // Boolean flag for easier checking
      };
    });

    res.json(jobsWithExtras);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc Get jobs for employer (only jobs they posted)
exports.getJobsEmployer = async (req, res) => {
    try {
        const userId = req.user._id;
        const {role} = req.user;
        if (role !== 'employer') {
            return res.status(403).json({ message: "Only employers can view this" });
        }
// get jobs that posted by  employer 
        const jobs = await Job.find({ company: userId })
            .populate('company', 'name companyName companyLogo')
            .lean();// .lean() make jobs js objects so we can add new fields
        // count applications for each job 
        const jobssWithApplicationCounts = await Promise.all(
            jobs.map(async (job) => {
                const applicationCount = await Application.countDocuments({
                    job: job._id,
                    
                })
                return {
                    ...job,
                    applicationCount
                }
            })
        );

        res.json(jobssWithApplicationCounts)
         
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single job by ID
exports.getJobById = async (req, res) => {
    try {
        const { userId } = req.query;

        const job = await Job.findById(req.params.id).populate('company', 'name companyName companyLogo');
        if (!job) return res.status(404).json({ message: "Job not found" });
       
        let applicationStatus = null;
        if (userId) {
            const application = await Application.findOne({
                job: job._id,
                applicant:userId
            }).select('status')

            if (application) {
                applicationStatus = application.status;
            }
        }
       
        res.json({
            ...job.toObject(),
            applicationStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update job (Employer only)
exports.updateJob = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: "Only employers can update jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this job" });
        }

        Object.assign(job, req.body);
        await job.save();

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete job (Employer only)
exports.deleteJob = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: "Only employers can delete jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to delete this job" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Toggle job close status (Employer only)
exports.toggleCloseJob = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: "Only employers can close/open jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (String(job.company) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this job" });
        }

        job.isClosed = !job.isClosed;
        await job.save();

        res.json({ message: `Job is now ${job.isClosed ? 'closed' : 'open'}`, job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
