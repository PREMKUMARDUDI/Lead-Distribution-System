import React, { useState, useEffect } from "react";
import { clientServer } from "../serverConfig";
import { Link, useNavigate } from "react-router-dom";
import "./AllAgents.css";

const AllAgents = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

  // Get User Info for Token
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      fetchAgents();
    }
  }, [navigate]);

  const fetchAgents = async () => {
    try {
      // Reusing the existing API that already populates leads
      const { data } = await clientServer.get("/api/agents", config);
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents", error);
      alert("Failed to load agents");
    }
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? Their leads will be redistributed.`,
      )
    ) {
      try {
        await clientServer.delete(`/api/agents/${id}`, config);
        alert("Agent deleted. Leads have been redistributed.");
        fetchAgents(); // Refresh the list to see changes
      } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="all-agents-container">
      <div className="page-header">
        <h1>All Agents & Assignments</h1>
        <div>
          <Link to="/allLeads">
            <button
              className="action-btn"
              style={{ backgroundColor: "#28a745" }}
            >
              View Master Lead List
            </button>
          </Link>

          <Link to="/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <table className="agents-table">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Agent Name</th>
            <th style={{ width: "15%" }}>Email / Mobile</th>
            <th style={{ width: "65%" }}>Assigned Leads (Distributed)</th>
            <th style={{ width: "10%" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {agents.length > 0 ? (
            agents.map((agent) => (
              <tr key={agent._id}>
                <td>
                  <strong>{agent.name}</strong>
                </td>
                <td>
                  <div style={{ color: "gray" }}>{agent.email}</div>
                  <div style={{ color: "gray", fontSize: "0.9rem" }}>
                    {agent.mobile}
                  </div>
                </td>
                <td>
                  {agent.leads && agent.leads.length > 0 ? (
                    <table className="nested-leads-table">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Phone</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agent.leads.map((lead) => (
                          <tr key={lead._id}>
                            <td>{lead.firstName}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="no-leads">No leads assigned yet.</span>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(agent._id, agent.name)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No agents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllAgents;
