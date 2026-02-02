import { Search, History, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function SidebarSearch({ onSearch, placeholder = "Search chats..." }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const saveSearchToHistory = (term) => {
    if (!term.trim()) return;
    const newHistory = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('recent_searches', JSON.stringify(newHistory));
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    setIsFocused(false); // Close dropdown after selection
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveSearchToHistory(query);
      setIsFocused(false);
    }
  };

  return (
    <div className="relative px-3 py-2" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
          aria-label="Search chats"
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" 
          size={16} 
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-primary)] transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Recent Searches Dropdown */}
      {isFocused && !query && recentSearches.length > 0 && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
            Recent Searches
          </div>
          <ul>
            {recentSearches.map((term, index) => (
              <li key={index}>
                <button
                  onClick={() => handleRecentClick(term)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <History size={14} className="text-[var(--text-muted)]" />
                  <span className="truncate">{term}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
