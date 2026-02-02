/**
 * Chat Container Component
 * Main chat area with messages and auto-scroll
 */

import { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import { MessageSquare } from 'lucide-react';

export default function ChatContainer() {
  const { messages, isLoading, streamingMessage, error } = useChat();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessage, isLoading]);

  /**
   * Empty state when no messages
   */
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
            <MessageSquare size={32} className="text-[var(--accent-color)]" />
          </div>
          <h2 className="heading-2 text-[var(--text-primary)] mb-3">How can I help you today?</h2>
          <p className="body-text text-[var(--text-secondary)]">
            Start a conversation by typing a message below. I can help with coding, 
            writing, analysis, and answering questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin"
    >
      <div className="max-w-3xl mx-auto">
        {/* Messages */}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}

        {/* Streaming message (typing effect) */}
        {isLoading && streamingMessage && (
          <Message
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingMessage,
            }}
            isStreaming={true}
          />
        )}

        {/* Typing indicator */}
        {isLoading && !streamingMessage && <TypingIndicator />}

        {/* Error message */}
        {error && (
          <div className="px-4 md:px-6 py-3">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
