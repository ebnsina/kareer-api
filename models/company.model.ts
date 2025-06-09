import { model, Schema } from "npm:mongoose";

const companySchema = new Schema(
  {
    name: String,
    logo: String,
    description: String,
    website: String,
    location: String,
    socials: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Company", companySchema);
