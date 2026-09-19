import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  app_title: {
    ar: 'Escaido AI',
    en: 'Escaido AI',
    ku: 'Escaido AI',
    tr: 'Escaido AI',
    fa: 'Escaido AI',
    fr: 'Escaido AI',
    es: 'Escaido AI',
    de: 'Escaido AI',
  },
  app_subtitle: {
    ar: 'منصة إنشاء الفيديوهات والصور بالذكاء الاصطناعي',
    en: 'Professional AI Video & Image Generation Platform',
    ku: 'Platforma Çêkirina Vîdyo û Wêneyan a AI',
    tr: 'Yapay Zeka Video ve Görsel Üretim Platformu',
    fa: 'پلتفرم هوش مصنوعی تولید ویدیو و تصویر',
    fr: 'Plateforme professionnelle de génération vidéo et image par IA',
    es: 'Plataforma profesional de generación de video e imagen con IA',
    de: 'Professionelle KI-Video- und Bildgenerierungsplattform',
  },
  enter_code_title: {
    ar: 'أدخل كود الوصول الخاص بك',
    en: 'Enter Your Access Code',
    ku: 'Koda Gihîştinê Binivîse',
    tr: 'Erişim Kodunuzu Girin',
    fa: 'کد دسترسی خود را وارد کنید',
    fr: 'Entrez votre code d\'accès',
    es: 'Ingrese su código de acceso',
    de: 'Geben Sie Ihren Zugriffscode ein',
  },
  code_placeholder: {
    ar: 'مثال: ESCA-2026-XXXX',
    en: 'e.g. ESCA-2026-XXXX',
    ku: 'mînak: ESCA-2026-XXXX',
    tr: 'örn: ESCA-2026-XXXX',
    fa: 'مثال: ESCA-2026-XXXX',
    fr: 'ex: ESCA-2026-XXXX',
    es: 'ej: ESCA-2026-XXXX',
    de: 'z.B. ESCA-2026-XXXX',
  },
  login_btn: {
    ar: 'دخول المنصة',
    en: 'Access Platform',
    ku: 'Têkeve Platformê',
    tr: 'Platforma Giriş Yap',
    fa: 'ورود به پلتفرم',
    fr: 'Accéder à la plateforme',
    es: 'Acceder a la plataforma',
    de: 'Plattform betreten',
  },
  paste_clipboard: {
    ar: 'لصق من الحافظة',
    en: 'Paste from Clipboard',
    ku: 'Ji Bîrdarê Bipûçîne',
    tr: 'Panodan Yapıştır',
    fa: 'جایگذاری از کلیپ‌بورد',
    fr: 'Coller du presse-papiers',
    es: 'Pegar del portapapeles',
    de: 'Aus Zwischenablage einfügen',
  },
  code_linked_info: {
    ar: 'الكود سيتم ربطه ببريدك الإلكتروني وجهازك الحالي للأمان.',
    en: 'Code will be linked to your email and current device for security.',
    ku: 'Koda we dê bi e-name û cîhaza we re were girêdan ji bo ewlehiyê.',
    tr: 'Kod, güvenlik için e-postanıza ve mevcut cihazınıza bağlanacaktır.',
    fa: 'کد برای امنیت به ایمیل و دستگاه فعلی شما متصل خواهد شد.',
    fr: 'Le code sera lié à votre e-mail et à votre appareil actuel pour plus de sécurité.',
    es: 'El código se vinculará a su correo electrónico y dispositivo actual por seguridad.',
    de: 'Der Code wird aus Sicherheitsgründen mit Ihrer E-Mail und Ihrem aktuellen Gerät verknüpft.',
  },
  need_help: {
    ar: 'هل تواجه مشكلة في الدخول؟ تواصل مع الدعم الفني',
    en: 'Having login issues? Contact Support',
    ku: 'Pirsgirêkên te hene? Têkilî Piştgiriyê bikin',
    tr: 'Giriş sorunu mu yaşıyorsunuz? Destek ile iletişime geçin',
    fa: 'مشکل در ورود؟ با پشتیبانی تماس بگیرید',
    fr: 'Problème de connexion ? Contactez le support',
    es: '¿Problemas de inicio de sesión? Contactar Soporte',
    de: 'Anmeldeprobleme? Support kontaktieren',
  },
  create_video: {
    ar: 'إنشاء فيديو بالذكاء الاصطناعي',
    en: 'Generate AI Video',
    ku: 'Vîdyoya AI Biafirîne',
    tr: 'Yapay Zeka Video Üret',
    fa: 'تولید ویدیو با هوش مصنوعی',
    fr: 'Générer une vidéo IA',
    es: 'Generar Video con IA',
    de: 'KI-Video generieren',
  },
  create_image: {
    ar: 'إنشاء صور بالذكاء الاصطناعي (4K)',
    en: 'Generate AI Image (4K)',
    ku: 'Wêneyê AI (4K) Biafirîne',
    tr: 'Yapay Zeka Görsel Üret (4K)',
    fa: 'تولید تصویر هوش مصنوعی (4K)',
    fr: 'Générer une image IA (4K)',
    es: 'Generar Imagen con IA (4K)',
    de: 'KI-Bild generieren (4K)',
  },
  app_share: {
    ar: 'مشاركة المنصة',
    en: 'Share Platform',
    ku: 'Platformê Parve Bike',
    tr: 'Platformu Paylaş',
    fa: 'اشتراک‌گذاری پلتفرم',
    fr: 'Partager la plateforme',
    es: 'Compartir plataforma',
    de: 'Plattform teilen',
  },
  course_link: {
    ar: 'الكورس التعليمي الشامل',
    en: 'Educational Course',
    ku: ' Kursa Perwerdehiyê',
    tr: 'Eğitim Kursu',
    fa: 'دوره آموزشی',
    fr: 'Cours éducatif',
    es: 'Curso educativo',
    de: 'Bildungskurs',
  },
  support_ticket: {
    ar: 'الدعم الفني والتذاكر',
    en: 'Technical Support & Tickets',
    ku: 'Piştgiriya Teknîkî û Tîket',
    tr: 'Teknik Destek ve Talepler',
    fa: 'پشتیبانی فنی و تیکت‌ها',
    fr: 'Support technique et tickets',
    es: 'Soporte técnico y tickets',
    de: 'Technischer Support & Tickets',
  },
  logout: {
    ar: 'تسجيل الخروج',
    en: 'Logout',
    ku: 'Derkeve',
    tr: 'Çıkış Yap',
    fa: 'خروج',
    fr: 'Déconnexion',
    es: 'Cerrar sesión',
    de: 'Abmelden',
  },
  instructions_title: {
    ar: 'تعليمات هامة للاستخدام الآمن',
    en: 'Important Instructions for Safe Usage',
    ku: 'Rênasên Girîng ji bo Bikaranîna Ewle',
    tr: 'Güvenli Kullanım İçin Önemli Talimatlar',
    fa: 'دستورالعمل‌های مهم برای استفاده ایمن',
    fr: 'Instructions importantes pour une utilisation sûre',
    es: 'Instrucciones importantes para un uso seguro',
    de: 'Wichtige Anweisungen für die sichere Nutzung',
  },
  instruction_1: {
    ar: 'الحد اليومي المسموح به: 10 فيديوهات احترافية لضمان استقرار الخوادم.',
    en: 'Daily limit: 10 professional videos to ensure server stability.',
    ku: 'Sînorê rojane: 10 vîdyo ji bo aramiyê.',
    tr: 'Günlük sınır: Sunucu kararlılığı için 10 profesyonel video.',
    fa: 'حد روزانه: ۱۰ ویدیو حرفه‌ای برای پایداری سرور.',
    fr: 'Limite quotidienne : 10 vidéos professionnelles pour la stabilité.',
    es: 'Límite diario: 10 videos profesionales para la estabilidad del servidor.',
    de: 'Tägliches Limit: 10 professionelle Videos für Serverstabilität.',
  },
  instruction_2: {
    ar: 'تجنب استخدام برامج VPN غير الستراتيكية أثناء توليد الفيديوهات.',
    en: 'Avoid unstable VPN services while generating videos.',
    ku: 'Xizmetên VPN yên nîv-îstîqrar bikar neynin.',
    tr: 'Video üretirken kararsız VPN hizmetlerinden kaçının.',
    fa: 'هنگام تولید ویدیو از VPN های ناپایدار خودداری کنید.',
    fr: 'Évitez les VPN instables lors de la génération de vidéos.',
    es: 'Evite servicios VPN inestables al generar videos.',
    de: 'Vermeiden Sie instabile VPN-Dienste beim Generieren von Videos.',
  },
  instruction_3: {
    ar: 'إنشاء الصور مفتوح بلا حدود بدقة 4K فائقة الوضوح.',
    en: 'Unlimited 4K ultra-HD image generation enabled.',
    ku: 'Çêkirina wêneyên 4K yên bêsînor çalak e.',
    tr: 'Sınırsız 4K ultra HD görsel üretimi etkinleştirildi.',
    fa: 'تولید تصویر ۴K فوق‌العاده با کیفیت نامحدود فعال است.',
    fr: 'Génération d\'images 4K ultra HD illimitée activée.',
    es: 'Generación ilimitada de imágenes 4K ultra HD habilitada.',
    de: 'Unbegrenzte 4K Ultra-HD-Bildgenerierung aktiviert.',
  },
  admin_portal: {
    ar: 'بوابة الإدارة',
    en: 'Admin Portal',
    ku: 'Portala Rêveberiyê',
    tr: 'Yönetici Paneli',
    fa: 'پورتال مدیریت',
    fr: 'Portail administrateur',
    es: 'Portal de administración',
    de: 'Admin-Portal',
  },
  admin_password_prompt: {
    ar: 'أدخل كلمة مرور الإدارة',
    en: 'Enter Admin Password',
    ku: 'Şîfreya Rêveberiyê Binivîse',
    tr: 'Yönetici Şifresini Girin',
    fa: 'رمز عبور مدیریت را وارد کنید',
    fr: 'Entrez le mot de passe admin',
    es: 'Ingrese contraseña de administrador',
    de: 'Admin-Passwort eingeben',
  },
  submit: {
    ar: 'إرسال',
    en: 'Submit',
    ku: 'Bişîne',
    tr: 'Gönder',
    fa: 'ارسال',
    fr: 'Soumettre',
    es: 'Enviar',
    de: 'Absenden',
  },
  cancel: {
    ar: 'إلغاء',
    en: 'Cancel',
    ku: 'Betal bike',
    tr: 'İptal',
    fa: 'لغو',
    fr: 'Annuler',
    es: 'Cancelar',
    de: 'Abbrechen',
  },
  success: {
    ar: 'تم بنجاح',
    en: 'Success',
    ku: 'Bi serfirazî',
    tr: 'Başarılı',
    fa: 'موفقیت‌آمیز',
    fr: 'Succès',
    es: 'Éxito',
    de: 'Erfolgreich',
  },
  error: {
    ar: 'حدث خطأ',
    en: 'An error occurred',
    ku: 'Çewtiyek çêbû',
    tr: 'Bir hata oluştu',
    fa: 'خطایی رخ داد',
    fr: 'Une erreur s\'est produite',
    es: 'Ocurrió un error',
    de: 'Ein Fehler ist aufgetreten',
  },
  active_users: {
    ar: 'متصلون الآن',
    en: 'Active Now',
    ku: 'Niha Çalak',
    tr: 'Şu An Aktif',
    fa: 'اکنون آنلاین',
    fr: 'Actifs maintenant',
    es: 'Activos ahora',
    de: 'Jetzt aktiv',
  },
  stats_total_codes: {
    ar: 'إجمالي الأكواد',
    en: 'Total Codes',
    ku: 'Hemî Kod',
    tr: 'Toplam Kodlar',
    fa: 'کل کدها',
    fr: 'Total des codes',
    es: 'Códigos totales',
    de: 'Gesamtcodes',
  },
  stats_used_codes: {
    ar: 'الأكواد المستخدمة',
    en: 'Used Codes',
    ku: 'Kodên Bikaranîn',
    tr: 'Kullanılan Kodlar',
    fa: 'کدهای استفاده شده',
    fr: 'Codes utilisés',
    es: 'Códigos usados',
    de: 'Verwendete Codes',
  },
  stats_videos_today: {
    ar: 'فيديوهات اليوم',
    en: 'Videos Today',
    ku: 'Vîdyoyên Îro',
    tr: 'Bugünkü Videolar',
    fa: 'ویدیوهای امروز',
    fr: 'Vidéos aujourd\'hui',
    es: 'Videos de hoy',
    de: 'Videos heute',
  },
  settings: {
    ar: 'الإعدادات والتفضيلات',
    en: 'Settings & Preferences',
    ku: 'Mîheng & Vebijark',
    tr: 'Ayarlar ve Tercihler',
    fa: 'تنظیمات و ترجیحات',
    fr: 'Paramètres et préférences',
    es: 'Configuración y preferencias',
    de: 'Einstellungen & Präferenzen',
  },
  theme_mode: {
    ar: 'وضع الشاشة',
    en: 'Display Mode',
    ku: 'Moda Nîşandanê',
    tr: 'Görünüm Modu',
    fa: 'حالت نمایش',
    fr: 'Mode d\'affichage',
    es: 'Modo de visualización',
    de: 'Anzeigemodus',
  },
  night_mode: {
    ar: 'الوضع الليلي (داكن)',
    en: 'Night Mode (Dark)',
    ku: 'Moda Şevê (Tarî)',
    tr: 'Gece Modu (Koyu)',
    fa: 'حالت شب (تاریک)',
    fr: 'Mode nuit (Sombre)',
    es: 'Modo nocturno (Oscuro)',
    de: 'Nachtmodus (Dunkel)',
  },
  day_mode: {
    ar: 'الوضع النهاري (فاتح)',
    en: 'Day Mode (Light)',
    ku: 'Moda Rojê (Ronî)',
    tr: 'Gündüz Modu (Açık)',
    fa: 'حالت روز (روشن)',
    fr: 'Mode jour (Clair)',
    es: 'Modo diurno (Claro)',
    de: 'Tagmodus (Hell)',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (key) => key,
  dir: 'rtl',
});

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('escaido_lang');
    return (saved as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('escaido_lang', lang);
  };

  const dir = language === 'ar' || language === 'fa' || language === 'ku' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key]['ar']) {
      return translations[key]['ar'];
    }
    return key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
