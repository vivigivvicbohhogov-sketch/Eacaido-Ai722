import React from 'react';
import { useI18n } from '../lib/i18n';
import { Language } from '../types';
import { Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ku', label: 'کوردی', flag: '☀️' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-sm font-medium shadow-sm">
        <Globe size={16} />
        <span>{languages.find(l => l.code === language)?.flag}</span>
        <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label}</span>
      </button>

      <div className="absolute right-0 sm:left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              language === lang.code
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
