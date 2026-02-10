import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  },
  { timestamps: true },
);

export default mongoose.model("Lead", leadSchema);
