/**
 * Chat Page Component
 * Protected main chat interface (requires authentication)
 */

import { useState } from 'react';
import { ChatProvider } from '../context/ChatContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import ChatInput from '../components/ChatInput';

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Navbar */}
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Chat area */}
        <ChatContainer />

        {/* Input area */}
        <ChatInput />
      </div>
    </div>
  );
}
