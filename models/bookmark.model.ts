import { model, Schema } from "npm:mongoose";

const bookmarkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, job: 1 }, { unique: true });

export default model("Bookmark", bookmarkSchema);
