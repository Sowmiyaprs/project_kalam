import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import Card from '../../shared/components/Card.jsx';
import chatbotService from '../../services/ai/ChatbotService.js';
import enhancedStorage from '../../services/storage/EnhancedStorageService.js';
import { useAnalysis } from '../../hooks/useAnalysis.js';

export default function AIChatbot({ isOpen, onClose, isMinimized, onToggleMinimize }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { getLatest } = useAnalysis();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = () => {
    const history = enhancedStorage.getChatHistory();
    if (history.length === 0) {
      // Welcome message
      const welcomeMsg = {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your AI wellness companion. I'm here to support you on your emotional wellness journey. How are you feeling today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    } else {
      setMessages(history);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    enhancedStorage.saveChatMessage('user', inputMessage);
    setInputMessage('');
    setIsTyping(true);

    // Get latest analysis for context
    const latestAnalysis = getLatest();
    const emotionalState = latestAnalysis?.emotionalState || null;
    const metrics = latestAnalysis?.metrics || null;

    // Simulate typing delay
    setTimeout(() => {
      const response = chatbotService.getResponse(inputMessage, emotionalState, metrics);
      
      const assistantMessage = {
        id: `msg_${Date.now()}_bot`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      enhancedStorage.saveChatMessage('assistant', response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => sendMessage(), 100);
  };

  const clearChat = () => {
    if (confirm('Clear all chat history?')) {
      enhancedStorage.clearChatHistory();
      loadChatHistory();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 z-50 w-full max-w-md"
    >
      <Card variant="elevated" className="shadow-2xl border-lavender-300 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-lavender-600" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">AI Wellness Companion</h3>
              <p className="text-xs text-neutral-500">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMinimize}
              className="p-2 hover:bg-neutral-100 rounded-lg transition text-neutral-600"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-lavender-600' 
                      : 'bg-gradient-to-br from-lavender-500 to-lavender-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-lavender-600 text-white'
                        : 'bg-white text-neutral-900 border border-neutral-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-500 to-lavender-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-neutral-200 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-neutral-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-neutral-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-neutral-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-neutral-200 bg-white">
              <div className="flex flex-wrap gap-2">
                {chatbotService.getQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.label)}
                    className="px-3 py-1 bg-neutral-100 hover:bg-lavender-100 hover:text-lavender-700 rounded-full text-xs transition flex items-center gap-1 text-neutral-700"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition text-sm text-neutral-900 placeholder-neutral-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-lavender-600 hover:bg-lavender-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition text-white"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={clearChat}
                className="text-xs text-neutral-500 hover:text-neutral-700 mt-2 transition"
              >
                Clear chat history
              </button>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-4 text-center text-neutral-600 text-sm">
            Chat minimized. Click to expand.
          </div>
        )}
      </Card>
    </motion.div>
  );
}
