
export type Language = 'ar' | 'en';

export interface MerchantProfile {
  storeName: string;
  businessType: string;
  country: string;
  phone: string;
  email: string;
  logo?: string;
  primaryColor: string;
  platforms: string[];
}

export interface Merchant extends MerchantProfile {
  id: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface MarketingEvent {
  id: string;
  title: { ar: string; en: string };
  date: string;
  type: 'religious' | 'national' | 'commercial' | 'global' | 'custom';
  description: { ar: string; en: string };
}

export interface GeneratedContent {
  id: string;
  type: 'image' | 'video' | 'copy';
  url?: string;
  text?: string;
  createdAt: string;
  eventId?: string;
}

export interface ScheduledPost {
  id: string;
  contentId: string;
  platform: string;
  scheduledAt: string;
  status: 'pending' | 'published' | 'failed';
}
