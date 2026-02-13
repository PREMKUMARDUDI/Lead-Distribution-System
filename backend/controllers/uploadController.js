import Agent from "../models/Agent.js";
import Lead from "../models/Lead.js";
import xlsx from "xlsx";
import fs from "fs";

export const uploadLeads = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // 1. Read File
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // 2. Validate Data Format
    const validLeads = data.filter((row) => row.FirstName && row.Phone);
    if (validLeads.length === 0) {
      fs.unlinkSync(req.file.path); // Clean up
      return res
        .status(400)
        .json({ message: "Invalid file format or empty file" });
    }

    // 3. Get all agents
    const agents = await Agent.find();
    if (agents.length === 0) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ message: "No agents available to distribute leads" });
    }

    // 4. Distribute Leads
    const leadsToInsert = [];
    const agentUpdates = {}; // Map to track leads per agent to minimize DB calls

    // Initialize agent updates map
    agents.forEach((agent) => {
      agentUpdates[agent._id] = [];
    });

    validLeads.forEach((row, index) => {
      // Sequential Distribution Logic (Round Robin)
      // If index is 0, agentIndex is 0. If index is 5 (and 5 agents), agentIndex is 0 again.
      const agentIndex = index % agents.length;
      const selectedAgent = agents[agentIndex];

      const newLead = {
        firstName: row.FirstName,
        phone: row.Phone,
        notes: row.Notes || "",
        assignedAgent: selectedAgent._id,
        createdBy: req.user._id,
      };

      leadsToInsert.push(newLead);
    });

    // 5. Bulk Insert Leads
    const insertedLeads = await Lead.insertMany(leadsToInsert);

    // 6. Update Agents with new Lead IDs
    // We iterate through inserted leads to push their IDs to the correct agent
    for (const lead of insertedLeads) {
      await Agent.findByIdAndUpdate(lead.assignedAgent, {
        $push: { leads: lead._id },
      });
    }

    // 7. Cleanup file
    fs.unlinkSync(req.file.path);

    res
      .status(201)
      .json({ message: "Leads processed and distributed successfully" });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "File processing failed" });
  }
};
