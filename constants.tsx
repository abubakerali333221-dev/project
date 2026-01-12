
import { MarketingEvent, Merchant } from './types';

export const MOCK_EVENTS: MarketingEvent[] = [
  {
    id: '1',
    title: { ar: 'رمضان المبارك', en: 'Ramadan' },
    date: '2025-03-01',
    type: 'religious',
    description: { ar: 'موسم الخير والبركة والعروض العائلية', en: 'Season of blessings and family offers' }
  },
  {
    id: '2',
    title: { ar: 'عيد الفطر', en: 'Eid Al-Fitr' },
    date: '2025-03-31',
    type: 'religious',
    description: { ar: 'عيد الفرح والتسوق والهدايا', en: 'Eid of joy, shopping and gifts' }
  },
  {
    id: '3',
    title: { ar: 'يوم التأسيس السعودي', en: 'Saudi Founding Day' },
    date: '2025-02-22',
    type: 'national',
    description: { ar: 'ذكرى تأسيس الدولة السعودية الأولى', en: 'Commemoration of the founding of the first Saudi state' }
  },
  {
    id: '4',
    title: { ar: 'الجمعة البيضاء', en: 'White Friday' },
    date: '2025-11-28',
    type: 'commercial',
    description: { ar: 'أكبر موسم تخفيضات في السنة', en: 'The biggest sales season of the year' }
  },
  {
    id: '5',
    title: { ar: 'يوم القهوة العالمي', en: 'International Coffee Day' },
    date: '2025-10-01',
    type: 'global',
    description: { ar: 'يوم للاحتفال بمحبي القهوة حول العالم', en: 'A day to celebrate coffee lovers around the world' }
  }
];

export const BUSINESS_TYPES = [
  'retail', 'fashion', 'food', 'tech', 'beauty', 'services'
];

export const SOCIAL_PLATFORMS = [
  'Instagram', 'X', 'TikTok', 'Snapchat', 'Facebook', 'WhatsApp'
];

export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: 'm1',
    storeName: 'أزياء النخبة',
    businessType: 'fashion',
    country: 'SA',
    phone: '+966501234567',
    email: 'info@elitefashion.com',
    primaryColor: '#8b5cf6',
    platforms: ['Instagram', 'Snapchat'],
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 'm2',
    storeName: 'تكنو زون',
    businessType: 'tech',
    country: 'SA',
    phone: '+966507654321',
    email: 'hello@technozone.sa',
    primaryColor: '#3b82f6',
    platforms: ['X', 'LinkedIn'],
    createdAt: '2024-02-10',
    status: 'active'
  },
  {
    id: 'm3',
    storeName: 'مذاق البيت',
    businessType: 'food',
    country: 'SA',
    phone: '+966555555555',
    email: 'order@hometaste.com',
    primaryColor: '#f59e0b',
    platforms: ['Instagram', 'WhatsApp'],
    createdAt: '2024-03-05',
    status: 'active'
  },
  {
    id: 'm4',
    storeName: 'عطور باريس',
    businessType: 'beauty',
    country: 'AE',
    phone: '+971501234567',
    email: 'contact@parisperfumes.ae',
    primaryColor: '#ec4899',
    platforms: ['TikTok', 'Snapchat'],
    createdAt: '2024-03-20',
    status: 'inactive'
  },
  {
    id: 'm5',
    storeName: 'حلول ذكية',
    businessType: 'services',
    country: 'SA',
    phone: '+966509998887',
    email: 'pro@smartsolutions.sa',
    primaryColor: '#10b981',
    platforms: ['LinkedIn', 'X'],
    createdAt: '2024-04-01',
    status: 'active'
  }
];
