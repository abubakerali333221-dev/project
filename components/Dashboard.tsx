
import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar as CalendarIcon, Layout as LayoutIcon, Video, Type, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t, events, lang, contents } = useApp();
  
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const stats = [
    { label: t.generateImage, value: contents.filter(c => c.type === 'image').length, icon: LayoutIcon, color: 'bg-blue-500' },
    { label: t.generateVideo, value: contents.filter(c => c.type === 'video').length, icon: Video, color: 'bg-purple-500' },
    { label: t.generateCopy, value: contents.filter(c => c.type === 'copy').length, icon: Type, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden gradient-bg p-8 rounded-3xl text-white shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">أهلاً بك في {t.appName} 👋</h2>
          <p className="text-white/80 max-w-lg">
            ساعد علامتك التجارية على النمو من خلال التذكيرات الذكية والمحتوى التسويقي المبتكر في كل موسم.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Sparkles size={20} />
              {t.createCampaign}
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t.upcomingEvents}</h3>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1">
              {t.calendar}
              {lang === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
          
          <div className="grid gap-4">
            {upcomingEvents.map((event) => {
              const daysLeft = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{event.title[lang]}</h4>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{event.date}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">{daysLeft}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{t.daysRemaining}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats & Quick Links */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">{t.quickActions}</h3>
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl text-white ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-slate-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <section>
        <h3 className="text-xl font-bold mb-4">{t.recentContent}</h3>
        {contents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border-2 border-dashed dark:border-gray-700 rounded-3xl p-12 text-center">
            <p className="text-slate-400">{t.noEvents}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contents.map(c => (
              <div key={c.id} className="group relative aspect-square bg-slate-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-sm">
                {c.type === 'image' && <img src={c.url} className="w-full h-full object-cover" alt="Content" />}
                {c.type === 'video' && <video src={c.url} className="w-full h-full object-cover" muted />}
                {c.type === 'copy' && <div className="p-4 text-xs overflow-hidden line-clamp-6">{c.text}</div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-bold">
                    {t.download}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
