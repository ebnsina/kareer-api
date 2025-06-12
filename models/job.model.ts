import { model, Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    category: {
      type: String,
      enum: [
        "Engineering",
        "Design",
        "Marketing",
        "Sales",
        "Finance",
        "Human Resources",
        "Other",
      ],
      default: "Other",
    },
    tags: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Remote"],
      default: "Full-time",
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number },
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Filled"],
      default: "Open",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Job", jobSchema);
