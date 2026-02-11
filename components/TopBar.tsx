
import React from 'react';
import { Search, Bell, MessageSquare, LayoutGrid } from 'lucide-react';

interface TopBarProps {
  onSearch: (query: string) => void;
  value: string;
  bookingCount?: number;
  onBellClick?: () => void;
  onChatClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, value, bookingCount = 0, onBellClick, onChatClick }) => {
  return (
    <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 px-5 py-4 flex items-center gap-3">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
          <Search className="h-4 w-4 text-gray-400 group-focus-within:text-padang-green" />
        </div>
        <input
          type="text"
          placeholder="Cari wisata, kuliner, hotel..."
          className="w-full bg-white/90 backdrop-blur-xl border border-white rounded-[24px] py-3.5 pl-11 pr-5 text-sm font-bold placeholder:text-gray-400 shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-padang-green/30 focus:bg-white transition-all caret-padang-green"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="absolute top-0 bottom-0 right-1 p-1 flex items-center">
          {value && (
            <button onClick={() => onSearch('')} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-300 hover:text-chili-red bg-gray-50/50 transition-colors">
              <LayoutGrid className="h-3.5 w-3.5 rotate-45" />
            </button>
          )}
        </div>
      </div>
      <button
        onClick={onBellClick}
        className="h-[52px] w-[52px] bg-white/90 backdrop-blur-xl rounded-[24px] border border-white shadow-xl shadow-black/5 flex items-center justify-center relative hover:bg-gray-50 active:scale-90 transition-all group"
      >
        <Bell className="h-5 w-5 text-padang-green group-hover:rotate-12 transition-transform" />
        {bookingCount > 0 && (
          <span className="absolute top-3 right-3 h-5 w-5 bg-chili-red text-white text-[10px] font-black rounded-full border-2 border-white shadow-sm flex items-center justify-center animate-bounce">
            {bookingCount}
          </span>
        )}
      </button>
      <button
        onClick={onChatClick}
        className="h-[52px] w-[52px] bg-white/90 backdrop-blur-xl rounded-[24px] border border-white shadow-xl shadow-black/5 flex items-center justify-center relative hover:bg-gray-50 active:scale-90 transition-all group"
      >
        <MessageSquare className="h-5 w-5 text-padang-green group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

// Removed redundant LayoutGrid import


export default TopBar;
