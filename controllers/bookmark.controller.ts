import Bookmark from "../models/bookmark.model.ts";
import Job from "../models/job.model.ts";

export const saveJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job || job.isDeleted)
      return res.status(404).json({ message: "Job not found" });

    const existing = await Bookmark.findOne({ user: req.user.id, job: jobId });
    if (existing)
      return res.status(400).json({ message: "Job already bookmarked" });

    const bookmark = await Bookmark.create({ user: req.user.id, job: jobId });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).populate(
      "job"
    );
    res.json(bookmarks.map((b) => b.job));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const removed = await Bookmark.findOneAndDelete({
      user: req.user.id,
      job: req.params.jobId,
    });
    if (!removed)
      return res.status(404).json({ message: "Bookmark not found" });

    res.json({ message: "Job unsaved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
