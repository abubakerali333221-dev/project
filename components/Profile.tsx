
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Check, Globe } from 'lucide-react';
import { BUSINESS_TYPES, SOCIAL_PLATFORMS } from '../constants';

const Profile: React.FC = () => {
  const { t, profile, updateProfile, lang } = useApp();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="h-32 gradient-bg"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-8 inline-block">
            <div className="relative w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-800 bg-white overflow-hidden shadow-lg flex items-center justify-center">
              <img 
                src={profile.logo || `https://picsum.photos/seed/${profile.storeName || 'store'}/200`} 
                className="w-full h-full object-cover" 
                alt="Logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Logo';
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold block">{t.storeName}</label>
                <input 
                  type="text"
                  value={profile.storeName}
                  onChange={(e) => updateProfile({ storeName: e.target.value })}
                  placeholder={t.placeholderStore}
                  className="w-full bg-slate-50 dark:bg-gray-700 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold block">{t.businessType}</label>
                <select 
                  value={profile.businessType}
                  onChange={(e) => updateProfile({ businessType: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-700 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                >
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{t[type as keyof typeof t] || type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">{lang === 'ar' ? 'رابط الشعار (URL)' : 'Logo URL'}</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  value={profile.logo || ''}
                  onChange={(e) => updateProfile({ logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-slate-50 dark:bg-gray-900 border-0 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 px-2">{lang === 'ar' ? 'أدخل رابط الصورة مباشرة ليظهر كشعار لمتجرك.' : 'Enter a direct image link to use as your store logo.'}</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold block">{t.platforms}</label>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_PLATFORMS.map(platform => {
                  const isSelected = profile.platforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => {
                        const newPlatforms = isSelected 
                          ? profile.platforms.filter(p => p !== platform)
                          : [...profile.platforms, platform];
                        updateProfile({ platforms: newPlatforms });
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                          : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-500'
                      }`}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {success ? <Check size={20} /> : <Save size={20} />}
                {success ? 'تم الحفظ بنجاح' : t.saveChanges}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
