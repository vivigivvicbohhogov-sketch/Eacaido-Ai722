import React, { useState } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SettingsPanel } from './SettingsPanel';
import { useI18n } from '../lib/i18n';
import { Settings, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenAdminModal?: () => void;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdminModal, showLogout }) => {
  const { t } = useI18n();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('escaido_current_code');
    navigate('/CodeEntry');
  };

  return (
    <header className="relative z-20 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AnimatedLogo size="md" onClick={onOpenAdminModal} />
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>{t('app_title')}</span>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">PRO AI</span>
            </h1>
            <p className="text-xs text-zinc-400 hidden sm:block">{t('app_subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all shadow-sm"
            title={t('settings')}
          >
            <Settings size={18} />
          </button>

          {showLogout && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-bold"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          )}
        </div>
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
};
