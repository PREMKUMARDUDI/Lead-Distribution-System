import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllAgents from "./pages/AllAgents";
import AllLeads from "./pages/AllLeads";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allAgents" element={<AllAgents />} />
        <Route path="/allLeads" element={<AllLeads />} />
      </Routes>
    </Router>
  );
}

export default App;
