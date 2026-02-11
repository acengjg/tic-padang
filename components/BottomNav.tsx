import React from 'react';
import { Home, Compass, ClipboardList, Tag, User, LayoutGrid } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

import { useLanguage } from '../context/LanguageContext';

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const { t } = useLanguage();
  const navItems = [
    { id: AppScreen.HOME, label: t.common.home, icon: Home },
    { id: AppScreen.EXPLORE, label: t.common.explore, icon: Compass },
    { id: AppScreen.PLAN, label: t.common.plan, icon: ClipboardList },
    { id: AppScreen.SERVICES, label: t.common.services, icon: LayoutGrid },
    { id: AppScreen.PROFILE, label: t.common.profile, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-6 pt-2 z-40 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[36px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] px-4 py-3 flex justify-between items-center pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (window.navigator.vibrate) window.navigator.vibrate(25);
              }}
              className="relative flex flex-col items-center justify-center py-1 flex-1 group"
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-500 mb-0.5 ${isActive ? 'bg-padang-green text-white shadow-lg shadow-padang-green/20 -translate-y-1' : 'text-gray-400 group-active:scale-90 group-hover:text-gray-600'}`}>
                <Icon className={`h-5 w-5 transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-all duration-500 ${isActive ? 'text-padang-green opacity-100' : 'text-gray-400 opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
