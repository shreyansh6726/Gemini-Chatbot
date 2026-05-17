import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Bot, User, ArrowLeft, Loader2 } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Gemini. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    
    // Add user message to UI
    const newMessages = [...messages, { id: Date.now(), text: userMsg, sender: 'user' }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND || 'http://localhost:8000';
      const response = await axios.post(`${backendUrl}/api/chat`, {
        message: userMsg
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
    <div className="chat-layout">
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-title">
          <Bot size={24} className="bot-icon-small" />
          <h2>Gemini Assistant</h2>
        </div>
      </header>

      <main className="chat-container">
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="avatar">
                {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-wrapper bot">
              <div className="avatar">
                <Bot size={20} />
              </div>
              <div className="message-bubble typing">
                <Loader2 size={16} className="spinner" />
                <span>Gemini is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-input-area">
        <form onSubmit={handleSend} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="text-input"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="send-btn"
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
