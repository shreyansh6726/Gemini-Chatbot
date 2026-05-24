import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  const shellStyles = {
    appShell: {
      position: 'relative',
      minHeight: '100vh',
      isolation: 'isolate',
      overflow: 'hidden'
    },
    grid: {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage:
        'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      backgroundSize: '140px 140px',
      opacity: 0.2,
      maskImage: 'radial-gradient(circle at center, black, transparent 92%)'
    },
    orb: {
      position: 'fixed',
      pointerEvents: 'none',
      borderRadius: '50%',
      filter: 'blur(60px)',
      opacity: 0.5,
      animation: 'orbit 18s ease-in-out infinite'
    },
    orbOne: {
      top: '-8rem',
      left: '-6rem',
      width: '28rem',
      height: '28rem',
      background: 'radial-gradient(circle, rgba(110, 231, 216, 0.26), transparent 68%)'
    },
    orbTwo: {
      right: '-5rem',
      bottom: '8rem',
      width: '24rem',
      height: '24rem',
      background: 'radial-gradient(circle, rgba(255, 184, 107, 0.2), transparent 70%)',
      animationDelay: '-6s'
    }
  };

  return (
    <Router>
      <div style={shellStyles.appShell}>
        <div style={shellStyles.grid} />
        <div style={{ ...shellStyles.orb, ...shellStyles.orbOne }} />
        <div style={{ ...shellStyles.orb, ...shellStyles.orbTwo }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
