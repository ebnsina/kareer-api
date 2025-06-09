import User from "../models/user.model.ts";

export const updateCompanyProfile = async (req, res) => {
  const { name, bio, website, industry, location } = req.body;

  try {
    const company = await User.findById(req.user.id).populate("company");

    if (!company || company.role !== "employer") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    company.name = name || company.name;
    company.bio = bio || company.bio;
    company.website = website || company.website;
    company.industry = industry || company.industry;
    company.location = location || company.location;

    await company.save();
    res.json({ message: "Profile updated", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOwnCompanyProfile = async (req, res) => {
  try {
    const company = await User.findById(req.user.id)
      .populate("company")
      .select("-password");

    if (!company || company.role !== "employer") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPublicCompanyProfile = async (req, res) => {
  try {
    const company = await User.findById(req.params.id)
      .populate("company")
      .select("name bio website industry location logo");

    if (!company || company.role !== "employer") {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
