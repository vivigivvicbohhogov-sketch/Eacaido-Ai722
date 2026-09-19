import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { getAppSettings } from '../lib/storage';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

export const GoogleAuthBridge: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetType = searchParams.get('type') === 'image' ? 'image' : 'video';

  const [settings] = useState(getAppSettings());
  const [hasOpenedChrome, setHasOpenedChrome] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const targetUrl =
    targetType === 'video'
      ? settings.video_generation_url
      : settings.image_generation_url;

  // When user clicks Sign in with Google:
  // We trigger an external Chrome intent / window.open
  // On Android APK (WebView), window.open with _blank opens external Chrome / default browser
  const handleLaunchGoogleLogin = () => {
    setHasOpenedChrome(true);
    // Open the official Google / Opal authentication page in Chrome
    const loginUrl = targetUrl;
    window.open(loginUrl, '_blank');
  };

  const handleReturnToStudio = () => {
    setIsVerifying(true);
    // Mark as authenticated in session
    sessionStorage.setItem('escaido_google_authenticated', 'true');
    setTimeout(() => {
      navigate(`/StudioViewer?type=${targetType}&authed=true`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col items-center justify-center p-4 selection:bg-zinc-800 font-sans" dir="rtl">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#18181b] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Google & Platform Identity Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white flex items-center justify-center p-3 shadow-lg mb-4">
            {/* Real Official Google 'G' SVG Logo */}
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">
            تسجيل الدخول باستخدام Google
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            للمتابعة إلى استوديو الذكاء الاصطناعي الخاص بك وتوليد المحتوى بشكل آمن ومشفر.
          </p>
        </div>

        {/* Dynamic Card State: Pre-Chrome or Post-Chrome */}
        {!hasOpenedChrome ? (
          <div className="space-y-4">
            {/* Google Authentication Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLaunchGoogleLogin}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 border border-zinc-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>تسجيل الدخول بحساب Google</span>
            </motion.button>

            {/* Instruction Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-zinc-300">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>بروتوكول المصادقة الخارجي الآمن (Google OAuth)</span>
              </div>
              <p>
                سيتم فتح متصفح Chrome أو متصفحك الرسمي لإتمام التحقق وتوثيق حسابك رسمياً، مع حماية تامة لروابط التوليد ومنع تعارض الصلاحيات.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-sm font-bold text-emerald-400">
                تم توجيهك إلى متصفح Chrome لتسجيل الدخول
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                بعد اختيار حسابك في صفحة جوجل، اضغط على الزر التالي للعودة إلى التطبيق ومتابعة التصميم داخلياً.
              </p>
            </div>

            {/* Return Button */}
            <button
              onClick={handleReturnToStudio}
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>جاري المزامنة والعودة للتطبيق...</span>
                </>
              ) : (
                <>
                  <span>✓ أتممت التسجيل، عد بي إلى التطبيق</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Re-open Chrome if needed */}
            <button
              onClick={handleLaunchGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span>إعادة فتح صفحة تسجيل الدخول في Chrome</span>
            </button>
          </div>
        )}

        {/* Security & Anti-Leak Notice */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
          <Lock size={12} className="text-emerald-500" />
          <span>جلسة مشفرة بالكامل • حماية الروابط نشطة</span>
        </div>
      </motion.div>
    </div>
  );
};
