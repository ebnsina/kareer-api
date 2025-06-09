import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.ts";
import Company from "../models/company.model.ts";
import User from "../models/user.model.ts";

export const register = async (req, res) => {
  const { name, username, email, password, phone, as, company } = req.body;

  let companyName;
  let companyWebsite;
  let companyLocation;
  let companyDescription;
  let companyLogo;
  let role;

  if (company) {
    companyName = company.name;
    companyWebsite = company.website;
    companyLocation = company.location;
    companyDescription = company.description;
    companyLogo = company.logo;
  }

  role = as;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      username,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      role,
    });

    if (role === "employer") {
      const company = await Company.create({
        name: companyName,
        description: companyDescription,
        website: companyWebsite,
        location: companyLocation,
        logo: companyLogo,
        socials: socials,
        createdBy: user._id,
      });

      user.company = company._id;
      await user.save();
    }

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("company") // if employer
      .select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
