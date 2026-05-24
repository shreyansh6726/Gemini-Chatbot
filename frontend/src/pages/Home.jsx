import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, PanelTop, ShieldCheck, Wand2 } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const revealRefs = useRef([]);

  const setRevealRef = (node) => {
    if (node && !revealRefs.current.includes(node)) {
      revealRefs.current.push(node);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealRefs.current.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const metrics = [
    { value: 'Calm', label: 'Conversation rhythm' },
    { value: 'Smooth', label: 'Hover + scroll motion' },
    { value: 'Clear', label: 'Visual hierarchy' }
  ];

  const features = [
    {
      icon: <Wand2 size={20} />,
      title: 'Deliberate responses',
      description: 'Structured answers that feel composed, readable, and calm instead of noisy or mechanical.'
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Vision-ready workflow',
      description: 'The assistant keeps image uploads and text in the same flow, so the conversation feels continuous.'
    },
    {
      icon: <PanelTop size={20} />,
      title: 'Polished presentation',
      description: 'Soft depth, glass surfaces, and responsive motion make the app feel crafted rather than templated.'
    }
  ];

  return (
    <div className="home-page">
      <main className="home-page__content">
        <header className="home-topbar glass-panel hover-lift reveal" ref={setRevealRef}>
          <div className="brand-lockup">
            <div className="brand-lockup__icon">
              <Bot size={22} />
            </div>
            <div className="brand-lockup__copy">
              <span className="brand-lockup__eyebrow">Gemini Chatbot</span>
              <strong>Assistant Studio</strong>
            </div>
          </div>
          <div className="topbar-chips">
            <span className="pill">Image aware</span>
            <span className="pill">Markdown output</span>
            <span className="pill">Smooth motion</span>
          </div>
        </header>

        <section className="hero-panel glass-panel reveal" ref={setRevealRef}>
          <div className="hero-panel__copy">
            <span className="section-kicker">Built to feel considered</span>
            <h1 className="hero-title">
              Meet <span className="hero-title__accent">Gemini</span>, wrapped in a calmer interface.
            </h1>
            <p className="hero-copy">
              A polished assistant surface for fast answers, image-aware prompts, and clear markdown rendering.
              The layout leans into depth, rhythm, and motion so the product feels intentionally designed.
            </p>

            <div className="hero-actions">
              <button className="cta-button" onClick={() => navigate('/chat')}>
                <span>Start chatting</span>
                <ArrowRight size={18} />
              </button>
              <span className="hero-meta">No clutter, no filler, just a focused conversation flow.</span>
            </div>
          </div>

          <div className="hero-panel__preview hover-lift">
            <div className="preview-card">
              <div className="preview-card__header">
                <span className="preview-card__dot" />
                <span>Conversation preview</span>
              </div>
              <div className="preview-stack">
                <div className="preview-bubble preview-bubble--bot">
                  I can help you shape responses, organize thoughts, or inspect an image with the same polished flow.
                </div>
                <div className="preview-bubble preview-bubble--user">
                  Make the interface feel premium and smooth.
                </div>
                <div className="preview-bubble preview-bubble--bot preview-bubble--accent">
                  The current experience now uses layered glass surfaces, soft reveal motion, and stronger spacing.
                </div>
              </div>
              <div className="preview-card__footer">
                <span>Readable</span>
                <span>Responsive</span>
                <span>Professional</span>
              </div>
            </div>
          </div>
        </section>

        <section className="metrics-grid">
          {metrics.map((metric, index) => (
            <article
              className={`metric-card glass-panel hover-lift reveal reveal-delay-${index + 1}`}
              key={metric.label}
              ref={setRevealRef}
            >
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section className="feature-section">
          <div className="section-heading reveal" ref={setRevealRef}>
            <span className="section-kicker">What changed</span>
            <h2 className="section-title">More depth, more motion, less template energy.</h2>
            <p className="section-copy">
              Each surface, card, and button now has a clearer hierarchy and a softer interaction model.
              The result is a UI that feels made rather than assembled.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <article
                className={`feature-card glass-panel hover-lift reveal reveal-delay-${index + 1}`}
                key={feature.title}
                ref={setRevealRef}
              >
                <div className="feature-card__icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="story-panel glass-panel reveal" ref={setRevealRef}>
          <div>
            <span className="section-kicker">Designed for flow</span>
            <h2 className="section-title">The app now carries a stronger visual point of view.</h2>
          </div>
          <p className="section-copy section-copy--compact">
            Aurora glows, soft borders, layered glass, and subtle motion work together to make the experience
            feel premium without becoming busy.
          </p>
          <button className="cta-button cta-button--secondary" onClick={() => navigate('/chat')}>
            <span>Open the assistant</span>
            <ArrowRight size={18} />
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;
