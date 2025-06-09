import Application from "../models/application.model.ts";
import User from "../models/user.model.ts";
import Job from "../models/user.model.ts";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCandidateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "candidate")
      return res.status(403).json({ message: "Unauthorized" });

    const { name, bio, location, skills, resume } = req.body;

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (resume) user.resume = resume;
    if (skills) user.skills = skills;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCandidateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("company");
    if (!user || user.role !== "candidate")
      return res.status(403).json({ message: "Unauthorized" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("company");
    if (!user || user.role !== "employer")
      return res.status(403).json({ message: "Unauthorized" });

    const {
      companyName,
      companyLogo,
      companyDescription,
      companyWebsite,
      companyLocation,
      companySocials,
      bio,
      location,
      skills,
    } = req.body;

    if (companyName) user.company.name = companyName;
    if (companyLogo) user.company.logo = companyLogo;
    if (companyDescription) user.company.description = companyDescription;
    if (companyWebsite) user.company.website = companyWebsite;
    if (companyLocation) user.company.location = companyLocation;
    if (companySocials) user.company.socials = companySocials;

    await user.company.save();

    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (skills !== undefined) user.skills = skills;

    await user.save();
    res.json({ message: "Company profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("company");
    if (!user || user.role !== "employer")
      return res.status(403).json({ message: "Unauthorized" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bookmarkJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user.bookmarkedJobs.includes(jobId)) {
      user.bookmarkedJobs.push(jobId);
      await user.save();
    }
    res.json({ message: "Job bookmarked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unbookmarkJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { bookmarkedJobs: jobId },
    });
    res.json({ message: "Job unbookmarked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookmarkedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("bookmarkedJobs");
    res.json(user.bookmarkedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [applications, hiredCount, rejectedCount] = await Promise.all([
      Application.find({ candidate: candidateId }),
      Application.countDocuments({ candidate: candidateId, status: "hired" }),
      Application.countDocuments({
        candidate: candidateId,
        status: "rejected",
      }),
    ]);

    res.json({
      totalApplied: applications.length,
      hired: hiredCount,
      rejected: rejectedCount,
      pending: applications.filter((app) => app.status === "pending").length,
      bookmarkedCount: (await User.findById(candidateId)).bookmarkedJobs.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployerDashboard = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can access this" });
    }

    const employerId = req.user.id;

    const [jobs, applicants, openCount, closedCount] = await Promise.all([
      Job.find({ company: employerId, isDeleted: false }).sort("-createdAt"),
      Application.countDocuments({ company: employerId }),
      Job.countDocuments({
        company: employerId,
        status: { $regex: "^open$", $options: "i" },
        isDeleted: false,
      }),
      Job.countDocuments({
        company: employerId,
        status: { $regex: "^closed$", $options: "i" },
        isDeleted: false,
      }),
    ]);

    res.json({
      totalJobs: jobs.length,
      applicants,
      openJobs: openCount,
      closedJobs: closedCount,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: err.message });
  }
};
