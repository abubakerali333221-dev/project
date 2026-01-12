
import { MarketingEvent, Merchant } from './types';

export const MOCK_EVENTS: MarketingEvent[] = [
  {
    id: '1',
    title: { ar: 'يوم التأسيس السعودي', en: 'Saudi Founding Day' },
    date: '2026-02-22',
    type: 'national',
    priority: 'high',
    description: { ar: 'ذكرى تأسيس الدولة السعودية الأولى - ذروة تسويقية كبرى تبرز الهوية الوطنية.', en: 'Founding of the first Saudi state - Major marketing peak highlighting national identity.' }
  },
  {
    id: '2',
    title: { ar: 'موسم رمضان المبارك', en: 'Ramadan Season' },
    date: '2026-02-18', // Approx start in 2026
    type: 'religious',
    priority: 'high',
    description: { ar: 'أكبر موسم استهلاكي وتفاعلي في السنة، يتطلب حملات مكثفة وعروض رمضانية.', en: 'The biggest consumer and engagement season of the year.' }
  },
  {
    id: '3',
    title: { ar: 'يوم الأم العالمي', en: 'Mother\'s Day' },
    date: '2026-03-21',
    type: 'global',
    priority: 'medium',
    description: { ar: 'موسم الهدايا والتقدير، مثالي لقطاعات العطور، الذهب، والزهور.', en: 'Season of gifts and appreciation, ideal for perfumes, gold, and flowers.' }
  },
  {
    id: '4',
    title: { ar: 'يوم الفطر السعيد', en: 'Eid Al-Fitr Day' },
    date: '2026-03-20', // Approx end of Ramadan
    type: 'religious',
    priority: 'high',
    description: { ar: 'موسم الاحتفالات، الملابس الجديدة، والحلويات والهدايا.', en: 'Season for celebrations, new clothes, sweets and gifts.' }
  },
  {
    id: '6',
    title: { ar: 'يوم الأب العالمي', en: 'Father\'s Day' },
    date: '2026-06-21',
    type: 'global',
    priority: 'medium',
    description: { ar: 'مناسبة لتقدير الآباء بهدايا تقنية أو إكسسوارات رجالية.', en: 'Opportunity to appreciate fathers with tech gifts or men\'s accessories.' }
  },
  {
    id: '7',
    title: { ar: 'يوم الأضحى المبارك', en: 'Eid Al-Adha Day' },
    date: '2026-05-27', // Approx 2026
    type: 'religious',
    priority: 'high',
    description: { ar: 'موسم السفر، الضيافة، والولائم الكبرى.', en: 'Travel, hospitality, and major banquets season.' }
  },
  {
    id: '8',
    title: { ar: 'موسم العودة للمدارس', en: 'Back to School' },
    date: '2026-08-16',
    type: 'commercial',
    priority: 'high',
    description: { ar: 'موسم حيوي جداً لقطاع القرطاسية، الملابس، والمنتجات التقنية.', en: 'Vital season for stationery, clothing, and tech products.' }
  },
  {
    id: '9',
    title: { ar: 'اليوم الوطني السعودي', en: 'Saudi National Day' },
    date: '2026-09-23',
    type: 'national',
    priority: 'high',
    description: { ar: 'يوم الاحتفاء بالوطن، عروض "96" الشهيرة والفعاليات في كل مكان.', en: 'Celebrating the nation with famous "96" offers and widespread events.' }
  },
  {
    id: '10',
    title: { ar: 'يوم القهوة العالمي', en: 'International Coffee Day' },
    date: '2026-10-01',
    type: 'global',
    priority: 'medium',
    description: { ar: 'يوم ذهبي للمقاهي والمحامص لتقديم عروض تذوق وخصومات.', en: 'A golden day for cafes and roasters to offer tastings and discounts.' }
  },
  {
    id: '11',
    title: { ar: 'يوم المعلم', en: 'Teacher\'s Day' },
    date: '2026-10-05',
    type: 'global',
    priority: 'low',
    description: { ar: 'مناسبة لتقديم عروض رمزية وتقديرية للكادر التعليمي.', en: 'Opportunity for symbolic and appreciative offers for teachers.' }
  },
  {
    id: '12',
    title: { ar: 'يوم الجمعة البيضاء', en: 'White Friday' },
    date: '2026-11-27',
    type: 'commercial',
    priority: 'high',
    description: { ar: 'أقوى موسم مبيعات إلكترونية وتصفيات سنوية.', en: 'The strongest annual e-commerce sales and clearance season.' }
  },
  {
    id: '13',
    title: { ar: 'يوم اللغة العربية', en: 'Arabic Language Day' },
    date: '2026-12-18',
    type: 'global',
    priority: 'low',
    description: { ar: 'تعزيز المحتوى العربي الثقافي والمنتجات ذات الطابع التراثي.', en: 'Promoting Arabic cultural content and heritage-themed products.' }
  },
  {
    id: '14',
    title: { ar: 'يوم الابتسامة العالمي', en: 'World Smile Day' },
    date: '2026-10-02',
    type: 'global',
    priority: 'low',
    description: { ar: 'نشر السعادة بعروض بسيطة وتفاعل إيجابي مع العملاء.', en: 'Spreading happiness with simple offers and positive customer engagement.' }
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
  }
];
