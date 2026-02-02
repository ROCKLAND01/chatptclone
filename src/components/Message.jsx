/**
 * Message Component
 * Displays individual chat messages with proper styling and markdown support
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot } from 'lucide-react';

export default function Message({ message, isStreaming = false }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  /**
   * Copy message content to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Custom renderer for code blocks
   */
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    if (!inline && match) {
      return (
        <div className="code-block-wrapper my-3">
          <div className="code-block-header">
            <span>{language}</span>
            <button
              onClick={() => navigator.clipboard.writeText(String(children))}
              className="code-block-copy flex items-center gap-1"
            >
              <Copy size={12} />
              Copy code
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div
      className={`flex gap-3 py-4 px-4 md:px-6 animate-fade-in ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`relative group ${
          isUser
            ? 'message-bubble message-user'
            : 'max-w-[85%] md:max-w-[75%]'
        }`}
      >
        {isUser ? (
          <p className="body-text whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && <span className="typewriter-cursor" />}
          </div>
        )}

        {/* Copy button for AI messages */}
        {!isUser && !isStreaming && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 
                       transition-opacity duration-200 flex items-center gap-1.5 
                       text-xs text-gray-500 hover:text-gray-700"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
}
