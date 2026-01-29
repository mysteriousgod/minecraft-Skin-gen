import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MinecraftSkinEditor } from './components/MinecraftSkinEditor';
import { Home } from './pages/Home';
import { Documentation } from './pages/Documentation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<MinecraftSkinEditor />} />
        <Route path="/details" element={<Documentation />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
