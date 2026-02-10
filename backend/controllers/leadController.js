import Lead from "../models/Lead.js";
import Agent from "../models/Agent.js";

// Get All Leads (Populated with Agent Name)
export const getAllLeads = async (req, res) => {
  try {
    // .populate('assignedAgent', 'name') replaces the Agent ID with the actual Agent Name
    const leads = await Lead.find({}).populate("assignedAgent", "name email");
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Lead & Remove from Agent
export const deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // 1. Remove this Lead ID from the Assigned Agent's 'leads' array
    if (lead.assignedAgent) {
      await Agent.findByIdAndUpdate(lead.assignedAgent, {
        $pull: { leads: id }, // $pull removes the item from the array
      });
    }

    // 2. Delete the Lead itself
    await Lead.findByIdAndDelete(id);

    res.json({ message: "Lead deleted and removed from agent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
