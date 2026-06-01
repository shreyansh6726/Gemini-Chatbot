import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Bot, Loader2, User } from 'lucide-react';

const Chat = () => {
  const shellRef = useRef(null);
  const textInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([{ id: 1, text: 'Hi there. How can I help you today?', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const root = shellRef.current;
    if (!root) return undefined;

    const elements = root.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -4% 0px' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [messages.length, isLoading, imagePreview]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages, isLoading]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMsg = input.trim();
    const userImage = selectedImage;

    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    const newMessages = [
      ...messages,
      {
        id: Date.now(),
        text: userMsg,
        sender: 'user',
        image: userImage ? userImage.data : null,
        imageType: userImage ? userImage.type : null
      }
    ];

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
        { id: Date.now() + 1, text: 'Sorry, I encountered an error. Please try again.', sender: 'bot', isError: true }
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        textInputRef.current?.focus();
      });
    }
  };

  return (
    <div className="chat-page">
      <main className="chat-shell" ref={shellRef}>
        <header className="chat-header" data-reveal>
          <div className="chat-brand">
            <Bot size={18} />
            <span>Gemini Chatbot</span>
          </div>
          <p className="chat-header__copy">A focused workspace for clear, professional conversations.</p>
        </header>

        <section className="chat-window" aria-label="Chat conversation" data-reveal>
          <div className="chat-messages">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <article
                  key={msg.id}
                  className={`chat-row ${isUser ? 'chat-row--user' : 'chat-row--bot'}`}
                  data-reveal
                >
                  <div className="chat-avatar">{isUser ? <User size={14} /> : <Bot size={14} />}</div>
                  <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--bot'} ${msg.isError ? 'chat-bubble--error' : ''}`}>
                    {msg.image && (
                      <img src={`data:${msg.imageType};base64,${msg.image}`} alt="Uploaded" className="chat-image" />
                    )}
                    <p>{msg.text}</p>
                  </div>
                </article>
              );
            })}

            {isLoading && (
              <article className="chat-row chat-row--bot" data-reveal>
                <div className="chat-avatar">
                  <Bot size={14} />
                </div>
                <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
                  <Loader2 size={14} className="chat-spinner" />
                  <span>Sending...</span>
                </div>
              </article>
            )}

            <div ref={messagesEndRef} />
          </div>

          <footer className="chat-composer" data-reveal>
            {imagePreview && (
              <div className="chat-preview">
                <img src={imagePreview} alt="Preview" className="chat-preview__image" />
                <span>Image attached</span>
                <button type="button" onClick={clearImage} className="chat-text-button">
                  Remove
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="chat-form">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="chat-file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="chat-text-button"
                disabled={isLoading}
              >
                Attach image
              </button>
              <input
                ref={textInputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                disabled={isLoading}
                className="chat-input"
              />
              <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading} className="chat-send-button">
                Send
              </button>
            </form>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Chat;
