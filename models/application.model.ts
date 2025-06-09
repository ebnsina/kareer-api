import { model, Schema } from "npm:mongoose";

const applicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: { type: String },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Interviewing", "Rejected", "Hired"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default model("Application", applicationSchema);
