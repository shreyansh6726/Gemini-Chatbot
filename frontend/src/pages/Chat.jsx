import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Bot, User, ArrowLeft, Loader2, Image, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Gemini. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const styles = {
    layout: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0a0a0f'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '1.25rem 2rem',
      background: 'rgba(20, 20, 25, 0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    backBtn: {
      background: 'transparent',
      border: 'none',
      color: '#a0a0b0',
      cursor: 'pointer',
      padding: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      marginRight: '1rem'
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    chatContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '2rem',
      scrollBehavior: 'smooth'
    },
    messagesArea: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    messageWrapper: {
      display: 'flex',
      gap: '1rem',
      maxWidth: '85%'
    },
    userMessageWrapper: {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse'
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#13131a',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      flexShrink: 0
    },
    userAvatar: {
      background: 'linear-gradient(135deg, #6366f1, #818cf8)',
      border: 'none'
    },
    botAvatar: {
      color: '#6366f1'
    },
    messageBubble: {
      padding: '1rem 1.25rem',
      borderRadius: '18px',
      fontSize: '0.95rem',
      lineHeight: 1.6,
      wordBreak: 'break-word'
    },
    botBubble: {
      background: '#1e1e28',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderTopLeftRadius: '4px'
    },
    userBubble: {
      background: '#4f46e5',
      borderTopRightRadius: '4px'
    },
    errorBubble: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#fca5a5'
    },
    messageImage: {
      maxWidth: '100%',
      maxHeight: '400px',
      borderRadius: '12px',
      marginBottom: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'block'
    },
    typingBubble: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#a0a0b0',
      fontStyle: 'italic'
    },
    inputArea: {
      padding: '1.5rem 2rem',
      background: '#0a0a0f',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    },
    imagePreviewBar: {
      maxWidth: '800px',
      margin: '0 auto 1rem auto',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: '#13131a',
      padding: '1rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    previewThumbnail: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      objectFit: 'cover',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    previewText: {
      flex: 1,
      color: '#a0a0b0',
      fontSize: '0.9rem'
    },
    clearImageBtn: {
      background: 'transparent',
      border: 'none',
      color: '#a0a0b0',
      cursor: 'pointer',
      padding: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px'
    },
    inputForm: {
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    imageBtn: {
      background: 'transparent',
      color: '#6366f1',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0
    },
    textInput: {
      flex: 1,
      background: '#13131a',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '1rem 1.5rem',
      color: 'white',
      fontSize: '1rem',
      fontFamily: 'inherit',
      minWidth: 0
    },
    sendBtn: {
      background: '#6366f1',
      color: 'white',
      border: 'none',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0
    },
    disabledBtn: {
      background: '#13131a',
      color: '#a0a0b0',
      cursor: 'not-allowed'
    },
    markdownLink: {
      color: '#4a9eff',
      textDecoration: 'underline'
    }
  };

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
    <div style={styles.layout}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <div style={styles.headerTitle}>
          <Bot size={24} color="#6366f1" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Gemini Assistant</h2>
        </div>
      </header>

      <main style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{ ...styles.messageWrapper, ...(msg.sender === 'user' ? styles.userMessageWrapper : {}) }}
            >
              <div
                style={{
                  ...styles.avatar,
                  ...(msg.sender === 'user' ? styles.userAvatar : styles.botAvatar)
                }}
              >
                {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === 'bot' ? styles.botBubble : styles.userBubble),
                  ...(msg.isError ? styles.errorBubble : {})
                }}
              >
                {msg.image && (
                  <img src={`data:${msg.imageType};base64,${msg.image}`} alt="User shared" style={styles.messageImage} />
                )}
                {msg.sender === 'bot' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : 'text';
                        
                        if (inline) {
                          return (
                            <code style={{ background: '#111827', padding: '0.1rem 0.3rem', borderRadius: '4px' }} {...props}>
                              {children}
                            </code>
                          );
                        }
                        
                        return (
                          <SyntaxHighlighter
                            style={dracula}
                            language={language}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      },
                      p: ({ node, children }) => <p style={{ margin: '0.5em 0' }}>{children}</p>,
                      h1: ({ node, children }) => <h1 style={{ marginTop: '0.5em', marginBottom: '0.25em', fontSize: '1.5em' }}>{children}</h1>,
                      h2: ({ node, children }) => <h2 style={{ marginTop: '0.5em', marginBottom: '0.25em', fontSize: '1.25em' }}>{children}</h2>,
                      h3: ({ node, children }) => <h3 style={{ marginTop: '0.4em', marginBottom: '0.2em', fontSize: '1.1em' }}>{children}</h3>,
                      ul: ({ node, children }) => <ul style={{ marginLeft: '1.5em', marginTop: '0.3em', marginBottom: '0.3em' }}>{children}</ul>,
                      ol: ({ node, children }) => <ol style={{ marginLeft: '1.5em', marginTop: '0.3em', marginBottom: '0.3em' }}>{children}</ol>,
                      blockquote: ({ node, children }) => (
                        <blockquote style={{
                          borderLeft: '4px solid #ccc',
                          paddingLeft: '1em',
                          marginLeft: '0',
                          marginTop: '0.3em',
                          marginBottom: '0.3em',
                          opacity: 0.8
                        }}>
                          {children}
                        </blockquote>
                      ),
                      table: ({ node, children }) => (
                        <table style={{
                          borderCollapse: 'collapse',
                          width: '100%',
                          marginTop: '0.5em',
                          marginBottom: '0.5em'
                        }}>
                          {children}
                        </table>
                      ),
                      th: ({ node, children }) => (
                        <th style={{
                          border: '1px solid #ddd',
                          padding: '0.5em',
                          textAlign: 'left',
                          backgroundColor: '#f5f5f5'
                        }}>
                          {children}
                        </th>
                      ),
                      td: ({ node, children }) => (
                        <td style={{
                          border: '1px solid #ddd',
                          padding: '0.5em'
                        }}>
                          {children}
                        </td>
                      ),
                      a: ({ node, children, ...props }) => (
                        <a style={styles.markdownLink} {...props}>
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p style={{ margin: 0 }}>{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={styles.messageWrapper}>
              <div style={{ ...styles.avatar, ...styles.botAvatar }}>
                <Bot size={20} />
              </div>
              <div style={{ ...styles.messageBubble, ...styles.botBubble, ...styles.typingBubble }}>
                <Loader2 size={16} />
                <span>Gemini is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer style={styles.inputArea}>
        {imagePreview && (
          <div style={styles.imagePreviewBar}>
            <img src={imagePreview} alt="Preview" style={styles.previewThumbnail} />
            <span style={styles.previewText}>Image selected</span>
            <button type="button" onClick={clearImage} style={styles.clearImageBtn}>
              <X size={16} />
            </button>
          </div>
        )}
        <form onSubmit={handleSend} style={styles.inputForm}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ ...styles.imageBtn, ...(isLoading ? styles.disabledBtn : {}) }}
            disabled={isLoading}
            title="Upload image"
          >
            <Image size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            style={styles.textInput}
          />
          <button 
            type="submit" 
            disabled={(!input.trim() && !selectedImage) || isLoading}
            style={{
              ...styles.sendBtn,
              ...((!input.trim() && !selectedImage) || isLoading ? styles.disabledBtn : {})
            }}
          >
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
