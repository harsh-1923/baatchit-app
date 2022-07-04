import React from "react";

import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext.js";

import Chats from "./componets/Chats.jsx";
import Login from "./componets/Login.jsx";

function App() {
  return (
    <AuthProvider>
      <div style={{ fontFamily: "Avenir" }}>
        <Routes>
          <Route path="/chats" element={<Chats />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
