import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AllAgents.css"; // Reusing your existing table styles

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Define config at the top level
  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  useEffect(() => {
    if (!userInfo) navigate("/");
    fetchLeads();
  }, [navigate]);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/leads",
        config,
      );
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete lead "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`, config);
        alert("Lead deleted successfully.");
        fetchLeads(); // Refresh table
      } catch (error) {
        console.error(error);
        alert("Failed to delete lead.");
      }
    }
  };

  return (
    <div className="all-agents-container">
      <div className="page-header">
        <h1>All Leads Master List ({leads.length})</h1>
        <div>
          <Link to="/allAgents">
            <button
              className="action-btn"
              style={{ backgroundColor: "#17a2b8" }}
            >
              View All Agents Table
            </button>
          </Link>

          <Link to="/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="agents-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Notes</th>
              <th>Assigned Agent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead, index) => (
                <tr key={lead._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{lead.firstName}</strong>
                  </td>
                  <td>{lead.phone}</td>
                  <td style={{ maxWidth: "200px", fontSize: "0.9rem" }}>
                    {lead.notes || "-"}
                  </td>

                  {/* Display Assigned Agent Name */}
                  <td
                    style={{
                      color: lead.assignedAgent ? "#28a745" : "#dc3545",
                    }}
                  >
                    {lead.assignedAgent ? (
                      <>
                        <strong>{lead.assignedAgent.name}</strong>
                      </>
                    ) : (
                      <em>Unassigned</em>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(lead._id, lead.firstName)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
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
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No leads found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllLeads;
