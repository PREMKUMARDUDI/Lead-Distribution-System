import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [file, setFile] = useState(null);

  // Agent Form State
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [selectedCode, setSelectedCode] = useState("+91");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Common Country Codes
  const countryCodes = [
    { code: "+91", label: "India (+91)" },
    { code: "+1", label: "USA (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+971", label: "UAE (+971)" },
  ];

  useEffect(() => {
    if (!userInfo) navigate("/");
    fetchAgents();
  }, [navigate]);

  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/agents",
        config,
      );
      setAgents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAgentSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalAgentData = {
        ...newAgent,
        mobile: `${selectedCode} ${newAgent.mobile}`,
      };
      await axios.post(
        "http://localhost:5000/api/agents",
        finalAgentData,
        config,
      );
      alert("Agent Added Successfully!");
      setNewAgent({ name: "", email: "", mobile: "", password: "" });
      fetchAgents();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding agent!");
    }
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:5000/api/upload", formData, config);
      alert("File uploaded and distributed successfully!");
      fetchAgents(); // Refresh list to show new leads
    } catch (error) {
      alert("Upload failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dashboard - {userInfo?.username}</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/allAgents">
            <button
              className="action-btn"
              style={{ backgroundColor: "#17a2b8" }}
            >
              View All Agents Table
            </button>
          </Link>

          <Link to="/allLeads">
            <button
              className="action-btn"
              style={{ backgroundColor: "#28a745" }}
            >
              View Master Lead List
            </button>
          </Link>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="left-panel">
          {/* Add Agent */}
          <section className="agent-form-section">
            <h3>Add New Agent</h3>
            <form onSubmit={handleAgentSubmit}>
              <div className="form-group">
                <input
                  placeholder="Name"
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Email"
                  type="email"
                  value={newAgent.email}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, email: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group mobile-group">
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="code-select"
                >
                  {countryCodes.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Mobile Number"
                  type="number"
                  value={newAgent.mobile}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, mobile: e.target.value })
                  }
                  required
                  className="form-control mobile-input"
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Password"
                  type="password"
                  value={newAgent.password}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, password: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="action-btn">
                Add Agent
              </button>
            </form>
          </section>

          {/* Upload CSV */}
          <section className="upload-section">
            <h3>Upload Leads (CSV/XLSX)</h3>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
              accept=".csv, .xlsx, .xls"
            />
            <button onClick={handleFileUpload} className="action-btn">
              Upload & Distribute
            </button>
          </section>
        </div>

        <div className="right-panel">
          {/* Agent List & Leads */}
          <section className="agent-list-section">
            <h3>Agents & Distributed Lists</h3>

            {agents.length > 0 ? (
              agents.map((agent) => (
                <div key={agent._id} className="agent-card">
                  <div className="agent-header">
                    <span>
                      {agent.name} ({agent.email})
                    </span>
                    <span>Total Leads: {agent.leads.length}</span>
                  </div>
                  {agent.leads.length > 0 ? (
                    <table className="lead-table">
                      <thead>
                        <tr>
                          <th>Name</th>
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
                    <p>No leads assigned.</p>
                  )}
                </div>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No agents found.
                </td>
              </tr>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
