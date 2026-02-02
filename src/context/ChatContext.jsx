/**
 * Chat Context
 * Manages chat state, messages, and API communication
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ChatProvider({ children }) {
  // Chat state
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(() => {
    return localStorage.getItem('currentChatId') || null;
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState('');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Initial load of messages for the stored currentChatId
  useEffect(() => {
    if (currentChatId) {
      const savedMessages = localStorage.getItem(`messages_${currentChatId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, []); // Only on mount

  // Apply and persist theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist chats and currentChatId
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }, [chats, currentChatId]);

  // Persist messages whenever they change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      localStorage.setItem(`messages_${currentChatId}`, JSON.stringify(messages));
    }
  }, [messages, currentChatId]);

  /**
   * Create a new chat
   */
  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      createdAt: new Date().toISOString(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setStreamingMessage('');
    setError(null);
  }, []);

  /**
   * Switch to a different chat
   */
  const switchChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`messages_${chatId}`);
    setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    setStreamingMessage('');
    setError(null);
  }, []);

  /**
   * Delete a chat
   */
  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    localStorage.removeItem(`messages_${chatId}`);
    
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  }, [currentChatId]);

  /**
   * Send a message to the AI and get a response
   */
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    let chatId = currentChatId;
    let messagesForAPI;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    // Create a new chat if none is selected
    if (!chatId) {
      chatId = Date.now().toString();
      const firstLine = content.trim().split('\n')[0];
      const title = firstLine.substring(0, 30) + (firstLine.length > 30 ? '...' : '');
      
      const newChat = {
        id: chatId,
        title: title,
        createdAt: new Date().toISOString(),
      };
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
      setMessages([userMessage]);
      messagesForAPI = [userMessage];
    } else {
      setMessages((prev) => [...prev, userMessage]);
      messagesForAPI = [...messages, userMessage];
    }

    // Clear any previous errors
    setError(null);
    setIsLoading(true);
    setStreamingMessage('');

    try {
      // Prepare messages for API
      const messagesToSend = messagesForAPI.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call the backend API
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: messagesToSend,
      });

      if (response.data.success) {
        // Simulate typing effect
        const aiContent = response.data.message;
        await simulateTyping(aiContent);

        // Add AI message after typing completes
        const aiMessage = {
          id: Date.now(),
          role: 'assistant',
          content: aiContent,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessage('');
      } else {
        throw new Error(response.data.error || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Chat Error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, messages, isLoading]);

  /**
   * Simulate typing effect for AI responses
   */
  const simulateTyping = async (text) => {
    const words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setStreamingMessage(currentText);
      // Vary the delay slightly for natural feel (40-80ms per word)
      await new Promise((resolve) => setTimeout(resolve, 40 + Math.random() * 40));
    }
  };

  /**
   * Clear all messages in current chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamingMessage('');
    setError(null);
    setIsLoading(false);
    if (currentChatId) {
      localStorage.removeItem(`messages_${currentChatId}`);
    }
  }, [currentChatId]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = {
    chats,
    currentChatId,
    messages,
    isLoading,
    error,
    streamingMessage,
    theme,
    sendMessage,
    createNewChat,
    switchChat,
    deleteChat,
    clearChat,
    clearError,
    toggleTheme,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
