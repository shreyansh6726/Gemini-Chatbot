import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <div className="app-shell__grid" />
        <div className="app-shell__orb app-shell__orb--one" />
        <div className="app-shell__orb app-shell__orb--two" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
