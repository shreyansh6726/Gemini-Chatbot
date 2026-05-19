import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#0a0a0f';
    document.body.style.color = '#f0f0f5';
    document.body.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';

    return () => {
      document.body.style.margin = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.fontFamily = '';
      document.body.style.minHeight = '';
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
