import { Document, model, Schema, Types } from "npm:mongoose";

const userSchema = new Schema(
  {
    name: String,
    phone: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "employer", "candidate"],
      default: "candidate",
    },
    bookmarkedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    resume: { type: String },
    bio: { type: String },
    location: { type: String },
    skills: [String],
    company: { type: Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default model("User", userSchema);

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  role: "admin" | "employer" | "candidate";
  company?: Types.ObjectId;
}
