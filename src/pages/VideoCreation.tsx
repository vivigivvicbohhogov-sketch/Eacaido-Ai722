import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { Header } from '../components/Header';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { getAccessCodes, logUsageEvent, getOrCreateDeviceId } from '../lib/storage';
import { Video, Image as ImageIcon, Share2, BookOpen, MessageSquare, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const VideoCreation: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState<string>('');

  useEffect(() => {
    const code = sessionStorage.getItem('escaido_current_code');
    if (!code) {
      navigate('/CodeEntry');
      return;
    }

    const codes = getAccessCodes();
    const found = codes.find((c) => c.code === code);
    if (!found || found.is_blocked || !found.is_active) {
      sessionStorage.removeItem('escaido_current_code');
      navigate('/CodeEntry');
      return;
    }

    setUserCode(code);

    // Heartbeat for last seen & active status
    const interval = setInterval(() => {
      const allCodes = getAccessCodes();
      const c = allCodes.find((x) => x.code === code);
      if (c) {
        c.last_seen = new Date().toISOString();
        // Check if banned meanwhile
        if (c.is_blocked) {
          sessionStorage.removeItem('escaido_current_code');
          navigate('/CodeEntry');
        }
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleOpenVideoTool = () => {
    logUsageEvent(userCode, 'create_video', { mode: 'internal_studio_veo' });
    const isAuthed = sessionStorage.getItem('escaido_google_authenticated');
    if (isAuthed === 'true') {
      navigate('/StudioViewer?type=video');
    } else {
      navigate('/GoogleAuthBridge?type=video');
    }
  };

  const handleOpenImageTool = () => {
    logUsageEvent(userCode, 'create_image', { mode: 'internal_studio_image' });
    const isAuthed = sessionStorage.getItem('escaido_google_authenticated');
    if (isAuthed === 'true') {
      navigate('/StudioViewer?type=image');
    } else {
      navigate('/GoogleAuthBridge?type=image');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Escaido AI',
        text: 'انضم إلى منصة Escaido AI لإنشاء الفيديوهات والصور بالذكاء الاصطناعي',
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('تم نسخ رابط المنصة إلى الحافظة!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-zinc-800">
      <BackgroundEffects />
      <Header showLogout={true} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 z-10 flex flex-col justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>كود الجلسة النشطة: <strong className="text-white font-mono">{userCode}</strong></span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">لوحة توليد المحتوى المرئي</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">اختر الأداة المناسبة لإنشاء فيديوهات سينمائية أو صور فائقة الدقة بالذكاء الاصطناعي.</p>
        </motion.div>

        {/* Main Action Cards (Video & Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenVideoTool}
            className="group cursor-pointer bg-zinc-900/90 border border-zinc-800 hover:border-zinc-600 rounded-3xl p-8 shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/20 rounded-full blur-2xl group-hover:bg-zinc-700/30 transition-all pointer-events-none" />
            <div>
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl text-white">
                <Video size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black mb-2">{t('create_video')}</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">توليد فيديوهات مذهلة بدقة عالية عبر نموذج Google Veo ومحركات الرؤية الاصطناعية المتقدمة.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
              <span>بدء التوليد الآن</span>
              <span>←</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenImageTool}
            className="group cursor-pointer bg-zinc-900/90 border border-zinc-800 hover:border-zinc-600 rounded-3xl p-8 shadow-2xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/20 rounded-full blur-2xl group-hover:bg-zinc-700/30 transition-all pointer-events-none" />
            <div>
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl text-white">
                <ImageIcon size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black mb-2">{t('create_image')}</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">إنشاء وتصميم صور فوتوغرافية وواقعية بدقة 4K فائقة الوضوح بلا حدود يومية.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
              <span>بدء التصميم الآن</span>
              <span>←</span>
            </div>
          </motion.div>
        </div>

        {/* Secondary Buttons Grid (2x2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <Share2 size={22} className="text-zinc-400 group-hover:text-white mb-2 transition-colors" />
            <span className="text-xs font-bold text-zinc-300">{t('app_share')}</span>
          </button>

          <button
            onClick={() => window.open('https://youtube.com', '_blank')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <BookOpen size={22} className="text-zinc-400 group-hover:text-white mb-2 transition-colors" />
            <span className="text-xs font-bold text-zinc-300">{t('course_link')}</span>
          </button>

          <button
            onClick={() => navigate('/Support')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <MessageSquare size={22} className="text-zinc-400 group-hover:text-white mb-2 transition-colors" />
            <span className="text-xs font-bold text-zinc-300">{t('support_ticket')}</span>
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('escaido_current_code');
              navigate('/CodeEntry');
            }}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group"
          >
            <ShieldAlert size={22} className="text-red-400 mb-2" />
            <span className="text-xs font-bold text-red-400">{t('logout')}</span>
          </button>
        </div>

        {/* Instructions Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md">
          <h4 className="font-black text-base mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-zinc-400" />
            <span>{t('instructions_title')}</span>
          </h4>
          <ul className="space-y-3 text-xs sm:text-sm text-zinc-400">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{t('instruction_1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{t('instruction_2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{t('instruction_3')}</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};
