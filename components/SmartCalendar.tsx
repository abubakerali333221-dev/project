
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Sparkles, X, Info, Clock } from 'lucide-react';
import { MarketingEvent } from '../types';
import { PriorityIndicator } from './Dashboard';

const SmartCalendar: React.FC<{ onNavigateToStudio: (eventId: string) => void }> = ({ onNavigateToStudio }) => {
  const { t, events, lang } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const monthName = currentDate.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  const weekDays = lang === 'ar' 
    ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startOffset = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Fill empty spaces
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32"></div>);
  }

  // Fill actual days
  for (let d = 1; d <= totalDays; d++) {
    const dayEvents = getEventsForDay(d);
    const hasEvents = dayEvents.length > 0;
    const highestPriority = dayEvents.reduce((prev, curr) => {
      if (curr.priority === 'high' || prev === 'high') return 'high';
      if (curr.priority === 'medium' || prev === 'medium') return 'medium';
      return 'low';
    }, 'low' as 'high' | 'medium' | 'low');

    const priorityColors = {
      high: 'bg-rose-500',
      medium: 'bg-amber-500',
      low: 'bg-emerald-500'
    };

    days.push(
      <div 
        key={d} 
        onClick={() => setSelectedDay(d)}
        className={`h-24 md:h-32 border border-slate-100 dark:border-gray-700 p-2 transition-all cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 group relative ${selectedDay === d ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 z-10 shadow-lg' : ''}`}
      >
        <span className={`text-sm font-bold ${hasEvents ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{d}</span>
        
        {hasEvents && (
          <div className="mt-1 space-y-1 overflow-hidden">
             <div className="flex flex-wrap gap-1">
               {dayEvents.slice(0, 2).map(e => (
                 <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${priorityColors[e.priority]}`}></div>
               ))}
               {dayEvents.length > 2 && <span className="text-[8px] text-slate-400">+{dayEvents.length - 2}</span>}
             </div>
             <p className="text-[10px] font-bold truncate text-slate-600 dark:text-slate-300 group-hover:text-indigo-600">
               {dayEvents[0].title[lang]}
             </p>
             {/* Small visual priority bar for calendar grid */}
             <div className="w-full h-1 rounded-full overflow-hidden flex bg-slate-100 dark:bg-gray-700/50 mt-1">
                <div className={`h-full ${highestPriority === 'high' ? 'w-full bg-rose-500' : highestPriority === 'medium' ? 'w-2/3 bg-amber-500' : 'w-1/3 bg-emerald-500'}`}></div>
             </div>
          </div>
        )}
      </div>
    );
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Calendar Grid */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between bg-slate-50/50 dark:bg-gray-900/30">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <CalendarIcon size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{monthName}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
              {lang === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
              {lang === 'ar' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b dark:border-gray-700 bg-slate-50/30 dark:bg-gray-900/20">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-x first:border-r-0 last:border-l-0 dark:border-gray-700">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 overflow-y-auto">
          {days}
        </div>
      </div>

      {/* Details Side Panel (Day Drawer) */}
      <div className={`lg:w-96 shrink-0 transition-all duration-300 ${selectedDay ? 'opacity-100' : 'opacity-0 pointer-events-none lg:pointer-events-auto lg:opacity-100'}`}>
        <div className="bg-white dark:bg-gray-800 h-full rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700 bg-indigo-50/30 dark:bg-indigo-900/10 flex justify-between items-center">
            <h3 className="font-black text-lg flex items-center gap-2">
              <Info size={20} className="text-indigo-600" />
              {selectedDay 
                ? (lang === 'ar' ? `تفاصيل يوم ${selectedDay}` : `Day ${selectedDay} Details`)
                : (lang === 'ar' ? 'اختر يوماً للعرض' : 'Select a day')}
            </h3>
            {selectedDay && (
              <button onClick={() => setSelectedDay(null)} className="lg:hidden p-1 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!selectedDay ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <CalendarIcon size={64} className="text-slate-300" />
                <p className="font-bold text-slate-400">{lang === 'ar' ? 'اضغط على يوم في التقويم لمشاهدة المواسم التسويقية المتاحة' : 'Click a day on the calendar to view available marketing seasons'}</p>
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Clock size={48} className="mx-auto text-slate-200" />
                <p className="text-slate-400 font-medium">{lang === 'ar' ? 'لا توجد مناسبات مسجلة في هذا اليوم' : 'No events recorded for this day'}</p>
              </div>
            ) : (
              selectedEvents.map(event => (
                <div key={event.id} className="bg-slate-50 dark:bg-gray-900/50 rounded-2xl p-5 border dark:border-gray-700 space-y-4 hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${event.priority === 'high' ? 'bg-rose-500' : event.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                      {event.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{event.type}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-black text-xl text-indigo-600 dark:text-indigo-400 mb-2">{event.title[lang]}</h4>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-400">{event.description[lang]}</p>
                  </div>

                  <div className="pt-2 border-t dark:border-gray-700">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tighter">{lang === 'ar' ? 'مؤشر الأهمية التجارية:' : 'Market Importance:'}</p>
                    {/* Reusing standardized PriorityIndicator with larger triangle */}
                    <PriorityIndicator priority={event.priority} size="md" />
                  </div>

                  <button 
                    onClick={() => onNavigateToStudio(event.id)}
                    className="w-full py-3 gradient-bg text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform text-sm"
                  >
                    <Sparkles size={18} />
                    {lang === 'ar' ? 'بدء الإنشاء بالذكاء الاصطناعي' : 'Start Creating with AI'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCalendar;
