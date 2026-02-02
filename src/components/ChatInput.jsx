/**
 * Chat Input Component
 * Fixed bottom input area with send button and Enter key support
 */

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage, isLoading } = useChat();

  /**
   * Auto-resize textarea based on content
   */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  /**
   * Handle keyboard events (Enter to send, Shift+Enter for new line)
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-container">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="chat-input-wrapper flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ChatGPT..."
              disabled={isLoading}
              rows={1}
              className="chat-input flex-1 disabled:opacity-50 min-h-[48px] max-h-[200px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="m-1.5 p-2 rounded-lg transition-all duration-200
                         bg-[var(--accent-color)] text-white
                         hover:bg-[var(--accent-hover)]
                         disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500
                         disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
            >
              <Send size={18} />
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-[10px] text-[var(--text-muted)] mt-3 uppercase tracking-widest">
          Powered by Samson
        </p>
      </div>
    </div>
  );
}
