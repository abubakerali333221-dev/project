
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIStudio from './components/AIStudio';
import Profile from './components/Profile';
import FounderDashboard from './components/FounderDashboard';
import SmartCalendar from './components/SmartCalendar';
import { useApp } from './context/AppContext';
import { Sparkles } from 'lucide-react';

const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preselectedEventId, setPreselectedEventId] = useState<string | null>(null);
  const { lang, isLoading } = useApp();

  const handleCalendarToStudio = (eventId: string) => {
    setPreselectedEventId(eventId);
    setActiveTab('studio');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-100 dark:border-gray-800 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">جاري تحميل البيانات...</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium">نحن بصدد إعداد لوحة التحكم الخاصة بك</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'studio':
        return <AIStudio initialEventId={preselectedEventId || undefined} onResetPreselection={() => setPreselectedEventId(null)} />;
      case 'profile':
        return <Profile />;
      case 'calendar':
        return <SmartCalendar onNavigateToStudio={handleCalendarToStudio} />;
      case 'founder':
        return <FounderDashboard />;
      case 'campaigns':
        return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl">
              🚀
            </div>
            <p className="font-bold">{lang === 'ar' ? 'قريباً: جدولة الحملات التلقائية' : 'Soon: Automated Campaign Scheduling'}</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
};

export default App;
