
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BUSINESS_TYPES } from '../constants';
import { 
  Search, Filter, Store, Mail, Phone, Calendar as CalendarIcon, 
  Lock, ShieldCheck, AlertCircle, Edit2, Trash2, Plus, X, Check,
  Loader2, BarChart3, Bell, Layers, Star, TrendingUp, Users
} from 'lucide-react';
// Removed non-existent import uploadFileToCloud
import { 
  getAllMerchantsFromFirestore, 
  saveProfileToFirestore, 
  deleteMerchantFromFirestore 
} from '../services/firebase';
import { Merchant, MarketingEvent } from '../types';

const FounderDashboard: React.FC = () => {
  const { t, lang, events, addEvent, removeEvent } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'merchants' | 'seasons' | 'analytics' | 'notifications'>('merchants');

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [isAddingNewMerchant, setIsAddingNewMerchant] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');

  const [editingEvent, setEditingEvent] = useState<MarketingEvent | null>(null);
  const [isAddingNewEvent, setIsAddingNewEvent] = useState(false);

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load merchants from Firestore when authenticated
  useEffect(() => {
    if (isAuthenticated && activeTab === 'merchants') {
      const loadMerchants = async () => {
        setLoadingData(true);
        try {
          const data = await getAllMerchantsFromFirestore();
          setMerchants(data as Merchant[]);
        } catch (err) {
          console.error("Error loading merchants:", err);
        } finally {
          setLoadingData(false);
        }
      };
      loadMerchants();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '37193719') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const filteredMerchants = useMemo(() => {
    return merchants.filter(m => {
      const name = m.storeName || '';
      const email = m.email || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesField = selectedField === 'all' || m.businessType === selectedField;
      return matchesSearch && matchesField;
    });
  }, [searchTerm, selectedField, merchants]);

  const handleSaveMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchant) return;
    
    setLoadingData(true);
    try {
      await saveProfileToFirestore(editingMerchant.id, editingMerchant);
      if (isAddingNewMerchant) {
        setMerchants([editingMerchant, ...merchants]);
      } else {
        setMerchants(merchants.map(m => m.id === editingMerchant.id ? editingMerchant : m));
      }
      setEditingMerchant(null);
      setIsAddingNewMerchant(false);
    } catch (err) {
      console.error("Error saving merchant:", err);
      alert(lang === 'ar' ? 'فشل حفظ التاجر' : 'Failed to save merchant');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteMerchant = async (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التاجر نهائياً؟' : 'Are you sure you want to delete this merchant permanently?')) {
      try {
        await deleteMerchantFromFirestore(id);
        setMerchants(merchants.filter(m => m.id !== id));
      } catch (err) {
        console.error("Error deleting merchant:", err);
      }
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    await addEvent(editingEvent);
    setEditingEvent(null);
    setIsAddingNewEvent(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الموسم؟ سيختفي من تقويم جميع التجار.' : 'Are you sure? This season will be removed from all merchants.')) {
      await removeEvent(id);
    }
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setBroadcastMessage('');
      alert(lang === 'ar' ? 'تم إرسال التنبيه لجميع التجار بنجاح' : 'Broadcast sent to all merchants successfully');
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="gradient-bg p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold">{t.adminLogin}</h2>
            <p className="text-white/70 text-sm mt-2">{t.adminAccessRequired}</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-shake">
                <AlertCircle size={18} />
                {t.loginError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-gray-400">{t.username}</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="admin" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 dark:text-gray-400">{t.password}</label>
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="********" required />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
            <button type="submit" className="w-full py-4 gradient-bg text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-200 transition-all mt-4">{t.login}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b dark:border-gray-700 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'merchants', label: lang === 'ar' ? 'إدارة التجار' : 'Merchants', icon: Users },
            { id: 'seasons', label: lang === 'ar' ? 'مركز المواسم' : 'Seasons Hub', icon: Layers },
            { id: 'analytics', label: lang === 'ar' ? 'تحليلات المنصة' : 'Analytics', icon: BarChart3 },
            { id: 'notifications', label: lang === 'ar' ? 'البث العام' : 'Broadcast', icon: Bell },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-700'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl">
          <TrendingUp size={18} />
          <span>{lang === 'ar' ? 'الحالة: نظام مفعل' : 'Status: System Online'}</span>
        </div>
      </div>

      {activeTab === 'merchants' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold">{lang === 'ar' ? 'قائمة التجار والمتاجر' : 'Merchants List'}</h3>
            <button 
              onClick={() => {
                setEditingMerchant({ id: 'm' + Date.now(), storeName: '', businessType: 'retail', country: 'SA', phone: '', email: '', primaryColor: '#6366f1', platforms: [], createdAt: new Date().toISOString().split('T')[0], status: 'active' });
                setIsAddingNewMerchant(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
            >
              <Plus size={20} /> {lang === 'ar' ? 'إضافة متجر جديد' : 'Add Store'}
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t.searchStore} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-2xl pr-12 pl-4 py-3" 
              />
            </div>
            <div className="md:w-64 relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={selectedField} 
                onChange={(e) => setSelectedField(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-2xl pr-12 pl-4 py-3 appearance-none"
              >
                <option value="all">{t.allFields}</option>
                {BUSINESS_TYPES.map(type => (
                  <option key={type} value={type}>{t[type as keyof typeof t] || type}</option>
                ))}
              </select>
            </div>
          </div>
          
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
               <p className="text-slate-400 font-bold">{lang === 'ar' ? 'جاري جلب بيانات المتاجر...' : 'Fetching merchants data...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMerchants.map((m) => (
                <div key={m.id} className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm overflow-hidden group">
                  <div className="h-2 gradient-bg"></div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-indigo-600 overflow-hidden shadow-inner">
                          {m.logo ? <img src={m.logo} className="w-full h-full object-cover" alt="logo" /> : <Store size={28} />}
                        </div>
                        <div>
                          <h4 className="font-bold">{m.storeName || (lang === 'ar' ? 'متجر جديد' : 'New Store')}</h4>
                          <span className="text-xs font-bold text-indigo-500 uppercase">{m.businessType}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingMerchant(m)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteMerchant(m.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2"><Mail size={16} /> {m.email || 'N/A'}</div>
                      <div className="flex items-center gap-2"><Phone size={16} /> {m.phone || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMerchants.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                   {lang === 'ar' ? 'لم يتم العثور على متاجر تطابق البحث' : 'No merchants found matching your search'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'seasons' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold">{lang === 'ar' ? 'إدارة المواسم التسويقية' : 'Marketing Seasons Hub'}</h3>
            <button 
              onClick={() => {
                setEditingEvent({ id: 'e' + Date.now(), title: { ar: '', en: '' }, date: new Date().toISOString().split('T')[0], type: 'commercial', priority: 'medium', description: { ar: '', en: '' } });
                setIsAddingNewEvent(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-transform active:scale-95"
            >
              <Plus size={20} /> {lang === 'ar' ? 'إضافة موسم جديد' : 'New Season'}
            </button>
          </div>
          <div className="grid gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${ev.priority === 'high' ? 'bg-rose-50 text-rose-500' : ev.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{ev.title[lang]}</h4>
                    <p className="text-sm text-slate-400">{ev.date} • <span className="uppercase font-bold text-[10px]">{ev.type}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditingEvent(ev)} className="p-3 bg-slate-50 dark:bg-gray-700 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="p-3 bg-slate-50 dark:bg-gray-700 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">{lang === 'ar' ? 'أداء المنصة' : 'Platform Analytics'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'إجمالي التجار', value: merchants.length, icon: Users, color: 'bg-blue-500' },
              { label: 'تصاميم AI', value: '1,248', icon: Layers, color: 'bg-indigo-500' },
              { label: 'فيديوهات Veo', value: '452', icon: TrendingUp, color: 'bg-purple-500' },
              { label: 'مواسم نشطة', value: events.length, icon: Star, color: 'bg-amber-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm transition-all hover:-translate-y-1">
                <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}><stat.icon size={24} /></div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-tighter">{stat.label}</p>
                <h4 className="text-3xl font-black mt-1 tabular-nums">{stat.value}</h4>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 text-center py-20 shadow-inner">
             <div className="relative inline-block mb-6">
               <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
               <BarChart3 size={64} className="relative mx-auto text-slate-200" />
             </div>
             <p className="text-slate-400 font-bold text-lg">{lang === 'ar' ? 'تكامل تحليلات Google Analytics سيظهر هنا قريباً' : 'Google Analytics integration coming soon'}</p>
             <p className="text-slate-300 text-sm mt-2">{lang === 'ar' ? 'نحن نعمل على ربط البيانات المباشرة لتتبع نمو المنصة.' : 'We are working on connecting live data to track platform growth.'}</p>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl mx-auto space-y-6">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700 shadow-xl space-y-6">
             <div className="text-center">
               <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                 <Bell size={32} />
               </div>
               <h3 className="text-2xl font-bold">{lang === 'ar' ? 'بث تنبيه لجميع المتاجر' : 'Broadcast to All Stores'}</h3>
               <p className="text-slate-500 text-sm mt-2">{lang === 'ar' ? 'أرسل إشعاراً فورياً سيظهر لجميع التجار في لوحة التحكم الخاصة بهم.' : 'Send an instant notification to all merchant dashboards.'}</p>
             </div>
             <textarea 
               value={broadcastMessage}
               onChange={(e) => setBroadcastMessage(e.target.value)}
               className="w-full h-40 bg-slate-50 dark:bg-gray-900 border-0 rounded-2xl p-6 focus:ring-2 focus:ring-amber-500 transition-all text-lg resize-none shadow-inner" 
               placeholder={lang === 'ar' ? 'اكتب رسالتك هنا... مثلاً: مواسم العيد بدأت، استفد من عروضنا الجديدة!' : 'Type your message here...'}
             />
             <button 
               onClick={handleSendBroadcast}
               disabled={isSending || !broadcastMessage}
               className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
             >
               {isSending ? <Loader2 className="animate-spin" /> : <Bell size={20} />}
               {isSending ? t.generating : (lang === 'ar' ? 'إرسال التنبيه الآن' : 'Send Broadcast Now')}
             </button>
           </div>
        </div>
      )}

      {/* Season Edit/Add Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold">{isAddingNewEvent ? (lang === 'ar' ? 'إضافة موسم جديد' : 'Add New Season') : (lang === 'ar' ? 'تعديل الموسم' : 'Edit Season')}</h3>
              <button onClick={() => { setEditingEvent(null); setIsAddingNewEvent(false); }} className="p-2 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">العنوان (عربي)</label><input type="text" required value={editingEvent.title.ar} onChange={e => setEditingEvent({...editingEvent, title: {...editingEvent.title, ar: e.target.value}})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" /></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Title (English)</label><input type="text" required value={editingEvent.title.en} onChange={e => setEditingEvent({...editingEvent, title: {...editingEvent.title, en: e.target.value}})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-bold text-slate-500">التاريخ</label><input type="date" required value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" /></div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">الأولوية</label>
                  <select value={editingEvent.priority} onChange={e => setEditingEvent({...editingEvent, priority: e.target.value as any})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                    <option value="low">Low (عادي)</option>
                    <option value="medium">Medium (متوسط)</option>
                    <option value="high">High (قصوى)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1"><label className="text-xs font-bold text-slate-500">الوصف (عربي)</label><textarea required value={editingEvent.description.ar} onChange={e => setEditingEvent({...editingEvent, description: {...editingEvent.description, ar: e.target.value}})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 h-20" /></div>
              <button type="submit" className="w-full py-4 gradient-bg text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-95"><Check size={18} /> {lang === 'ar' ? 'حفظ الموسم' : 'Save Season'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Merchant Edit/Add Modal */}
      {editingMerchant && activeTab === 'merchants' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-slate-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold">{isAddingNewMerchant ? (lang === 'ar' ? 'إضافة متجر جديد' : 'Add New Store') : (lang === 'ar' ? 'تعديل بيانات المتجر' : 'Edit Merchant')}</h3>
              <button onClick={() => { setEditingMerchant(null); setIsAddingNewMerchant(false); }} className="p-2 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMerchant} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{t.storeName}</label>
                  <input type="text" required value={editingMerchant.storeName} onChange={e => setEditingMerchant({...editingMerchant, storeName: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{t.businessType}</label>
                  <select value={editingMerchant.businessType} onChange={e => setEditingMerchant({...editingMerchant, businessType: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500">
                    {BUSINESS_TYPES.map(type => (
                      <option key={type} value={type}>{t[type as keyof typeof t] || type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">البريد الإلكتروني</label>
                <input type="email" required value={editingMerchant.email} onChange={e => setEditingMerchant({...editingMerchant, email: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">رقم الهاتف</label>
                <input type="text" value={editingMerchant.phone} onChange={e => setEditingMerchant({...editingMerchant, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" disabled={loadingData} className="w-full py-4 gradient-bg text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-95">
                {loadingData ? <Loader2 className="animate-spin" /> : <Check size={18} />}
                {loadingData ? t.generating : (lang === 'ar' ? 'حفظ البيانات' : 'Save Changes')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderDashboard;
