import React, { createContext, useState, useEffect, useCallback } from "react";
import { clientServer } from "../serverConfig";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get User Token
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = {
    headers: { Authorization: `Bearer ${userInfo?.token}` },
  };

  // 1. Define Fetch Functions (Wrapped in useCallback for stability)
  const fetchAgents = useCallback(async () => {
    try {
      if (!userInfo) return;
      const { data } = await clientServer.get("/api/agents", config);
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  }, [userInfo?.token]);

  const fetchLeads = useCallback(async () => {
    try {
      if (!userInfo) return;
      const { data } = await clientServer.get("/api/leads", config);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }, [userInfo?.token]);

  // 2. Initial Data Load
  useEffect(() => {
    if (userInfo) {
      Promise.all([fetchAgents(), fetchLeads()]).then(() => setLoading(false));
    }
  }, []); // Empty dependency array = Runs ONLY once on app start

  return (
    <DataContext.Provider
      value={{
        agents,
        leads,
        loading,
        fetchAgents, // Expose these so pages can force a refresh
        fetchLeads,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
