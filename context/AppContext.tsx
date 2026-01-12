
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, MerchantProfile, MarketingEvent, GeneratedContent } from '../types';
import { translations } from '../translations';
import { MOCK_EVENTS } from '../constants';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  profile: MerchantProfile;
  updateProfile: (p: Partial<MerchantProfile>) => void;
  t: typeof translations.ar;
  events: MarketingEvent[];
  contents: GeneratedContent[];
  addContent: (c: GeneratedContent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [profile, setProfile] = useState<MerchantProfile>({
    storeName: 'Smart Reminder',
    businessType: 'retail',
    country: 'SA',
    phone: '',
    email: '',
    primaryColor: '#6366f1',
    platforms: ['Instagram', 'Snapchat'],
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const updateProfile = (p: Partial<MerchantProfile>) => {
    setProfile(prev => ({ ...prev, ...p }));
  };

  const addContent = (c: GeneratedContent) => {
    setContents(prev => [c, ...prev]);
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ 
      lang, setLang, 
      isDarkMode, setIsDarkMode, 
      profile, updateProfile, 
      t, 
      events: MOCK_EVENTS,
      contents, addContent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
