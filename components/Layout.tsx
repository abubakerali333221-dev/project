
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Megaphone, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Globe,
  ShieldCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { t, lang, setLang, isDarkMode, setIsDarkMode, profile } = useApp();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'calendar', label: t.calendar, icon: CalendarIcon },
    { id: 'studio', label: t.aiStudio, icon: Sparkles },
    { id: 'campaigns', label: t.campaigns, icon: Megaphone },
    { id: 'profile', label: t.profile, icon: Settings },
  ];

  const adminItems = [
    { id: 'founder', label: t.founderDashboard, icon: ShieldCheck },
  ];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} 
        w-64 z-50 transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')} 
        lg:translate-x-0 bg-white dark:bg-gray-800 border-x dark:border-gray-700
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t.appName}
            </h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-widest">{lang === 'ar' ? 'الرئيسية' : 'Main'}</div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            <div className="mt-8 text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-widest">{lang === 'ar' ? 'الإدارة' : 'Admin'}</div>
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${activeTab === item.id 
                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                    : 'hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-700 rounded-xl">
              <img 
                src={profile.logo || `https://picsum.photos/seed/${profile.storeName || 'store'}/100`} 
                className="w-10 h-10 rounded-full object-cover" 
                alt="Logo"
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{profile.storeName || t.placeholderStore}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{profile.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 lg:block hidden">
            <h2 className="text-lg font-semibold capitalize">{t[activeTab as keyof typeof t] || activeTab}</h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
