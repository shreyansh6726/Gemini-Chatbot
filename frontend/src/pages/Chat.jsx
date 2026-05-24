import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Bot, Image, Loader2, MessageSquareText, Send, ShieldCheck, Sparkles, User, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import './Chat.css';

const Chat = () => {
  const navigate = useNavigate();
  const textInputRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Gemini. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const suggestedPrompts = [
    'Summarize the changes in a clean UI audit.',
    'Suggest three improvements for the chat layout.',
    'Explain how to make the design feel more premium.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]; // Remove data URL prefix
      setSelectedImage({
        data: base64,
        type: file.type
      });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    fileInputRef.current.value = '';
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMsg = input.trim();
    const userImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Add user message to UI (with image if present)
    const newMessages = [...messages, { 
      id: Date.now(), 
      text: userMsg, 
      sender: 'user',
      image: userImage ? userImage.data : null,
      imageType: userImage ? userImage.type : null
    }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:8000';
      const response = await axios.post(`${backendUrl}/api/chat`, {
        message: userMsg,
        image: userImage ? userImage.data : null,
        image_type: userImage ? userImage.type : null
      });

      if (response.data && response.data.response) {
        setMessages([
          ...newMessages,
          { id: Date.now() + 1, text: response.data.response, sender: 'bot' }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        { id: Date.now() + 1, text: "Sorry, I encountered an error. Please try again.", sender: 'bot', isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <main className="chat-page__content">
        <header className="chat-topbar glass-panel hover-lift">
          <button className="icon-button icon-button--ghost" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
          </button>

          <div className="chat-topbar__brand">
            <div className="brand-mark">
              <Bot size={22} />
            </div>
            <div>
              <span className="section-kicker">Gemini Assistant</span>
              <strong className="chat-topbar__title">Conversation canvas</strong>
            </div>
          </div>

          <div className="status-chip">
            <Sparkles size={14} />
            <span>Vision + text ready</span>
          </div>
        </header>

        <div className="chat-grid">
          <aside className="chat-sidebar glass-panel">
            <div className="sidebar-hero">
              <span className="section-kicker">Assistant mode</span>
              <h2>Focused, visual, and easier to scan.</h2>
              <p>
                The layout now balances a calm conversation stream with a supporting rail for suggested prompts
                and quick context.
              </p>
            </div>

            <div className="sidebar-stack">
              <article className="sidebar-card hover-lift">
                <MessageSquareText size={18} />
                <div>
                  <strong>Cleaner structure</strong>
                  <p>Messages sit in a softer card system with better spacing and stronger readability.</p>
                </div>
              </article>

              <article className="sidebar-card hover-lift">
                <ShieldCheck size={18} />
                <div>
                  <strong>Image input kept visible</strong>
                  <p>Upload state is displayed directly in the composer so the workflow feels immediate.</p>
                </div>
              </article>
            </div>

            <div className="sidebar-section">
              <span className="section-kicker">Suggested prompts</span>
              <div className="prompt-stack">
                {suggestedPrompts.map((prompt) => (
                  <button key={prompt} className="prompt-button" type="button" onClick={() => handlePromptClick(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="chat-panel glass-panel">
            <div className="chat-panel__header">
              <div>
                <span className="section-kicker">Live thread</span>
                <h2 className="chat-panel__title">Ask, refine, iterate.</h2>
              </div>
              <p className="chat-panel__note">
                Smooth transitions, gentler colors, and more deliberate spacing keep the experience calm while it moves.
              </p>
            </div>

            <div className="chat-stream">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const bubbleClassName = [
                  'message-bubble',
                  isUser ? 'message-bubble--user' : 'message-bubble--bot',
                  msg.isError ? 'message-bubble--error' : ''
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <article key={msg.id} className={`message-row ${isUser ? 'message-row--user' : ''}`}>
                    <div className={`message-avatar ${isUser ? 'message-avatar--user' : 'message-avatar--bot'}`}>
                      {isUser ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={bubbleClassName}>
                      {msg.image && (
                        <img
                          src={`data:${msg.imageType};base64,${msg.image}`}
                          alt="User shared"
                          className="message-image"
                        />
                      )}
                      {isUser ? (
                        <p className="message-text">{msg.text}</p>
                      ) : (
                        <ReactMarkdown
                          className="chat-markdown"
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match ? match[1] : 'text';

                              if (inline) {
                                return (
                                  <code className="chat-inline-code" {...props}>
                                    {children}
                                  </code>
                                );
                              }

                              return (
                                <SyntaxHighlighter
                                  style={dracula}
                                  language={language}
                                  PreTag="div"
                                  customStyle={{ margin: '0.9rem 0', borderRadius: '18px' }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              );
                            }
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </article>
                );
              })}

              {isLoading && (
                <article className="message-row">
                  <div className="message-avatar message-avatar--bot">
                    <Bot size={18} />
                  </div>
                  <div className="message-bubble message-bubble--bot message-bubble--typing">
                    <Loader2 size={16} className="spin" />
                    <span>Gemini is thinking...</span>
                  </div>
                </article>
              )}

              <div ref={messagesEndRef} />
            </div>

            <footer className="chat-composer">
              {imagePreview && (
                <div className="composer-preview glass-panel">
                  <img src={imagePreview} alt="Preview" className="composer-preview__thumb" />
                  <div>
                    <strong>Image attached</strong>
                    <p>The assistant will consider it with the next message.</p>
                  </div>
                  <button type="button" onClick={clearImage} className="icon-button icon-button--ghost">
                    <X size={16} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="composer-form">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden-file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`icon-button ${isLoading ? 'is-disabled' : ''}`}
                  disabled={isLoading}
                  title="Upload image"
                >
                  <Image size={18} />
                </button>
                <input
                  ref={textInputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="text-input"
                />
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  className={`send-button ${(!input.trim() && !selectedImage) || isLoading ? 'is-disabled' : ''}`}
                >
                  <Send size={18} />
                </button>
              </form>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Chat;
