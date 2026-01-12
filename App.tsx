
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIStudio from './components/AIStudio';
import Profile from './components/Profile';
import FounderDashboard from './components/FounderDashboard';
import { useApp } from './context/AppContext';

const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'studio':
        return <AIStudio />;
      case 'profile':
        return <Profile />;
      case 'founder':
        return <FounderDashboard />;
      case 'calendar':
        return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl">
              📅
            </div>
            <p className="font-bold">قريباً: التقويم التفاعلي الكامل</p>
          </div>
        );
      case 'campaigns':
        return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl">
              🚀
            </div>
            <p className="font-bold">قريباً: جدولة الحملات التلقائية</p>
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
