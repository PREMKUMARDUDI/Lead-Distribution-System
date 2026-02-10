import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true }, // Simple password for agent access if needed later
    leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
  },
  { timestamps: true },
);

export default mongoose.model("Agent", agentSchema);
