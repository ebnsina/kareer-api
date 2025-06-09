import Job from "../models/job.model.ts";
import User from "../models/user.model.ts";

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only employers or admins can post jobs" });
    }

    const job = await Job.create({ ...req.body, company: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJobs = async (req, res) => {
  const {
    search,
    location,
    company,
    jobType,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const filter = { isDeleted: false };

    if (search) filter.title = { $regex: search, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (company) filter.company = { $regex: company, $options: "i" };
    if (jobType) filter.type = jobType;
    if (minSalary !== undefined) {
      filter["salary.min"] = { $gte: Number(minSalary) };
    }

    if (maxSalary !== undefined) {
      filter["salary.max"] = { $lte: Number(maxSalary) };
    }

    const jobs = await Job.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("company")
      .populate("createdBy", "-password");

    const totalJobs = await Job.countDocuments(filter);

    res.json({
      jobs,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("company", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.isDeleted)
      return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.isDeleted)
      return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    job.isDeleted = true;
    await job.save();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const recommendJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("company");
    if (user.role !== "candidate")
      return res.status(403).json({ message: "Unauthorized" });

    const skills = user.skills || [];

    const jobs = await Job.find({
      tags: { $in: skills },
      isDeleted: false,
      expiresAt: { $gt: new Date() },
    }).limit(10);

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "employer" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only employers or admins can access this" });
    }

    const jobs = await Job.find({ company: req.user.id, isDeleted: false })
      .sort("-createdAt")
      .populate("company");

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJobStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["Open", "Closed", "Filled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.isDeleted)
      return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (job.status === status) {
      return res.status(400).json({ message: `Job is already ${status}` });
    }

    job.status = status;
    await job.save();

    res.json({
      message: `Job status updated to ${status} successfully!`,
      job,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
