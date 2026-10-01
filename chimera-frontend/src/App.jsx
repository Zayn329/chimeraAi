import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ChatPage } from "./pages/ChatPage";
import { IngestPage } from "./pages/IngestPage";
import { TelemetryPage } from "./pages/TelemetryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/ingest" element={<IngestPage />} />
        <Route path="/telemetry" element={<TelemetryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
