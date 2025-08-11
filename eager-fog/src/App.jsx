// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global Layout Component
import SideNav from "./components/navigation/SideNav";

// Pages
import Home from "./pages/Home";
import Buyers from "./pages/Buyers";
import Sellers from "./pages/Sellers";
import Matches from "./pages/Matches";
import Workbench from "./pages/Workbench";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Global Side Navigation */}
        <SideNav />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/workbench/:matchId" element={<Workbench />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
