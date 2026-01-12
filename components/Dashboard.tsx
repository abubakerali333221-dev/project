
import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar as CalendarIcon, Layout as LayoutIcon, Video, Type, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { MarketingEvent } from '../types';

export const PriorityIndicator: React.FC<{ priority: 'high' | 'medium' | 'low'; size?: 'sm' | 'md' }> = ({ priority, size = 'sm' }) => {
  const getMarkerPosition = () => {
    switch (priority) {
      case 'low': return '0%';
      case 'medium': return '50%';
      case 'high': return '100%';
      default: return '50%';
    }
  };

  return (
    <div className={`relative ${size === 'sm' ? 'w-24 h-1.5' : 'w-36 h-2'} mt-3 mb-2`}>
      {/* The 3-Color Base Bar */}
      <div className="absolute inset-0 flex rounded-full overflow-hidden shadow-inner">
        <div className="flex-1 bg-emerald-500"></div>
        <div className="flex-1 bg-amber-500"></div>
        <div className="flex-1 bg-rose-500"></div>
      </div>
      
      {/* The Pointer (Marker) - Larger Triangle */}
      <div 
        className="absolute top-full -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out z-10"
        style={{ left: getMarkerPosition() }}
      >
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-indigo-600 dark:border-b-indigo-400 drop-shadow-md"></div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t, events, lang, contents } = useApp();
  
  const allUpcomingEvents = [...events]
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextEvent = allUpcomingEvents[0];
  const daysToNext = nextEvent ? Math.ceil((new Date(nextEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const featuredEvents = allUpcomingEvents.slice(0, 6);

  const stats = [
    { label: t.generateImage, value: contents.filter(c => c.type === 'image').length, icon: LayoutIcon, color: 'bg-blue-500' },
    { label: t.generateVideo, value: contents.filter(c => c.type === 'video').length, icon: Video, color: 'bg-purple-500' },
    { label: t.generateCopy, value: contents.filter(c => c.type === 'copy').length, icon: Type, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Professional Marketing Ticker with 3-Color Indicators */}
      <div className="relative overflow-hidden gradient-bg text-white py-8 rounded-3xl shadow-xl border-b-4 border-black/10">
        
        {/* Right Label */}
        <div className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 bottom-0 px-8 z-20 flex items-center`}>
           <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-sm">
             <CalendarIcon size={22} className="text-indigo-100" />
             <span className="font-black text-lg tracking-tight whitespace-nowrap">
               {lang === 'ar' ? 'المواسم القادمة:' : 'Upcoming Seasons:'}
             </span>
           </div>
        </div>

        {/* Scrolling Content */}
        <div className="flex whitespace-nowrap animate-marquee hover:pause-marquee gap-32 items-center">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {allUpcomingEvents.map((event) => (
                <div key={`${event.id}-${i}`} className="flex flex-col items-center">
                  <span className="font-extrabold text-2xl tracking-wide text-white drop-shadow-md mb-1">
                    {event.title[lang]}
                  </span>
                  {/* Standardized Larger Indicator for Marquee */}
                  <div className="relative w-20 h-1.5 mt-2 mb-1">
                    <div className="absolute inset-0 flex rounded-full overflow-hidden opacity-60">
                      <div className="flex-1 bg-emerald-500"></div>
                      <div className="flex-1 bg-amber-500"></div>
                      <div className="flex-1 bg-rose-500"></div>
                    </div>
                    <div 
                      className="absolute top-full -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                      style={{ left: event.priority === 'low' ? '0%' : event.priority === 'medium' ? '50%' : '100%' }}
                    >
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white drop-shadow-sm"></div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Left Countdown */}
        <div className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} top-0 bottom-0 px-8 z-20 flex items-center`}>
           <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-sm">
             <span className="text-sm font-black text-indigo-100 whitespace-nowrap">
               {lang === 'ar' ? 'متبقي على الأقرب:' : 'Next in:'}
             </span>
             <div className="flex items-center gap-1.5">
               <span className="font-black text-2xl tabular-nums leading-none">
                 {daysToNext}
               </span>
               <span className="text-xs font-bold opacity-80 uppercase">
                 {lang === 'ar' ? 'أيام' : 'Days'}
               </span>
             </div>
           </div>
        </div>
        
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(50%); }
            100% { transform: translateX(-50%); }
          }
          [dir="rtl"] @keyframes marquee {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(50%); }
          }
          .animate-marquee {
            animation: marquee 90s linear infinite;
            display: flex;
            min-width: 350%;
            justify-content: center;
          }
          .hover\\:pause-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Events List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t.upcomingEvents}</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {lang === 'ar' ? 'عادية' : 'Low'}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> {lang === 'ar' ? 'متوسطة' : 'Med'}</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> {lang === 'ar' ? 'قصوى' : 'High'}</div>
               </div>
               <button className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center gap-1">
                {t.calendar}
                {lang === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {featuredEvents.map((event) => {
              const daysLeft = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={event.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-200 transition-all group gap-4 relative overflow-hidden">
                  {/* Small decorative side bar based on priority color */}
                  <div className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 ${event.priority === 'high' ? 'bg-rose-500' : event.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                  
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0">
                      <CalendarIcon size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">{event.title[lang]}</h4>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{event.description[lang]}</p>
                      
                      {/* Integrated Indicator */}
                      <div className="mt-4 flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lang === 'ar' ? 'مستوى التأثير التجاري:' : 'Market Impact:'}</span>
                        <PriorityIndicator priority={event.priority} size="md" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-sm">
                       <span className="block text-slate-400 font-medium">{lang === 'ar' ? 'التاريخ' : 'Date'}</span>
                       <span className="font-bold">{event.date}</span>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-gray-700/50 px-4 py-2 rounded-2xl min-w-[80px]">
                      <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{daysLeft}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.daysRemaining}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">{t.quickActions}</h3>
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl text-white ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-slate-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/40">
               <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-bold">
                  <AlertTriangle size={18} />
                  <span>دليل الأهمية التجارية</span>
               </div>
               <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-600">عالية (High)</span>
                      <span className="text-rose-500">تأثير قصوى</span>
                    </div>
                    <PriorityIndicator priority="high" size="md" />
                    <p className="text-[10px] text-slate-400 mt-2">مواسم تتطلب حملات ضخمة وميزانية إعلانية عالية.</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-600">متوسطة (Medium)</span>
                      <span className="text-amber-500">تأثير جيد</span>
                    </div>
                    <PriorityIndicator priority="medium" size="md" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-600">عادية (Low)</span>
                      <span className="text-emerald-500">تفاعل يومي</span>
                    </div>
                    <PriorityIndicator priority="low" size="md" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
