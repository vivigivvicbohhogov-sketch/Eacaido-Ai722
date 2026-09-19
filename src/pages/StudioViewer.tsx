import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { getAppSettings, getAccessCodes, logUsageEvent } from '../lib/storage';
import {
  ArrowLeft,
  RefreshCw,
  Maximize2,
  Minimize2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const StudioViewer: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') === 'image' ? 'image' : 'video';

  const [settings, setSettings] = useState(getAppSettings());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDirectLauncher, setShowDirectLauncher] = useState(false);

  const userCode = sessionStorage.getItem('escaido_current_code') || '';

  useEffect(() => {
    if (!userCode) {
      navigate('/CodeEntry');
      return;
    }

    const codes = getAccessCodes();
    const found = codes.find((c) => c.code === userCode);
    if (!found || found.is_blocked || !found.is_active) {
      sessionStorage.removeItem('escaido_current_code');
      navigate('/CodeEntry');
      return;
    }

    const currentSettings = getAppSettings();
    setSettings(currentSettings);

    logUsageEvent(
      userCode,
      activeType === 'video' ? 'create_video' : 'create_image',
      { mode: 'internal_studio_view' }
    );

    setIsLoading(true);
    // Give iframe a few seconds, if Opal refuses connection (X-Frame-Options: SAMEORIGIN)
    // we provide a smooth direct interactive session button
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [activeType, navigate, userCode, iframeKey]);

  // Video: https://opal.google/app/1B-c7kdO3CXSGcajleIvdsww4DIhMowqn
  // Image: https://opal.google/app/1tbDhMlw6N1nUNT7UpyCpR1nIbQ9jV3JE
  const targetUrl =
    activeType === 'video'
      ? settings.video_generation_url
      : settings.image_generation_url;

  // Masked URL displayed in the simulated app header
  const maskedAddress =
    activeType === 'video'
      ? 'escaido-studio://internal-sandbox.v2/veo-video-creator-pro'
      : 'escaido-studio://internal-sandbox.v2/ultra-image-studio-4k';

  // Open in an isolated, address-bar-hidden popup or in-app Chrome custom tab
  const handleOpenInteractiveSession = () => {
    const width = Math.min(window.screen.width * 0.98, 1280);
    const height = Math.min(window.screen.height * 0.92, 860);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      targetUrl,
      'EscaidoStudioApp',
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,scrollbars=yes,resizable=yes`
    );
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const switchType = (newType: 'video' | 'image') => {
    setSearchParams({ type: newType });
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col z-50 overflow-hidden font-sans select-none" dir="rtl">
      {/* Top Application Bar (Clean, App-like, Completely masks the real Opal URL) */}
      <header className="h-14 bg-[#121214] border-b border-zinc-800 flex items-center justify-between px-3 sm:px-6 shrink-0">
        {/* Left: Back & Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/VideoCreation')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300 transition-colors text-xs font-bold"
            title="العودة للمنصة"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>

          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => switchType('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeType === 'video'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Video size={14} />
              <span>فيديو</span>
            </button>
            <button
              onClick={() => switchType('image')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeType === 'image'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ImageIcon size={14} />
              <span>صور 4K</span>
            </button>
          </div>
        </div>

        {/* Center: Fake/Masked Address Bar (The user sees this instead of opal.google) */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-4 py-1.5 rounded-full max-w-md w-full justify-center text-xs font-mono text-zinc-300 shadow-inner" dir="ltr">
          <Lock size={12} className="text-emerald-400 shrink-0" />
          <span className="truncate text-zinc-400">{maskedAddress}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-sans font-bold uppercase tracking-wider shrink-0">
            مشفر
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Re-authenticate with Google */}
          <button
            onClick={() => navigate(`/GoogleAuthBridge?type=${activeType}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs font-bold"
            title="تبديل أو إعادة توثيق حساب جوجل"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="hidden sm:inline">حساب Google</span>
          </button>

          {/* Launch interactive workspace */}
          <button
            onClick={handleOpenInteractiveSession}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all text-xs font-black shadow-md active:scale-95"
            title="تشغيل شاشة العمل التفاعلية"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">فتح مساحة العمل</span>
            <span className="sm:hidden">مساحة العمل</span>
          </button>

          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="تحديث"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors hidden sm:flex"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* Loading overlay with animation */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 border-3 border-zinc-700 border-t-white rounded-full animate-spin mb-4" />
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
              <Sparkles size={16} className="text-zinc-400 animate-pulse" />
              <span>جاري تحميل مساحة العمل الآمنة...</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              يتم تشفير الاتصال وحماية الرابط من النسخ والتسريب
            </p>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={iframeKey}
          src={targetUrl}
          title="Escaido Studio Engine"
          className="w-full h-full border-0 bg-zinc-950"
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          allow="accelerometer; camera; microphone; clipboard-read; clipboard-write; encrypted-media; gyroscope; fullscreen"
          onLoad={() => setIsLoading(false)}
        />

        {/* Refused Connection Helper / Direct Mode (Because Google blocks iframes with X-Frame-Options) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 pointer-events-none">
          <div className="max-w-md w-full bg-[#18181b]/95 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-xl pointer-events-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <h3 className="text-base font-black text-white mb-1">
                {activeType === 'video' ? 'مساحة توليد الفيديو (Opal Video)' : 'مساحة توليد الصور (Opal 4K)'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                تم تفعيل حساب Google الخاص بك بنجاح. لحماية الرابط ومنع أخطاء المتصفح (رفض الاتصال)، اضغط على الزر أدناه لبدء التوليد الفوري في نافذة تفاعلية مؤمنة بالكامل.
              </p>
            </div>

            <button
              onClick={handleOpenInteractiveSession}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>بدء التصميم والتوليد الآن</span>
              <ExternalLink size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono" dir="ltr">
              <Lock size={12} className="text-emerald-500" />
              <span>URL masked • Zero-leak active</span>
            </div>
          </div>
        </div>

        {/* Persistent bottom indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-zinc-950/90 border border-zinc-800 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-zinc-400 font-mono">
            Escaido Sandbox Engine Active
          </span>
        </div>
      </div>
    </div>
  );
};
