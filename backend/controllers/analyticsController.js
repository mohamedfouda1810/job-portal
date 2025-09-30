const Job = require('../model/Job');
const Application = require('../model/Application');

const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

exports.getEmployerAnalytics = async (req, res) => {
  try {
    console.log('>>> getEmployerAnalytics called. req.user =', req.user);

    // تأكيد وجود المستخدم
    if (!req.user) {
      return res.status(401).json({ message: 'No user attached — set Authorization: Bearer <token>' });
    }

    // تأكيد الدور
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can access analytics', yourRole: req.user.role });
    }

    const companyId = req.user._id.toString();

    const now = new Date();
    const last7DaysStart = new Date(now); last7DaysStart.setDate(now.getDate() - 7);
    const prev7DaysStart = new Date(now); prev7DaysStart.setDate(now.getDate() - 14);
    const prev7DaysEnd = new Date(now); prev7DaysEnd.setDate(now.getDate() - 7);

    // جميع وظائف هذا الـ employer
    const jobs = await Job.find({ company: companyId }).select('_id createdAt isClosed').lean();
    const jobIds = jobs.map(j => j._id);

    // counts
    const totalActiveJobs = jobs.filter(j => !j.isClosed).length;
    const totalAppliedJobs = jobIds.length ? await Application.countDocuments({ job: { $in: jobIds } }) : 0;
    const totalHired = jobIds.length ? await Application.countDocuments({ job: { $in: jobIds }, status: 'Accepted' }) : 0;

    // trends: jobs posted
    const jobsLast7 = jobs.filter(j => new Date(j.createdAt) >= last7DaysStart && new Date(j.createdAt) <= now).length;
    const jobsPrev7 = jobs.filter(j => new Date(j.createdAt) >= prev7DaysStart && new Date(j.createdAt) < last7DaysStart).length;
    const jobsTrend = getTrend(jobsLast7, jobsPrev7);

    // application trends (DB counts)
    const applicationsLast7 = jobIds.length ? await Application.countDocuments({ job: { $in: jobIds }, createdAt: { $gte: last7DaysStart, $lte: now } }) : 0;
    const applicationsPrev7 = jobIds.length ? await Application.countDocuments({ job: { $in: jobIds }, createdAt: { $gte: prev7DaysStart, $lte: prev7DaysEnd } }) : 0;
    const applicationsTrend = getTrend(applicationsLast7, applicationsPrev7);

    // hires trend
    const hiredLast7 = jobIds.length ? await Application.countDocuments({ job: { $in: jobIds }, status: 'Accepted', createdAt: { $gte: last7DaysStart, $lte: now } }) : 0;
    const hiredPrev7 = jobIds.length ? await Application.countDocuments({ job: { $in: jobIds }, status: 'Accepted', createdAt: { $gte: prev7DaysStart, $lte: prev7DaysEnd } }) : 0;
    const hiredTrend = getTrend(hiredLast7, hiredPrev7);

    // recent
    const recentJobs = await Job.find({ company: companyId }).sort({ createdAt: -1 }).limit(5).select('title location type createdAt isClosed');
    const recentApplications = jobIds.length ? await Application.find({ job: { $in: jobIds } }).sort({ createdAt: -1 }).limit(5).populate('applicant', 'name email avatar').populate('job', 'title') : [];

    return res.json({
      summary: { totalActiveJobs, totalAppliedJobs, totalHired },
      trends: { jobsPosted: jobsTrend, applications: applicationsTrend, hires: hiredTrend },
      recent: { jobs: recentJobs, applications: recentApplications }
    });

  } catch (error) {
    console.error('getEmployerAnalytics error:', error);
    return res.status(500).json({ message: "Can't fetch Data", error: error.message });
  }
};
