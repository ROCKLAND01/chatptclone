/**
 * Typing Indicator Component
 * Shows animated dots while AI is generating response
 */

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 py-4 px-4 md:px-6 animate-fade-in">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      </div>

      {/* Typing animation */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
        <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
      </div>
    </div>
  );
}
