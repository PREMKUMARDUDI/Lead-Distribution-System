import Agent from "../models/Agent.js";
import Lead from "../models/Lead.js";
import bcrypt from "bcryptjs";

// Register a new agent & Redistribute all leads
export const createAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const agentExists = await Agent.findOne({ email });
    if (agentExists) {
      return res.status(400).json({ message: "Agent already exists!" });
    }

    // 1. Create the New Agent
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAgent = await Agent.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      leads: [], // Start with empty leads
    });

    // ============================================================
    // 🚀 NEW FEATURE: FULL RE-DISTRIBUTION LOGIC
    // ============================================================

    // Step A: Get ALL Leads currently in the system
    const allLeads = await Lead.find({});

    // Step B: Get ALL Agents (This includes the new one we just created)
    const allAgents = await Agent.find({});

    if (allLeads.length > 0 && allAgents.length > 0) {
      console.log(
        `[System] Starting Redistribution of ${allLeads.length} leads among ${allAgents.length} agents...`,
      );

      // Step C: CRITICAL STEP - WIPE ALL AGENTS' LEAD ARRAYS CLEAN
      // We set every agent's 'leads' array to empty [] so no one holds old references.
      await Agent.updateMany({}, { $set: { leads: [] } });

      // Step D: Loop through leads and assign them Round-Robin style
      for (let i = 0; i < allLeads.length; i++) {
        const lead = allLeads[i];

        // Calculate which agent gets this lead (0, 1, 0, 1...)
        const agentIndex = i % allAgents.length;
        const targetAgent = allAgents[agentIndex];

        // 1. Update the Lead (Set its new owner)
        await Lead.findByIdAndUpdate(lead._id, {
          assignedAgent: targetAgent._id,
        });

        // 2. Update the Agent (Push the lead ID into their clean array)
        await Agent.findByIdAndUpdate(targetAgent._id, {
          $push: { leads: lead._id },
        });
      }

      console.log(
        `[System] Redistributed ${allLeads.length} leads among ${allAgents.length} agents.`,
      );
    }
    // ============================================================

    if (newAgent) {
      res.status(201).json({
        _id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        mobile: newAgent.mobile,
        leads: newAgent.leads, // This might be empty in the response, but DB is updated
        message: "Agent created and existing leads redistributed!",
      });
    } else {
      res.status(400).json({ message: "Invalid agent data" });
    }
  } catch (error) {
    console.error("Create Agent Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    // Populate leads to show them on frontend
    const agents = await Agent.find().populate("leads");
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Agent & Redistribute Leads
export const deleteAgent = async (req, res) => {
  const { id } = req.params;

  try {
    const agentToDelete = await Agent.findById(id);
    if (!agentToDelete) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const leadsToRedistribute = agentToDelete.leads || []; // Array of Lead IDs

    // Find all OTHER agents
    const remainingAgents = await Agent.find({ _id: { $ne: id } });

    if (remainingAgents.length > 0 && leadsToRedistribute.length > 0) {
      // SCENARIO 1: Distribute leads among remaining agents
      for (let i = 0; i < leadsToRedistribute.length; i++) {
        const leadId = leadsToRedistribute[i];

        // Round Robin selection
        const targetAgentIndex = i % remainingAgents.length;
        const targetAgent = remainingAgents[targetAgentIndex];

        // 1. Update the Lead's assignedAgent field
        await Lead.findByIdAndUpdate(leadId, {
          assignedAgent: targetAgent._id,
        });

        // 2. Add the Lead ID to the new Agent's leads array
        await Agent.findByIdAndUpdate(targetAgent._id, {
          $push: { leads: leadId },
        });
      }
    } else if (remainingAgents.length === 0) {
      // SCENARIO 2: No agents left? Delete the leads.
      if (leadsToRedistribute.length > 0) {
        await Lead.deleteMany({ _id: { $in: leadsToRedistribute } });
      }
    }

    // Finally, remove the agent
    await Agent.findByIdAndDelete(id);

    res.json({ message: "Agent deleted and leads processed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
