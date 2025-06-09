import User from "../models/user.model.ts";
import Application from "../models/application.model.ts";
import Job from "../models/job.model.ts";
import Notification from "../models/notification.model.ts";

export const applyToJob = async (req, res) => {
  const { jobId, resume } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job || job.isDeleted)
      return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "candidate")
      return res.status(403).json({ message: "Only candidates can apply" });

    const existingApp = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });
    if (existingApp)
      return res
        .status(400)
        .json({ message: "You already applied to this job" });

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume,
    });

    // Socket
    const employer = await User.findById(job.company).populate("company");
    if (!employer) throw new Error("Employer not found");

    const candidate = await User.findById(req.user.id).populate("company");
    const message = `${candidate.name || "Someone"} has applied to your job: ${
      job.title
    }`;

    const notification = await Notification.create({
      userId: employer._id,
      jobId: job._id,
      message,
    });

    req.app.get("io").emit("applyJobNotification", notification);

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my applications
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user.id })
      .populate({
        path: "job",
        match: { isDeleted: false },
        select: "title company",
        populate: { path: "company", select: "name" },
      })
      .sort("-createdAt");

    const validApps = apps.filter((app) => app.job !== null);
    res.json(validApps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get applicants for a job (for employers)
export const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.isDeleted)
      return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applicants = await Application.find({ job: job._id })
      .populate("candidate", "name email")
      .sort("-createdAt");

    res.json(applicants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update application status (admin/employer)
export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "Applied",
    "Reviewed",
    "Interviewing",
    "Rejected",
    "Hired",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (
      app.job.company.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    app.status = status;
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Candidate - View job history
export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    }).populate("job");

    const formatted = applications.map((app) => ({
      jobId: app.job._id,
      title: app.job.title,
      company: app.job.companyName,
      expired: app.job.isDeleted || new Date(app.job.expiresAt) < new Date(),
      appliedAt: app.createdAt,
      status: app.status,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employer: Get applicants for a specific job
export const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId);

    // Check ownership
    if (!job || job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or job not found" });
    }

    const applications = await Application.find({ job: jobId }).populate(
      "candidate",
      "name email resume skills"
    );

    const result = applications.map((app) => ({
      candidateId: app.candidate._id,
      name: app.candidate.name,
      email: app.candidate.email,
      resume: app.candidate.resume,
      skills: app.candidate.skills,
      status: app.status,
      appliedAt: app.createdAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
