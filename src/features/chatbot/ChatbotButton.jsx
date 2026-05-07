import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import AIChatbot from './AIChatbot.jsx';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-lavender-600 to-lavender-700 rounded-full shadow-2xl flex items-center justify-center hover:shadow-lavender-600/50 transition-shadow"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            >
              AI
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <AIChatbot
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            isMinimized={isMinimized}
            onToggleMinimize={() => setIsMinimized(!isMinimized)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
