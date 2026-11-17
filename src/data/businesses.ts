export type BusinessCategory = 'barber' | 'gym' | 'tailor' | 'salon' | 'clinic';

export interface BusinessService {
  id: string;
  nameEn: string;
  nameAr: string;
  durationMin: number;
  priceUsd: number;
  depositUsd: number;
}

export interface BusinessStaff {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  initials: string;
  rating: number;
}

export interface BusinessGalleryItem {
  id: string;
  captionEn: string;
  captionAr: string;
  tone: 'coral' | 'amber' | 'slate' | 'emerald';
}

export interface BusinessHour {
  dayEn: string;
  dayAr: string;
  hoursEn: string;
  hoursAr: string;
}

export interface BusinessRecord {
  id: string;
  category: BusinessCategory;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  neighborhoodEn: string;
  neighborhoodAr: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  priceLevel: 1 | 2 | 3;
  availableNow: boolean;
  acceptsCards: boolean;
  featured: boolean;
  coverTone: 'coral' | 'amber' | 'teal' | 'indigo' | 'rose';
  services: BusinessService[];
  staff: BusinessStaff[];
  gallery: BusinessGalleryItem[];
  hours: BusinessHour[];
  links: {
    instagram: string;
    facebook: string;
    googleReview: string;
    website: string;
    phone: string;
    whatsapp: string;
  };
}

export interface BookingRecord {
  id: string;
  businessId: string;
  businessNameEn: string;
  businessNameAr: string;
  serviceNameEn: string;
  serviceNameAr: string;
  staffNameEn: string;
  staffNameAr: string;
  dateKey: string;
  timeSlot: string;
  priceUsd: number;
  depositUsd: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

const STANDARD_HOURS: BusinessHour[] = [
  { dayEn: 'Mon – Thu', dayAr: 'الإثنين – الخميس', hoursEn: '09:00 – 21:00', hoursAr: '09:00 – 21:00' },
  { dayEn: 'Friday', dayAr: 'الجمعة', hoursEn: '13:00 – 22:00', hoursAr: '13:00 – 22:00' },
  { dayEn: 'Saturday', dayAr: 'السبت', hoursEn: '10:00 – 21:00', hoursAr: '10:00 – 21:00' },
  { dayEn: 'Sunday', dayAr: 'الأحد', hoursEn: '10:00 – 18:00', hoursAr: '10:00 – 18:00' },
];

export const BUSINESSES: BusinessRecord[] = [
  {
    id: 'biz-1',
    category: 'barber',
    nameEn: 'Crescent Blade Studio',
    nameAr: 'استوديو كريسنت بليد',
    taglineEn: 'Precision fades, hot-towel shaves & beard sculpting.',
    taglineAr: 'قصات دقيقة وحلاقة بالمنشفة الساخنة وتهذيب اللحية.',
    neighborhoodEn: 'Marina Walk',
    neighborhoodAr: 'ممشى المارينا',
    rating: 4.9,
    reviewCount: 218,
    distanceKm: 0.4,
    priceLevel: 2,
    availableNow: true,
    acceptsCards: true,
    featured: true,
    coverTone: 'coral',
    services: [
      { id: 's-101', nameEn: 'Signature Cut & Fade', nameAr: 'قصة وتدريج مميز', durationMin: 40, priceUsd: 35, depositUsd: 10 },
      { id: 's-102', nameEn: 'Hot-Towel Beard Sculpt', nameAr: 'تهذيب اللحية بالمنشفة الساخنة', durationMin: 30, priceUsd: 25, depositUsd: 5 },
      { id: 's-103', nameEn: 'Cut + Beard Full Session', nameAr: 'جلسة قص ولحية كاملة', durationMin: 60, priceUsd: 52, depositUsd: 15 },
    ],
    staff: [
      { id: 'st-1', nameEn: 'Tariq Mansoor', nameAr: 'طارق منصور', roleEn: 'Master Barber', roleAr: 'حلاق محترف', initials: 'TM', rating: 4.9 },
      { id: 'st-2', nameEn: 'Liam Mercer', nameAr: 'ليام ميرسر', roleEn: 'Fade Specialist', roleAr: 'أخصائي تدريج', initials: 'LM', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-1', captionEn: 'Chair stations', captionAr: 'كراسي الحلاقة', tone: 'coral' },
      { id: 'g-2', captionEn: 'Hot towel prep', captionAr: 'تجهيز المنشفة الساخنة', tone: 'amber' },
      { id: 'g-3', captionEn: 'Grooming shelf', captionAr: 'رف العناية', tone: 'slate' },
      { id: 'g-4', captionEn: 'Lounge waiting area', captionAr: 'صالة الانتظار', tone: 'emerald' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/crescentblade.demo',
      facebook: 'https://facebook.com/crescentblade.demo',
      googleReview: 'https://maps.google.com/?q=Crescent+Blade+Studio',
      website: 'https://crescentblade.demo',
      phone: '+15550101',
      whatsapp: 'https://wa.me/15550101',
    },
  },
  {
    id: 'biz-2',
    category: 'barber',
    nameEn: 'Harbor Trim & Shave',
    nameAr: 'هاربور للقص والحلاقة',
    taglineEn: 'Classic neighborhood cuts with quick walk-in slots.',
    taglineAr: 'قصات كلاسيكية ومواعيد سريعة في الحي.',
    neighborhoodEn: 'Old Pier',
    neighborhoodAr: 'الرصيف القديم',
    rating: 4.7,
    reviewCount: 134,
    distanceKm: 1.8,
    priceLevel: 1,
    availableNow: true,
    acceptsCards: false,
    featured: false,
    coverTone: 'slate' as unknown as 'indigo',
    services: [
      { id: 's-201', nameEn: 'Classic Scissor Cut', nameAr: 'قصة مقص كلاسيكية', durationMin: 30, priceUsd: 22, depositUsd: 5 },
      { id: 's-202', nameEn: 'Express Beard Trim', nameAr: 'تشذيب لحية سريع', durationMin: 20, priceUsd: 16, depositUsd: 5 },
    ],
    staff: [
      { id: 'st-3', nameEn: 'Nabil Kareem', nameAr: 'نبيل كريم', roleEn: 'Senior Barber', roleAr: 'حلاق أول', initials: 'NK', rating: 4.7 },
    ],
    gallery: [
      { id: 'g-5', captionEn: 'Main floor', captionAr: 'الصالة الرئيسية', tone: 'slate' },
      { id: 'g-6', captionEn: 'Classic mirrors', captionAr: 'المرايا الكلاسيكية', tone: 'amber' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/harbortrim.demo',
      facebook: 'https://facebook.com/harbortrim.demo',
      googleReview: 'https://maps.google.com/?q=Harbor+Trim',
      website: 'https://harbortrim.demo',
      phone: '+15550102',
      whatsapp: 'https://wa.me/15550102',
    },
  },
  {
    id: 'biz-3',
    category: 'gym',
    nameEn: 'IronPulse Athletic',
    nameAr: 'أيرون بالس الرياضي',
    taglineEn: 'Personal strength coaching, mobility & recovery pods.',
    taglineAr: 'تدريب قوة شخصي، مرونة واستشفاء عضلي.',
    neighborhoodEn: 'Midtown Plaza',
    neighborhoodAr: 'ساحة وسط المدينة',
    rating: 4.8,
    reviewCount: 305,
    distanceKm: 0.9,
    priceLevel: 3,
    availableNow: true,
    acceptsCards: true,
    featured: true,
    coverTone: 'amber',
    services: [
      { id: 's-301', nameEn: '1-on-1 Strength Session', nameAr: 'جلسة قوة فردية', durationMin: 60, priceUsd: 65, depositUsd: 20 },
      { id: 's-302', nameEn: 'Mobility & Recovery Pass', nameAr: 'جلسة مرونة واستشفاء', durationMin: 45, priceUsd: 40, depositUsd: 10 },
      { id: 's-303', nameEn: 'Body Composition Assessment', nameAr: 'تقييم تكوين الجسم', durationMin: 30, priceUsd: 30, depositUsd: 10 },
    ],
    staff: [
      { id: 'st-4', nameEn: 'Maya Vance', nameAr: 'مايا فانس', roleEn: 'Head Strength Coach', roleAr: 'كبيرة مدربي القوة', initials: 'MV', rating: 4.9 },
      { id: 'st-5', nameEn: 'Omar Haddad', nameAr: 'عمر حداد', roleEn: 'Mobility Specialist', roleAr: 'أخصائي المرونة', initials: 'OH', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-7', captionEn: 'Olympic lifting racks', captionAr: 'منصات رفع الأثقال', tone: 'amber' },
      { id: 'g-8', captionEn: 'Turf sprint lane', captionAr: 'مسار الجري الداخلي', tone: 'coral' },
      { id: 'g-9', captionEn: 'Recovery suite', captionAr: 'جناح الاستشفاء', tone: 'emerald' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/ironpulse.demo',
      facebook: 'https://facebook.com/ironpulse.demo',
      googleReview: 'https://maps.google.com/?q=IronPulse+Athletic',
      website: 'https://ironpulse.demo',
      phone: '+15550103',
      whatsapp: 'https://wa.me/15550103',
    },
  },
  {
    id: 'biz-4',
    category: 'gym',
    nameEn: 'NorthYard Strength Lab',
    nameAr: 'مختبر نورث يارد للقوة',
    taglineEn: 'Small-group conditioning and kettlebell clinics.',
    taglineAr: 'تمارين لياقة جماعية صغيرة وتدريبات كيتل بل.',
    neighborhoodEn: 'North Quarter',
    neighborhoodAr: 'الحي الشمالي',
    rating: 4.6,
    reviewCount: 92,
    distanceKm: 3.2,
    priceLevel: 2,
    availableNow: false,
    acceptsCards: true,
    featured: false,
    coverTone: 'teal',
    services: [
      { id: 's-401', nameEn: 'Conditioning Drop-In', nameAr: 'حصة لياقة بدنية', durationMin: 50, priceUsd: 28, depositUsd: 10 },
      { id: 's-402', nameEn: 'Kettlebell Technique Clinic', nameAr: 'ورشة تقنيات الكيتل بل', durationMin: 60, priceUsd: 45, depositUsd: 15 },
    ],
    staff: [
      { id: 'st-6', nameEn: 'Devon Brooks', nameAr: 'ديفون بروكس', roleEn: 'Performance Coach', roleAr: 'مدرب أداء', initials: 'DB', rating: 4.6 },
    ],
    gallery: [
      { id: 'g-10', captionEn: 'Kettlebell wall', captionAr: 'جدار الأوزان', tone: 'emerald' },
      { id: 'g-11', captionEn: 'Group studio', captionAr: 'قاعة المجموعات', tone: 'slate' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/northyard.demo',
      facebook: 'https://facebook.com/northyard.demo',
      googleReview: 'https://maps.google.com/?q=NorthYard+Lab',
      website: 'https://northyard.demo',
      phone: '+15550104',
      whatsapp: 'https://wa.me/15550104',
    },
  },
  {
    id: 'biz-5',
    category: 'tailor',
    nameEn: 'Threadline Bespoke',
    nameAr: 'ثريدلاين للتفصيل الفاخر',
    taglineEn: 'Custom suits, precision alterations & bridal hems.',
    taglineAr: 'بدلات مفصلة وتعديلات دقيقة وتفصيل فساتين.',
    neighborhoodEn: 'Design District',
    neighborhoodAr: 'حي التصميم',
    rating: 4.9,
    reviewCount: 164,
    distanceKm: 0.7,
    priceLevel: 3,
    availableNow: true,
    acceptsCards: true,
    featured: true,
    coverTone: 'indigo',
    services: [
      { id: 's-501', nameEn: 'Bespoke Suit Fitting', nameAr: 'قياس وتفصيل بدلة كاملة', durationMin: 45, priceUsd: 95, depositUsd: 25 },
      { id: 's-502', nameEn: 'Jacket & Trouser Tailoring', nameAr: 'تعديل سترة وبنطال', durationMin: 30, priceUsd: 45, depositUsd: 15 },
      { id: 's-503', nameEn: 'Express Hemming', nameAr: 'تقصير وثني سريع', durationMin: 20, priceUsd: 24, depositUsd: 5 },
    ],
    staff: [
      { id: 'st-7', nameEn: 'Salim Al-Noor', nameAr: 'سالم النور', roleEn: 'Master Tailor', roleAr: 'خياط رئيسي', initials: 'SN', rating: 5.0 },
      { id: 'st-8', nameEn: 'Elena Rossi', nameAr: 'إيلينا روسي', roleEn: 'Pattern Specialist', roleAr: 'أخصائية قص وتصميم', initials: 'ER', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-12', captionEn: 'Italian wool bolts', captionAr: 'أقمشة صوف فاخرة', tone: 'slate' },
      { id: 'g-13', captionEn: 'Fitting mirrors', captionAr: 'غرفة القياس', tone: 'amber' },
      { id: 'g-14', captionEn: 'Hand-finished lapels', captionAr: 'تشطيب يدوي دقيق', tone: 'coral' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/threadline.demo',
      facebook: 'https://facebook.com/threadline.demo',
      googleReview: 'https://maps.google.com/?q=Threadline+Bespoke',
      website: 'https://threadline.demo',
      phone: '+15550105',
      whatsapp: 'https://wa.me/15550105',
    },
  },
  {
    id: 'biz-6',
    category: 'tailor',
    nameEn: 'Stitched & Pressed',
    nameAr: 'ستيتشد آند بريسد',
    taglineEn: 'Everyday garment repairs, zippers & steam pressing.',
    taglineAr: 'إصلاح الملابس اليومية والسحابات والكي بالبخار.',
    neighborhoodEn: 'Cedar Lane',
    neighborhoodAr: 'ممر الأرز',
    rating: 4.5,
    reviewCount: 79,
    distanceKm: 2.4,
    priceLevel: 1,
    availableNow: false,
    acceptsCards: false,
    featured: false,
    coverTone: 'amber',
    services: [
      { id: 's-601', nameEn: 'Denim & Trouser Hem', nameAr: 'تقصير الجينز والبناطيل', durationMin: 20, priceUsd: 18, depositUsd: 5 },
      { id: 's-602', nameEn: 'Zipper Replacement', nameAr: 'تبديل سحاب كامل', durationMin: 25, priceUsd: 22, depositUsd: 5 },
    ],
    staff: [
      { id: 'st-9', nameEn: 'Farida Zaid', nameAr: 'فريدة زيد', roleEn: 'Alterations Lead', roleAr: 'مسؤولة التعديلات', initials: 'FZ', rating: 4.6 },
    ],
    gallery: [
      { id: 'g-15', captionEn: 'Worktable & presses', captionAr: 'طاولة الخياطة والبخار', tone: 'amber' },
      { id: 'g-16', captionEn: 'Thread archive', captionAr: 'مكتبة الخيوط', tone: 'emerald' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/stitchedpressed.demo',
      facebook: 'https://facebook.com/stitchedpressed.demo',
      googleReview: 'https://maps.google.com/?q=Stitched+Pressed',
      website: 'https://stitchedpressed.demo',
      phone: '+15550106',
      whatsapp: 'https://wa.me/15550106',
    },
  },
  {
    id: 'biz-7',
    category: 'salon',
    nameEn: 'Velvet Crown Salon',
    nameAr: 'صالون فيلفيت كراون',
    taglineEn: 'Balayage, silk blowouts & botanical scalp treatments.',
    taglineAr: 'صبغات بالياج، تصفيف حريري وعناية نباتية بفروة الرأس.',
    neighborhoodEn: 'Marina Walk',
    neighborhoodAr: 'ممشى المارينا',
    rating: 4.8,
    reviewCount: 247,
    distanceKm: 1.1,
    priceLevel: 2,
    availableNow: true,
    acceptsCards: true,
    featured: true,
    coverTone: 'rose',
    services: [
      { id: 's-701', nameEn: 'Cut & Silk Blowout', nameAr: 'قص وتصفيف حريري', durationMin: 55, priceUsd: 58, depositUsd: 15 },
      { id: 's-702', nameEn: 'Botanical Scalp Ritual', nameAr: 'جلسة عناية نباتية للشعر', durationMin: 40, priceUsd: 48, depositUsd: 15 },
      { id: 's-703', nameEn: 'Gloss & Color Refresh', nameAr: 'تلوين ولمعان للشعر', durationMin: 75, priceUsd: 90, depositUsd: 25 },
    ],
    staff: [
      { id: 'st-10', nameEn: 'Layla Khoury', nameAr: 'ليلى خوري', roleEn: 'Creative Director', roleAr: 'المديرة الإبداعية', initials: 'LK', rating: 4.9 },
      { id: 'st-11', nameEn: 'Chloe Bennett', nameAr: 'كلوي بينيت', roleEn: 'Color Artist', roleAr: 'خبيرة تلوين', initials: 'CB', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-17', captionEn: 'Styling suite', captionAr: 'جناح التصفيف', tone: 'coral' },
      { id: 'g-18', captionEn: 'Wash lounge', captionAr: 'ركن العناية والغسيل', tone: 'slate' },
      { id: 'g-19', captionEn: 'Color bar', captionAr: 'ركن الألوان', tone: 'amber' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/velvetcrown.demo',
      facebook: 'https://facebook.com/velvetcrown.demo',
      googleReview: 'https://maps.google.com/?q=Velvet+Crown+Salon',
      website: 'https://velvetcrown.demo',
      phone: '+15550107',
      whatsapp: 'https://wa.me/15550107',
    },
  },
  {
    id: 'biz-8',
    category: 'salon',
    nameEn: 'Saffron Glow Beauty',
    nameAr: 'سافرون غلو للتجميل',
    taglineEn: 'Facial sculpting, brow lamination & nail artistry.',
    taglineAr: 'نحت الوجه وتصفيف الحواجب والعناية بالأظافر.',
    neighborhoodEn: 'Garden Row',
    neighborhoodAr: 'صف الحدائق',
    rating: 4.7,
    reviewCount: 156,
    distanceKm: 2.9,
    priceLevel: 3,
    availableNow: true,
    acceptsCards: true,
    featured: false,
    coverTone: 'coral',
    services: [
      { id: 's-801', nameEn: 'Sculpting Glow Facial', nameAr: 'تنظيف ونحت الوجه', durationMin: 60, priceUsd: 85, depositUsd: 20 },
      { id: 's-802', nameEn: 'Brow Lamination & Tint', nameAr: 'تصفيف وصبغ الحواجب', durationMin: 35, priceUsd: 42, depositUsd: 10 },
    ],
    staff: [
      { id: 'st-12', nameEn: 'Nadia Farouk', nameAr: 'نادية فاروق', roleEn: 'Lead Esthetician', roleAr: 'خبيرة بشرة أولى', initials: 'NF', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-20', captionEn: 'Treatment room', captionAr: 'غرفة العناية', tone: 'coral' },
      { id: 'g-21', captionEn: 'Nail studio', captionAr: 'ركن الأظافر', tone: 'emerald' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/saffronglow.demo',
      facebook: 'https://facebook.com/saffronglow.demo',
      googleReview: 'https://maps.google.com/?q=Saffron+Glow',
      website: 'https://saffronglow.demo',
      phone: '+15550108',
      whatsapp: 'https://wa.me/15550108',
    },
  },
  {
    id: 'biz-9',
    category: 'salon',
    nameEn: 'Suncrest Loom Hair',
    nameAr: 'صن كريست لوم للشعر',
    taglineEn: 'Quick trims, natural curls & express styling.',
    taglineAr: 'قص سريع وعناية بالشعر المجعد وتسريحات يومية.',
    neighborhoodEn: 'West End',
    neighborhoodAr: 'الطرف الغربي',
    rating: 4.4,
    reviewCount: 68,
    distanceKm: 4.1,
    priceLevel: 1,
    availableNow: false,
    acceptsCards: true,
    featured: false,
    coverTone: 'teal',
    services: [
      { id: 's-901', nameEn: 'Curl Refresh & Trim', nameAr: 'قص وتنشيط التموجات', durationMin: 45, priceUsd: 32, depositUsd: 10 },
      { id: 's-902', nameEn: 'Express Dry Style', nameAr: 'تصفيف جاف سريع', durationMin: 25, priceUsd: 24, depositUsd: 5 },
    ],
    staff: [
      { id: 'st-13', nameEn: 'Hana Soliman', nameAr: 'هنا سليمان', roleEn: 'Curl Specialist', roleAr: 'أخصائية الشعر المجعد', initials: 'HS', rating: 4.5 },
    ],
    gallery: [
      { id: 'g-22', captionEn: 'Bright salon floor', captionAr: 'صالة مضيئة', tone: 'emerald' },
      { id: 'g-23', captionEn: 'Natural care shelf', captionAr: 'منتجات طبيعية', tone: 'amber' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/suncrestloom.demo',
      facebook: 'https://facebook.com/suncrestloom.demo',
      googleReview: 'https://maps.google.com/?q=Suncrest+Loom',
      website: 'https://suncrestloom.demo',
      phone: '+15550109',
      whatsapp: 'https://wa.me/15550109',
    },
  },
  {
    id: 'biz-10',
    category: 'clinic',
    nameEn: 'CedarPoint Medical Clinic',
    nameAr: 'عيادة سيداربوينت الطبية',
    taglineEn: 'Same-day family medicine, blood panels & checkups.',
    taglineAr: 'طب الأسرة في نفس اليوم وتحاليل الدم والفحوصات.',
    neighborhoodEn: 'Civic Square',
    neighborhoodAr: 'الساحة المدنية',
    rating: 4.9,
    reviewCount: 312,
    distanceKm: 0.6,
    priceLevel: 3,
    availableNow: true,
    acceptsCards: true,
    featured: true,
    coverTone: 'teal',
    services: [
      { id: 's-1001', nameEn: 'Comprehensive GP Checkup', nameAr: 'فحص طبيب عام شامل', durationMin: 30, priceUsd: 75, depositUsd: 20 },
      { id: 's-1002', nameEn: 'Vitality Blood Panel', nameAr: 'تحليل دم شامل', durationMin: 20, priceUsd: 55, depositUsd: 15 },
      { id: 's-1003', nameEn: 'Travel & Wellness Consult', nameAr: 'استشارة صحية وسفر', durationMin: 25, priceUsd: 50, depositUsd: 15 },
    ],
    staff: [
      { id: 'st-14', nameEn: 'Dr. Rania Tarek', nameAr: 'د. رانيا طارق', roleEn: 'Family Physician', roleAr: 'طبيبة أسرة', initials: 'RT', rating: 4.9 },
      { id: 'st-15', nameEn: 'Dr. Daniel Park', nameAr: 'د. دانيال بارك', roleEn: 'Internal Medicine', roleAr: 'طب باطني', initials: 'DP', rating: 4.9 },
    ],
    gallery: [
      { id: 'g-24', captionEn: 'Reception lounge', captionAr: 'صالة الاستقبال', tone: 'emerald' },
      { id: 'g-25', captionEn: 'Consultation suite', captionAr: 'غرفة الاستشارة', tone: 'slate' },
      { id: 'g-26', captionEn: 'Diagnostic lab', captionAr: 'مختبر التحاليل', tone: 'coral' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/cedarpointclinic.demo',
      facebook: 'https://facebook.com/cedarpointclinic.demo',
      googleReview: 'https://maps.google.com/?q=CedarPoint+Clinic',
      website: 'https://cedarpointclinic.demo',
      phone: '+15550110',
      whatsapp: 'https://wa.me/15550110',
    },
  },
  {
    id: 'biz-11',
    category: 'clinic',
    nameEn: 'Bayview Dental & Care',
    nameAr: 'باي فيو لطب الأسنان',
    taglineEn: 'Gentle cleanings, digital scans & whitening care.',
    taglineAr: 'تنظيف لطيف للأسنان وفحص رقمي وتبييض.',
    neighborhoodEn: 'Harbor View',
    neighborhoodAr: 'إطلالة الميناء',
    rating: 4.7,
    reviewCount: 189,
    distanceKm: 1.5,
    priceLevel: 2,
    availableNow: true,
    acceptsCards: true,
    featured: false,
    coverTone: 'indigo',
    services: [
      { id: 's-1101', nameEn: 'Dental Hygiene & Polish', nameAr: 'تنظيف وتلميع الأسنان', durationMin: 45, priceUsd: 68, depositUsd: 20 },
      { id: 's-1102', nameEn: 'Digital Checkup & X-Ray', nameAr: 'فحص رقمي وأشعة', durationMin: 30, priceUsd: 52, depositUsd: 15 },
    ],
    staff: [
      { id: 'st-16', nameEn: 'Dr. Sami Jaber', nameAr: 'د. سامي جابر', roleEn: 'Lead Dentist', roleAr: 'طبيب أسنان أول', initials: 'SJ', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-27', captionEn: 'Dental suite', captionAr: 'عيادة الأسنان', tone: 'slate' },
      { id: 'g-28', captionEn: 'Digital imaging bay', captionAr: 'قسم التصوير الرقمي', tone: 'emerald' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/bayviewdental.demo',
      facebook: 'https://facebook.com/bayviewdental.demo',
      googleReview: 'https://maps.google.com/?q=Bayview+Dental',
      website: 'https://bayviewdental.demo',
      phone: '+15550111',
      whatsapp: 'https://wa.me/15550111',
    },
  },
  {
    id: 'biz-12',
    category: 'clinic',
    nameEn: 'Oakridge Physio Center',
    nameAr: 'مركز أوكريدج للعلاج الطبيعي',
    taglineEn: 'Sports physiotherapy, dry needling & posture rehab.',
    taglineAr: 'علاج طبيعي رياضي وإعادة تأهيل القوام.',
    neighborhoodEn: 'Oakridge Park',
    neighborhoodAr: 'حديقة أوكريدج',
    rating: 4.8,
    reviewCount: 112,
    distanceKm: 3.6,
    priceLevel: 2,
    availableNow: false,
    acceptsCards: true,
    featured: false,
    coverTone: 'rose',
    services: [
      { id: 's-1201', nameEn: 'Physio Evaluation & Relief', nameAr: 'تقييم وعلاج طبيعي', durationMin: 50, priceUsd: 62, depositUsd: 15 },
      { id: 's-1202', nameEn: 'Posture & Spine Reset', nameAr: 'تأهيل العمود الفقري', durationMin: 40, priceUsd: 54, depositUsd: 15 },
    ],
    staff: [
      { id: 'st-17', nameEn: 'Dr. Hannah Cho', nameAr: 'د. هانا تشو', roleEn: 'Sports Physiotherapist', roleAr: 'أخصائية علاج طبيعي', initials: 'HC', rating: 4.8 },
    ],
    gallery: [
      { id: 'g-29', captionEn: 'Rehab studio', captionAr: 'قاعة التأهيل', tone: 'coral' },
      { id: 'g-30', captionEn: 'Manual therapy room', captionAr: 'غرفة العلاج اليدوي', tone: 'amber' },
    ],
    hours: STANDARD_HOURS,
    links: {
      instagram: 'https://instagram.com/oakridgephysio.demo',
      facebook: 'https://facebook.com/oakridgephysio.demo',
      googleReview: 'https://maps.google.com/?q=Oakridge+Physio',
      website: 'https://oakridgephysio.demo',
      phone: '+15550112',
      whatsapp: 'https://wa.me/15550112',
    },
  },
];

export const TIME_SLOTS: string[] = [
  '09:30',
  '11:00',
  '13:30',
  '15:00',
  '17:30',
  '19:00',
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-101',
    businessId: 'biz-1',
    businessNameEn: 'Crescent Blade Studio',
    businessNameAr: 'استوديو كريسنت بليد',
    serviceNameEn: 'Signature Cut & Fade',
    serviceNameAr: 'قصة وتدريج مميز',
    staffNameEn: 'Tariq Mansoor',
    staffNameAr: 'طارق منصور',
    dateKey: '2026-11-18',
    timeSlot: '15:00',
    priceUsd: 35,
    depositUsd: 10,
    status: 'upcoming',
  },
  {
    id: 'bk-102',
    businessId: 'biz-7',
    businessNameEn: 'Velvet Crown Salon',
    businessNameAr: 'صالون فيلفيت كراون',
    serviceNameEn: 'Cut & Silk Blowout',
    serviceNameAr: 'قص وتصفيف حريري',
    staffNameEn: 'Layla Khoury',
    staffNameAr: 'ليلى خوري',
    dateKey: '2026-11-20',
    timeSlot: '11:00',
    priceUsd: 58,
    depositUsd: 15,
    status: 'upcoming',
  },
  {
    id: 'bk-098',
    businessId: 'biz-10',
    businessNameEn: 'CedarPoint Medical Clinic',
    businessNameAr: 'عيادة سيداربوينت الطبية',
    serviceNameEn: 'Comprehensive GP Checkup',
    serviceNameAr: 'فحص طبيب عام شامل',
    staffNameEn: 'Dr. Rania Tarek',
    staffNameAr: 'د. رانيا طارق',
    dateKey: '2026-11-10',
    timeSlot: '09:30',
    priceUsd: 75,
    depositUsd: 20,
    status: 'completed',
  },
  {
    id: 'bk-095',
    businessId: 'biz-3',
    businessNameEn: 'IronPulse Athletic',
    businessNameAr: 'أيرون بالس الرياضي',
    serviceNameEn: 'Mobility & Recovery Pass',
    serviceNameAr: 'جلسة مرونة واستشفاء',
    staffNameEn: 'Omar Haddad',
    staffNameAr: 'عمر حداد',
    dateKey: '2026-11-04',
    timeSlot: '17:30',
    priceUsd: 40,
    depositUsd: 10,
    status: 'completed',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    questionEn: 'Can I browse businesses without creating an account?',
    questionAr: 'هل يمكنني تصفح الأنشطة التجارية دون إنشاء حساب؟',
    answerEn:
      'Yes. Guest visitors can browse categories, search businesses, inspect full profiles, and test the booking prototype without signing in.',
    answerAr:
      'نعم. يمكن للزوار استكشاف التصنيفات والبحث وتفحص الملفات الكاملة وتجربة الحجز دون تسجيل دخول.',
  },
  {
    id: 'faq-2',
    questionEn: 'How do booking deposits work in this prototype?',
    questionAr: 'كيف تعمل دفعة الحجز المبدئية في هذا النموذج؟',
    answerEn:
      'The deposit step simulates card checkout in memory so you can preview the confirmation flow. No real payment or charge is processed.',
    answerAr:
      'تحاكي خطوة الدفعة عملية الدفع بالبطاقة في الذاكرة فقط لمعاينة التأكيد، ولا يتم خصم أي مبالغ حقيقية.',
  },
  {
    id: 'faq-3',
    questionEn: 'Can I cancel or reschedule an upcoming booking?',
    questionAr: 'هل يمكنني إلغاء حجز قادم أو إعادة جدولته؟',
    answerEn:
      'Open the Bookings tab, choose Upcoming, and tap Reschedule to pick a new date and time slot, or Cancel to move the appointment to Past.',
    answerAr:
      'افتح تبويب حجوزاتي، واختر القادمة، ثم اضغط إعادة الجدولة لاختيار يوم ووقت جديدين أو إلغاء لنقل الموعد إلى السابقة.',
  },
  {
    id: 'faq-4',
    questionEn: 'How do I switch between Dark/Light mode or Arabic RTL?',
    questionAr: 'كيف أبدل بين المظهر الداكن والفاتح أو اللغة العربية؟',
    answerEn:
      'Use the language and theme buttons in the top bar or inside the Profile Hub at any time.',
    answerAr:
      'استخدم أزرار اللغة والمظهر في الشريط العلوي أو داخل مركز الملف الشخصي في أي وقت.',
  },
];
