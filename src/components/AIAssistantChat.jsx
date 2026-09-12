import React, { useState, useEffect, useRef, memo } from 'react';
import './AIAssistantChat.css';

const AIAssistantChat = memo(({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm Abdullah's AI Assistant. What would you like to know about his skills, experience, or projects?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = userMessage.toLowerCase();
      
      const intents = [
        {
          keywords: ['skill', 'tech', 'stack', 'language', 'framework', 'react', 'next', 'node', 'code'],
          response: "Abdullah is a Full Stack Developer specializing in React, Next.js, Node.js, TypeScript, and modern animations (like GSAP). He focuses on building incredibly fast, premium interfaces!"
        },
        {
          keywords: ['project', 'work', 'portfolio', 'built', 'experience', 'made'],
          response: "Abdullah has built amazing projects like WHITE Fintech (fintech website), Lucent AI (AEO agency site), and high-end portfolios. You can check them out in the Projects section!"
        },
        {
          keywords: ['contact', 'hire', 'email', 'reach', 'talk', 'message', 'freelance', 'job'],
          response: "You can reach Abdullah directly via the Contact form, or shoot him an email. He's currently open to discussing new opportunities and freelance work!"
        },
        {
          keywords: ['github', 'twitter', 'social', 'linkedin'],
          response: "You can find Abdullah on GitHub and Twitter @abdullah-codes7. Feel free to connect and check out his open source contributions!"
        },
        {
          keywords: ['where', 'location', 'from', 'country', 'city', 'timezone'],
          response: "Abdullah is based in Pakistan! His local timezone is PKT (Asia/Karachi)."
        },
        {
          keywords: ['education', 'study', 'university', 'degree', 'learn'],
          response: "Abdullah is a highly driven Full Stack Developer with a deep passion for continuous learning, always pushing the boundaries of modern web technologies."
        },
        {
          keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo'],
          response: "Hello there! I'm Abdullah's AI Assistant. How can I help you today?"
        },
        {
          keywords: ['who are you', 'what are you', 'your name', 'bot', 'ai'],
          response: "I'm a simulated AI assistant built right into this portfolio! My job is to answer your questions about Abdullah."
        },
        {
          keywords: ['resume', 'cv', 'download'],
          response: "You can request Abdullah's full resume by reaching out via the Contact page!"
        },
        {
          keywords: ['thanks', 'thank you', 'cool', 'awesome', 'nice', 'good'],
          response: "You're very welcome! Let me know if you want to know anything else."
        },
        {
          keywords: ['bye', 'goodbye', 'cya', 'see ya'],
          response: "Goodbye! Have a great day!"
        }
      ];

      let response = "I'm a bit limited in what I know since I'm just a simulated assistant! If you want to know more, you should definitely send Abdullah a message through the Contact page.";
      
      for (const intent of intents) {
        if (intent.keywords.some(keyword => lowerInput.includes(keyword))) {
          response = intent.response;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s - 2.5s simulated delay
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-window">
      <div className="ai-chat-header">
        <div className="ai-chat-header-info">
          <div className="ai-chat-avatar-wrapper">
            <svg viewBox="0 0 100 100" className="ai-chat-avatar-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="aiChatGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <path 
                d="M 20 50 C 20 25, 30 15, 50 15 C 70 15, 80 25, 80 50 C 80 65, 75 75, 60 75 L 70 85 L 50 80 C 30 80, 20 70, 20 50 Z" 
                fill="url(#aiChatGlow)" 
              />
              <rect x="38" y="38" width="8" height="20" rx="4" fill="#ffffff" />
              <rect x="54" y="38" width="8" height="20" rx="4" fill="#ffffff" />
            </svg>
          </div>
          <div className="ai-chat-title">
            <h4>AI Assistant</h4>
            <span className="ai-chat-status">
              <span className="status-dot"></span> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="ai-chat-close-btn" aria-label="Close Chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message-row ${msg.role}`}>
            <div className={`ai-message-bubble ${msg.role}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="ai-message-row ai">
            <div className="ai-message-bubble ai typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..." 
          className="ai-chat-input"
        />
        <button type="submit" className={`ai-chat-send-btn ${input.trim() ? 'active' : ''}`} disabled={!input.trim() || isTyping}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>
  );
});

export default AIAssistantChat;
