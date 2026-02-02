/**
 * Sidebar Component
 * Collapsible sidebar with chat history, search, and images
 */

import { Plus, MessageSquare, X, Trash2, Sun, Moon, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import DeleteChatModal from './DeleteChatModal';
import SidebarSearch from './SidebarSearch';
import SidebarImages from './SidebarImages';

export default function Sidebar({ isOpen, onClose }) {
  const { chats, currentChatId, switchChat, deleteChat, createNewChat, theme, toggleTheme } = useChat();
  
  // State
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'images'
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    
    const lowerQuery = searchQuery.toLowerCase();
    return chats.filter(chat => {
      // 1. Match title
      if (chat.title.toLowerCase().includes(lowerQuery)) return true;
      
      // 2. Match message content (from localStorage)
      const storedMessages = localStorage.getItem(`messages_${chat.id}`);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        return messages.some(msg => msg.content.toLowerCase().includes(lowerQuery));
      }
      return false;
    });
  }, [chats, searchQuery]);

  // Handle new chat
  const handleNewChat = () => {
    createNewChat();
    // Switch back to chats tab if in images
    setActiveTab('chats');
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Handle chat click
  const handleChatClick = (chatId) => {
    switchChat(chatId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Delete handlers
  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteChat = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete);
      setIsDeleteModalOpen(false);
      setChatToDelete(null);
    }
  };

  const cancelDeleteChat = () => {
    setIsDeleteModalOpen(false);
    setChatToDelete(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            key="sidebar"
            initial={isDesktop ? { width: 0, opacity: 0 } : { x: -300, opacity: 0 }}
            animate={isDesktop ? { width: "18rem", opacity: 1 } : { x: 0, opacity: 1 }}
            exit={isDesktop ? { width: 0, opacity: 0 } : { x: -300, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className={`
              fixed lg:static inset-y-0 left-0 z-50
              bg-[var(--bg-sidebar)] border-r border-[var(--border-color)]
              flex flex-col shadow-xl lg:shadow-none overflow-hidden whitespace-nowrap
            `}
            style={{ width: isDesktop ? '18rem' : '18rem' }}
          >
            {/* Header: New Chat & Close */}
            <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--border-color)] flex-shrink-0">
              <button
                onClick={handleNewChat}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg
                           text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] 
                           border border-[var(--border-color)] hover:border-[var(--accent-color)]
                           transition-all duration-200"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">New chat</span>
              </button>
              
              <button
                onClick={onClose}
                className="ml-2 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] lg:hidden"
                title="Close Sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Search */}
              <div className="pt-2">
                <SidebarSearch onSearch={setSearchQuery} />
              </div>

              {/* Tabs */}
              <div className="flex items-center px-4 py-2 gap-4 border-b border-[var(--border-color)]">
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors relative
                    ${activeTab === 'chats' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}
                  `}
                >
                  <MessageCircle size={14} />
                  Chats
                  {activeTab === 'chats' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-color)]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors relative
                    ${activeTab === 'images' ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}
                  `}
                >
                  <ImageIcon size={14} />
                  Images
                  {activeTab === 'images' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-color)]" />
                  )}
                </button>
              </div>

              {/* Dynamic Content */}
              <div className="flex-1 overflow-auto min-h-0 bg-[var(--bg-sidebar)]">
                {activeTab === 'chats' ? (
                  <div className="p-2 space-y-1">
                    {filteredChats.length === 0 ? (
                      <div className="text-center py-10 px-4">
                        <p className="text-xs text-[var(--text-muted)] italic">
                          {searchQuery ? "No chats found" : "No history yet"}
                        </p>
                      </div>
                    ) : (
                      <>
                        {!searchQuery && (
                          <div className="text-[10px] font-bold text-[var(--text-muted)] px-3 py-2 uppercase tracking-widest">
                            {searchQuery ? 'Search Results' : 'Recent'}
                          </div>
                        )}
                        
                        {filteredChats.map((chat) => (
                          <div
                            key={chat.id}
                            onClick={() => handleChatClick(chat.id)}
                            className={`
                              group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
                              transition-all duration-200
                              ${currentChatId === chat.id 
                                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]' 
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/50 border border-transparent'
                              }
                            `}
                          >
                            <MessageSquare 
                              size={16} 
                              className={currentChatId === chat.id ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'} 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {chat.title}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                              className={`
                                opacity-0 group-hover:opacity-100 p-1.5 rounded-md
                                hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--text-muted)] hover:text-red-500
                                transition-all duration-200
                              `}
                              title="Delete conversation"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <SidebarImages />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[var(--border-color)] space-y-2 bg-[var(--bg-sidebar)]">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                           text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={18} />
                    <span className="text-sm font-medium">Dark mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={18} />
                    <span className="text-sm font-medium">Light mode</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-[var(--text-muted)] text-center uppercase tracking-widest">
                Powered by samson mwangonda
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <DeleteChatModal 
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteChat}
        onConfirm={confirmDeleteChat}
      />
    </>
  );
}
