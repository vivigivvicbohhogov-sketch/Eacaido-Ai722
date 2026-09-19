import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { Settings, X, Moon, Sun, Monitor, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [dayNight, setDayNight] = useState<'night' | 'day'>(() => {
    return (localStorage.getItem('escaido_day_night') as 'night' | 'day') || 'night';
  });
  const [frameRate, setFrameRate] = useState<number>(() => {
    return Number(localStorage.getItem('escaido_framerate')) || 60;
  });

  const toggleDayNight = (mode: 'night' | 'day') => {
    setDayNight(mode);
    localStorage.setItem('escaido_day_night', mode);
  };

  const updateFrameRate = (fps: number) => {
    setFrameRate(fps);
    localStorage.setItem('escaido_framerate', fps.toString());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Settings className="text-zinc-400" size={20} />
              <h3 className="text-lg font-black tracking-tight">{t('settings')}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6 pt-6">
            {/* Display Mode */}
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-3">{t('theme_mode')}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleDayNight('night')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-bold transition-all ${
                    dayNight === 'night'
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <Moon size={16} />
                  <span>{t('night_mode')}</span>
                </button>
                <button
                  onClick={() => toggleDayNight('day')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-bold transition-all ${
                    dayNight === 'day'
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <Sun size={16} />
                  <span>{t('day_mode')}</span>
                </button>
              </div>
            </div>

            {/* Frame Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <Gauge size={16} />
                  <span>معدل الإطارات (FPS)</span>
                </label>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-300">{frameRate} FPS</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 120].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => updateFrameRate(fps)}
                    className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                      frameRate === fps
                        ? 'bg-zinc-800 text-white border-zinc-600'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800/50'
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* App Info */}
            <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
              <p className="font-bold text-zinc-300">Escaido AI v2.4 Pro</p>
              <p>منصة مدعومة بالذكاء الاصطناعي لتوليد المحتوى المرئي الفائق.</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-sm"
            >
              حفظ وخروج
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
