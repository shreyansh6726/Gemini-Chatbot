import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    },
    content: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '800px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    },
    iconWrapper: {
      background: 'linear-gradient(135deg, #6366f1, #ec4899)',
      padding: '1.5rem',
      borderRadius: '24px',
      boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
      marginBottom: '1rem'
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 7vw, 4rem)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      margin: 0
    },
    gradientText: {
      background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#a0a0b0',
      maxWidth: '600px',
      lineHeight: 1.6
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      width: '100%',
      margin: '2rem 0'
    },
    featureCard: {
      background: '#13131a',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'left'
    },
    featureTitle: {
      fontSize: '1.2rem',
      marginBottom: '0.5rem'
    },
    featureBody: {
      color: '#a0a0b0',
      fontSize: '0.9rem',
      lineHeight: 1.5
    },
    button: {
      background: '#ffffff',
      color: '#000000',
      border: 'none',
      borderRadius: '30px',
      padding: '1rem 2.5rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(255, 255, 255, 0.1)'
    },
    glowBase: {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(100px)',
      zIndex: 1,
      opacity: 0.5
    },
    glow1: {
      background: '#6366f1',
      width: '500px',
      height: '500px',
      top: '-100px',
      left: '-100px'
    },
    glow2: {
      background: '#ec4899',
      width: '400px',
      height: '400px',
      bottom: '-50px',
      right: '-50px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <Bot size={48} color="#ffffff" />
        </div>
        <h1 style={styles.heroTitle}>
          Meet <span style={styles.gradientText}>Gemini</span>
        </h1>
        <p style={styles.subtitle}>
          Your intelligent AI assistant powered by Google's Gemini 2.5 Flash model. 
          Experience blazing fast responses and live search capabilities.
        </p>
        
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <Sparkles color="#6366f1" style={{ marginBottom: '1rem' }} />
            <h3 style={styles.featureTitle}>Lightning Fast</h3>
            <p style={styles.featureBody}>Powered by the optimized Gemini 2.5 Flash model for instant answers.</p>
          </div>
          <div style={styles.featureCard}>
            <Bot color="#6366f1" style={{ marginBottom: '1rem' }} />
            <h3 style={styles.featureTitle}>Conversational</h3>
            <p style={styles.featureBody}>Maintains context and understands nuances in your ongoing dialogue.</p>
          </div>
        </div>

        <button 
          style={styles.button}
          onClick={() => navigate('/chat')}
        >
          <span>Start Chatting</span>
          <ArrowRight size={20} />
        </button>
      </div>
      
      <div style={{ ...styles.glowBase, ...styles.glow1 }} />
      <div style={{ ...styles.glowBase, ...styles.glow2 }} />
    </div>
  );
};

export default Home;
