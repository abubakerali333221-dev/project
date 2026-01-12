
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Image as ImageIcon, Video, Type, Download, Share2, Loader2 } from 'lucide-react';
import { generateMarketingCopy, generateMarketingImage, generateMarketingVideo } from '../services/gemini';

interface AIStudioProps {
  initialEventId?: string;
  onResetPreselection?: () => void;
}

const AIStudio: React.FC<AIStudioProps> = ({ initialEventId, onResetPreselection }) => {
  const { t, lang, profile, events, addContent } = useApp();
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'copy'>('image');
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(initialEventId || events[0]?.id);
  const [tone, setTone] = useState('tonePersuasive');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (initialEventId) {
      setSelectedEvent(initialEventId);
    }
  }, [initialEventId]);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const eventObj = events.find(e => e.id === selectedEvent)!;
      const eventTitle = eventObj.title[lang];

      if (activeTab === 'copy') {
        const text = await generateMarketingCopy({
          storeName: profile.storeName || t.placeholderStore,
          businessType: profile.businessType,
          event: eventTitle,
          tone: t[tone as keyof typeof t] || tone,
          lang
        });
        setResult(text || 'Error');
        addContent({ id: Date.now().toString(), type: 'copy', text: text || '', createdAt: new Date().toISOString() });
      } else if (activeTab === 'image') {
        const prompt = t.promptIdea
          .replace('{event}', eventTitle)
          .replace('{store}', profile.storeName || t.placeholderStore)
          .replace('{type}', profile.businessType);
        const url = await generateMarketingImage(prompt);
        setResult(url);
        addContent({ id: Date.now().toString(), type: 'image', url: url || '', createdAt: new Date().toISOString() });
      } else if (activeTab === 'video') {
        const prompt = t.videoPrompt
          .replace('{event}', eventTitle)
          .replace('{store}', profile.storeName || t.placeholderStore);
        const url = await generateMarketingVideo(prompt);
        setResult(url);
        addContent({ id: Date.now().toString(), type: 'video', url: url || '', createdAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error(error);
      alert('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 flex gap-1 shadow-sm border dark:border-gray-700">
        {[
          { id: 'image', label: t.generateImage, icon: ImageIcon },
          { id: 'video', label: t.generateVideo, icon: Video },
          { id: 'copy', label: t.generateCopy, icon: Type },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setResult(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all font-bold ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-500'}`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm space-y-6 h-fit">
          <div className="space-y-2">
            <label className="text-sm font-bold block">{t.selectEvent}</label>
            <select 
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                if (onResetPreselection) onResetPreselection();
              }}
              className="w-full bg-slate-50 dark:bg-gray-700 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title[lang]}</option>
              ))}
            </select>
          </div>

          {activeTab === 'copy' && (
            <div className="space-y-2">
              <label className="text-sm font-bold block">{t.tone}</label>
              <div className="grid gap-2">
                {['toneProfessional', 'toneFriendly', 'tonePersuasive'].map(tkey => (
                  <button
                    key={tkey}
                    onClick={() => setTone(tkey)}
                    className={`text-sm px-4 py-2 rounded-xl text-start transition-colors ${tone === tkey ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200' : 'bg-slate-50 dark:bg-gray-700 border border-transparent'}`}
                  >
                    {t[tkey as keyof typeof t]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 gradient-bg text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.02] transition-transform"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? t.generating : (lang === 'ar' ? 'بدء التحليل والإنشاء' : 'Start AI Generation')}
          </button>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          {loading ? (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 dark:border-gray-700 border-t-indigo-600 rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
              </div>
              <p className="font-bold text-slate-500 animate-pulse">{t.generating}</p>
            </div>
          ) : result ? (
            <div className="w-full space-y-6">
              <div className="rounded-2xl overflow-hidden border dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
                {activeTab === 'image' && <img src={result} className="w-full max-h-[500px] object-contain" alt="Result" />}
                {activeTab === 'video' && <video src={result} controls className="w-full max-h-[500px]" />}
                {activeTab === 'copy' && <div className="p-8 whitespace-pre-wrap text-lg leading-relaxed">{result}</div>}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.open(result, '_blank')}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <Download size={20} />
                  {t.download}
                </button>
                <button className="px-6 py-3 border border-slate-200 dark:border-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-gray-700">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-xs">
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Sparkles size={32} />
              </div>
              <p className="text-slate-500 dark:text-gray-400 font-medium">
                {initialEventId 
                  ? (lang === 'ar' ? `تم اختيار المناسبة بنجاح، اضغط على زر "بدء الإنشاء" للحصول على المحتوى.` : `Event selected! Click "Start Generation" to get your content.`)
                  : (lang === 'ar' ? 'ابدأ الآن واختر ما ترغب في إنشائه للمناسبة القادمة!' : 'Start now and select what you want to create for the next occasion!')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
