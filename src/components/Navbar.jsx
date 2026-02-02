/**
 * Navbar Component
 * Top navigation with user info and clear chat button
 */

import { UserButton, useUser } from '@clerk/clerk-react';
import { Trash2, Menu, X, PanelLeft } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user } = useUser();
  const { clearChat, messages } = useChat();

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#212121] flex items-center justify-between px-4 transition-colors duration-300">
      {/* Left: Menu button and Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Toggle */}
        <button
          onClick={onToggleSidebar}
          className="btn-icon lg:hidden"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Toggle */}
        <button
          onClick={onToggleSidebar}
          className="btn-icon hidden lg:flex items-center justify-center"
          aria-label="Toggle sidebar"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <PanelLeft size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#10a37f] flex items-center justify-center">
            <svg
              width="20"
              height="20"
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
          <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">ChatGPT Clone</span>
        </div>
      </div>

      {/* Right: Clear chat and User */}
      <div className="flex items-center gap-2">
        {/* Clear chat button */}
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="btn-icon flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            title="Clear chat"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {/* User info */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline max-w-[150px] truncate">
            {user?.emailAddresses?.[0]?.emailAddress}
          </span>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
