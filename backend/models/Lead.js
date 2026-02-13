import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Lead", leadSchema);
