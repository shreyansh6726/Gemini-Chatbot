import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="icon-wrapper">
          <Bot size={48} className="bot-icon" />
        </div>
        <h1 className="hero-title">
          Meet <span className="gradient-text">Gemini</span>
        </h1>
        <p className="hero-subtitle">
          Your intelligent AI assistant powered by Google's Gemini 2.5 Flash model. 
          Experience blazing fast responses and live search capabilities.
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <Sparkles className="feature-icon" />
            <h3>Lightning Fast</h3>
            <p>Powered by the optimized Gemini 2.5 Flash model for instant answers.</p>
          </div>
          <div className="feature-card">
            <Bot className="feature-icon" />
            <h3>Conversational</h3>
            <p>Maintains context and understands nuances in your ongoing dialogue.</p>
          </div>
        </div>

        <button 
          className="start-chat-btn"
          onClick={() => navigate('/chat')}
        >
          <span>Start Chatting</span>
          <ArrowRight size={20} />
        </button>
      </div>
      
      {/* Background decorative elements */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
    </div>
  );
};

export default Home;
