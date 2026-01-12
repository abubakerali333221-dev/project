
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, MerchantProfile, MarketingEvent, GeneratedContent } from '../types';
import { translations } from '../translations';
import { MOCK_EVENTS } from '../constants';
import { 
  saveProfileToFirestore, 
  getProfileFromFirestore, 
  saveEventToFirestore, 
  getAllEventsFromFirestore, 
  deleteEventFromFirestore,
  saveContentToFirestore,
  getMerchantContentsFromFirestore
} from '../services/firebase';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  profile: MerchantProfile;
  updateProfile: (p: Partial<MerchantProfile>) => void;
  t: typeof translations.ar;
  events: MarketingEvent[];
  setEvents: (events: MarketingEvent[]) => void;
  addEvent: (event: MarketingEvent) => void;
  removeEvent: (eventId: string) => void;
  contents: GeneratedContent[];
  addContent: (c: GeneratedContent) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Using a static ID for this demo, in real apps this would be the Auth UID
const MERCHANT_ID = "main_merchant_store";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [profile, setProfile] = useState<MerchantProfile>({
    storeName: 'Smart Reminder',
    businessType: 'retail',
    country: 'SA',
    phone: '',
    email: '',
    primaryColor: '#6366f1',
    platforms: ['Instagram', 'Snapchat'],
  });

  // 1. Initial Load from Firestore
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load Profile
        const dbProfile = await getProfileFromFirestore(MERCHANT_ID);
        if (dbProfile) setProfile(dbProfile as MerchantProfile);

        // Load Global Events
        const dbEvents = await getAllEventsFromFirestore();
        if (dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents as MarketingEvent[]);
        } else {
          // If Firestore is empty, seed with MOCK_EVENTS
          setEvents(MOCK_EVENTS);
          for (const event of MOCK_EVENTS) {
            await saveEventToFirestore(event);
          }
        }

        // Load Merchant Content
        const dbContents = await getMerchantContentsFromFirestore(MERCHANT_ID);
        if (dbContents) setContents(dbContents as GeneratedContent[]);

      } catch (error) {
        console.error("Error loading data from Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

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

  const updateProfile = async (p: Partial<MerchantProfile>) => {
    const newProfile = { ...profile, ...p };
    setProfile(newProfile);
    // Auto-save to Firestore
    await saveProfileToFirestore(MERCHANT_ID, newProfile);
  };

  const addContent = async (c: GeneratedContent) => {
    setContents(prev => [c, ...prev]);
    // Auto-save to Firestore
    await saveContentToFirestore(MERCHANT_ID, c);
  };

  const addEvent = async (event: MarketingEvent) => {
    setEvents(prev => [event, ...prev]);
    // Auto-save to Firestore
    await saveEventToFirestore(event);
  };

  const removeEvent = async (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    // Auto-delete from Firestore
    await deleteEventFromFirestore(eventId);
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ 
      lang, setLang, 
      isDarkMode, setIsDarkMode, 
      profile, updateProfile, 
      t, 
      events,
      setEvents: (evs: MarketingEvent[]) => {
        setEvents(evs);
        // Warning: This only updates local state, usually used for bulk updates
      },
      addEvent,
      removeEvent,
      contents, addContent,
      isLoading
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
