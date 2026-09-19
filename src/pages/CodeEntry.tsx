import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { Header } from '../components/Header';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { getAccessCodes, saveAccessCodes, getOrCreateDeviceId, logUsageEvent, getAppSettings } from '../lib/storage';
import { KeyRound, Clipboard, ArrowRight, ShieldCheck, HelpCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CodeEntry: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin Modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCode(text.trim());
    } catch {
      // ignore
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim()) {
      setErrorMsg('الرجاء إدخال كود الوصول');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const codes = getAccessCodes();
      const deviceId = getOrCreateDeviceId();
      const found = codes.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());

      if (!found) {
        setErrorMsg('كود الوصول غير صحيح أو غير موجود.');
        setIsLoading(false);
        return;
      }

      if (found.is_blocked || !found.is_active) {
        setErrorMsg('هذا الكود معطل أو محظور من قِبل الإدارة.');
        setIsLoading(false);
        return;
      }

      // Check device locking if already used by another device
      if (found.used_by_device && found.used_by_device !== deviceId) {
        setErrorMsg('هذا الكود مستخدم بالفعل على جهاز آخر ولا يمكن مشاركته.');
        setIsLoading(false);
        return;
      }

      // Link code if first time
      if (!found.used_by_device) {
        found.used_by_device = deviceId;
        found.first_linked_at = new Date().toISOString();
        if (email) found.user_email = email;
        saveAccessCodes(codes);
        logUsageEvent(found.code, 'code_linked', { email });
      }

      found.last_seen = new Date().toISOString();
      saveAccessCodes(codes);

      sessionStorage.setItem('escaido_current_code', found.code);
      setIsLoading(false);
      navigate('/VideoCreation');
    }, 600);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const settings = getAppSettings();
    if (adminPassword === settings.admin_portal_password || adminPassword === 'ESCAESCA2006') {
      sessionStorage.setItem('escaido_admin_auth', 'true');
      navigate('/AdminPortal');
    } else {
      setAdminError('كلمة مرور الإدارة غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-zinc-800">
      <BackgroundEffects />
      <Header onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-700 via-white to-zinc-700 opacity-80" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
              <KeyRound className="text-white animate-pulse" size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">{t('enter_code_title')}</h2>
            <p className="text-sm text-zinc-400 mt-2">أدخل الكود الفريد الخاص بك للوصول إلى أدوات الذكاء الاصطناعي</p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center"
            >
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">كود الوصول</label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('code_placeholder')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3.5 text-white font-mono tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all text-center text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                  title={t('paste_clipboard')}
                >
                  <Clipboard size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">البريد الإلكتروني (اختياري للربط)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-white text-black font-extrabold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('login_btn')}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400">
              <ShieldCheck className="text-zinc-300 shrink-0 mt-0.5" size={16} />
              <span>{t('code_linked_info')}</span>
            </div>

            <div className="text-center">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <HelpCircle size={14} />
                <span>{t('need_help')}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="text-zinc-400" size={18} />
                  <h3 className="font-bold text-lg">{t('admin_portal')}</h3>
                </div>
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="p-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {adminError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
                  {adminError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={t('admin_password_prompt')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-sm"
                >
                  {t('submit')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
