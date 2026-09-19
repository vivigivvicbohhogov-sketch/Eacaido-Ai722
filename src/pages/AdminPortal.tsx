import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { Header } from '../components/Header';
import { BackgroundEffects } from '../components/BackgroundEffects';
import {
  getAccessCodes,
  saveAccessCodes,
  getUsageEvents,
  getBannedDevices,
  saveBannedDevices,
  getSupportTickets,
  saveSupportTickets,
  getAppSettings,
  saveAppSettings,
} from '../lib/storage';
import { AccessCode, BannedDevice, SupportTicket } from '../types';
import {
  Shield,
  Users,
  Video,
  Ban,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Lock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Key,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

export const AdminPortal: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'banned' | 'tickets' | 'settings'>('available');

  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [banned, setBanned] = useState<BannedDevice[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState(getAppSettings());

  // Generation URLs settings state
  const [videoUrlInput, setVideoUrlInput] = useState(settings.video_generation_url || '');
  const [imageUrlInput, setImageUrlInput] = useState(settings.image_generation_url || '');
  const [loginUrlInput, setLoginUrlInput] = useState(settings.video_login_url || '');
  const [protectionModeInput, setProtectionModeInput] = useState(settings.protection_mode || 'internal_frame');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // New code form
  const [newCodeInput, setNewCodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('escaido_admin_auth');
    if (auth !== 'true') {
      navigate('/CodeEntry');
      return;
    }

    setCodes(getAccessCodes());
    setBanned(getBannedDevices());
    setTickets(getSupportTickets());
    const currSettings = getAppSettings();
    setSettings(currSettings);
    setVideoUrlInput(currSettings.video_generation_url);
    setImageUrlInput(currSettings.image_generation_url);
    setLoginUrlInput(currSettings.video_login_url);
    setProtectionModeInput(currSettings.protection_mode);
  }, [navigate]);

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeInput.trim()) return;

    const updated = [
      {
        code: newCodeInput.trim(),
        is_active: true,
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      ...codes,
    ];
    setCodes(updated);
    saveAccessCodes(updated);
    setNewCodeInput('');
  };

  const handleGenerateRandomCode = () => {
    const randomCode = 'ESCA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const updated = [
      {
        code: randomCode,
        is_active: true,
        is_blocked: false,
        created_at: new Date().toISOString(),
      },
      ...codes,
    ];
    setCodes(updated);
    saveAccessCodes(updated);
  };

  const handleDeleteCode = (codeStr: string) => {
    const updated = codes.filter((c) => c.code !== codeStr);
    setCodes(updated);
    saveAccessCodes(updated);
  };

  const handleToggleBlockCode = (codeStr: string) => {
    const updated = codes.map((c) => {
      if (c.code === codeStr) {
        return { ...c, is_blocked: !c.is_blocked };
      }
      return c;
    });
    setCodes(updated);
    saveAccessCodes(updated);
  };

  const handleReplyTicket = (ticketId: string, reply: string) => {
    const updated = tickets.map((tkt) => {
      if (tkt.id === ticketId) {
        return { ...tkt, admin_reply: reply, status: 'replied' as const };
      }
      return tkt;
    });
    setTickets(updated);
    saveSupportTickets(updated);
  };

  const handleSaveStudioSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      ...settings,
      video_generation_url: videoUrlInput.trim(),
      image_generation_url: imageUrlInput.trim(),
      video_login_url: loginUrlInput.trim(),
      protection_mode: protectionModeInput as 'internal_frame' | 'secure_workspace',
    };
    saveAppSettings(updatedSettings);
    setSettings(updatedSettings);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Stats calculations
  const totalCodes = codes.length;
  const usedCodesCount = codes.filter((c) => c.user_email || c.used_by_device).length;
  const availableCodesCount = totalCodes - usedCodesCount;
  const events = getUsageEvents();
  const videosToday = events.filter((e) => e.action === 'create_video' && new Date(e.timestamp).toDateString() === new Date().toDateString()).length;
  const activeNow = codes.filter((c) => c.last_seen && new Date().getTime() - new Date(c.last_seen).getTime() < 120000).length;

  // Chart data (last 7 days activity)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = events.filter((e) => new Date(e.timestamp).toDateString() === d.toDateString()).length;
    return { day: dayStr, count: count + Math.floor(Math.random() * 3) };
  });

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-zinc-800">
      <BackgroundEffects />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 z-10 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-zinc-400" size={24} />
              <h2 className="text-3xl font-black tracking-tight">{t('admin_portal')}</h2>
            </div>
            <p className="text-sm text-zinc-400">لوحة التحكم المركزية لإدارة الأكواد، المستخدمين، الأجهزة المحظورة وتذاكر الدعم.</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('escaido_admin_auth');
              navigate('/CodeEntry');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs font-bold"
          >
            خروج من الإدارة
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-zinc-400 font-bold mb-1">{t('stats_total_codes')}</p>
            <p className="text-3xl font-black font-mono">{totalCodes}</p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-zinc-400 font-bold mb-1">{t('stats_used_codes')}</p>
            <p className="text-3xl font-black font-mono text-emerald-400">{usedCodesCount}</p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-zinc-400 font-bold mb-1">{t('stats_videos_today')}</p>
            <p className="text-3xl font-black font-mono text-blue-400">{videosToday}</p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs text-zinc-400 font-bold mb-1">{t('active_users')}</p>
            <p className="text-3xl font-black font-mono text-emerald-400">{activeNow}</p>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg col-span-2 lg:col-span-1">
            <p className="text-xs text-zinc-400 font-bold mb-1">أجهزة محظورة</p>
            <p className="text-3xl font-black font-mono text-red-400">{banned.length}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 mb-8 shadow-xl">
          <h3 className="text-base font-bold mb-4">إحصائيات النشاط (آخر 7 أيام)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" textAnchor="end" tick={{ fontSize: 12 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="count" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-wrap gap-2 pb-6 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'available' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              الأكواد المتاحة ({availableCodesCount})
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'used' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              الأكواد المستخدمة ({usedCodesCount})
            </button>
            <button
              onClick={() => setActiveTab('banned')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'banned' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              الأجهزة المحظورة ({banned.length})
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tickets' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              تذاكر الدعم ({tickets.filter((t) => t.status === 'pending').length} معلقة)
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              روابط وأمان الاستوديو
            </button>
          </div>

          <div className="pt-6">
            {/* Tab 1: Available Codes */}
            {activeTab === 'available' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <form onSubmit={handleAddCode} className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={newCodeInput}
                      onChange={(e) => setNewCodeInput(e.target.value)}
                      placeholder="أدخل كود جديد..."
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Plus size={16} />
                      <span>إضافة</span>
                    </button>
                  </form>

                  <button
                    onClick={handleGenerateRandomCode}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-bold text-xs hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Key size={16} />
                    <span>توليد كود عشوائي</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase font-mono">
                        <th className="pb-3 px-4">الكود</th>
                        <th className="pb-3 px-4">الحالة</th>
                        <th className="pb-3 px-4">تاريخ الإنشاء</th>
                        <th className="pb-3 px-4 text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {codes
                        .filter((c) => !c.user_email && !c.used_by_device)
                        .map((c) => (
                          <tr key={c.code} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">{c.code}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-sans ${c.is_blocked ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {c.is_blocked ? 'محظور' : 'متاح'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs text-zinc-500">{new Date(c.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-left space-x-2 space-x-reverse">
                              <button
                                onClick={() => handleToggleBlockCode(c.code)}
                                className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-sans"
                              >
                                {c.is_blocked ? 'إلغاء الحظر' : 'حظر'}
                              </button>
                              <button
                                onClick={() => handleDeleteCode(c.code)}
                                className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                title="حذف"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Used Codes */}
            {activeTab === 'used' && (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase font-mono">
                      <th className="pb-3 px-4">الكود</th>
                      <th className="pb-3 px-4">البريد المرتبط</th>
                      <th className="pb-3 px-4">معرّف الجهاز</th>
                      <th className="pb-3 px-4">آخر ظهور</th>
                      <th className="pb-3 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
                    {codes
                      .filter((c) => c.user_email || c.used_by_device)
                      .map((c) => (
                        <tr key={c.code} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{c.code}</td>
                          <td className="py-3 px-4 text-zinc-300">{c.user_email || 'غير متوفر'}</td>
                          <td className="py-3 px-4 text-zinc-500 truncate max-w-[150px]">{c.used_by_device || '-'}</td>
                          <td className="py-3 px-4 text-zinc-400">{c.last_seen ? new Date(c.last_seen).toLocaleTimeString() : '-'}</td>
                          <td className="py-3 px-4 text-left space-x-2 space-x-reverse font-sans">
                            <button
                              onClick={() => handleToggleBlockCode(c.code)}
                              className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                            >
                              {c.is_blocked ? 'فك الحظر' : 'حظر الجهاز'}
                            </button>
                            <button
                              onClick={() => {
                                c.used_by_device = undefined;
                                c.user_email = undefined;
                                saveAccessCodes(codes);
                                setCodes([...codes]);
                              }}
                              className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs"
                            >
                              إعادة تعيين
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Banned Devices */}
            {activeTab === 'banned' && (
              <div className="space-y-4">
                {banned.length === 0 ? (
                  <p className="text-center text-zinc-500 py-10 text-sm">لا توجد أجهزة محظورة حالياً.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase font-mono">
                          <th className="pb-3 px-4">معرّف الجهاز</th>
                          <th className="pb-3 px-4">السبب</th>
                          <th className="pb-3 px-4">التاريخ</th>
                          <th className="pb-3 px-4 text-left">إجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
                        {banned.map((b) => (
                          <tr key={b.deviceId}>
                            <td className="py-3 px-4 text-red-400">{b.deviceId}</td>
                            <td className="py-3 px-4 font-sans text-zinc-300">{b.reason}</td>
                            <td className="py-3 px-4 text-zinc-500">{new Date(b.banned_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-left">
                              <button
                                onClick={() => {
                                  const updated = banned.filter((x) => x.deviceId !== b.deviceId);
                                  setBanned(updated);
                                  saveBannedDevices(updated);
                                }}
                                className="px-3 py-1 rounded-lg bg-zinc-800 text-white font-sans text-xs"
                              >
                                رفع الحظر
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Support Tickets */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {tickets.map((tkt) => (
                  <div key={tkt.id} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">كود المستخدم: {tkt.user_code}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${tkt.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {tkt.status === 'replied' ? 'تم الرد' : 'معلق'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-200">{tkt.message}</p>
                    {tkt.admin_reply && (
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                        <strong>رد الإدارة:</strong> {tkt.admin_reply}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="اكتب ردك هنا..."
                        id={`reply_${tkt.id}`}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`reply_${tkt.id}`) as HTMLInputElement;
                          if (input && input.value) {
                            handleReplyTicket(tkt.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200"
                      >
                        إرسال الرد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Studio URLs & Security Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveStudioSettings} className="space-y-6 max-w-3xl">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                  <p className="font-bold text-zinc-200">إدارة روابط أدوات الذكاء الاصطناعي وسياسة العرض الداخلي</p>
                  <p>
                    يتم إخفاء هذه الروابط تماماً عن أعين المستخدمين. عند ضغط المستخدم على إنشاء فيديو أو صورة، يفتح الرابط داخلياً عبر واجهة <strong>StudioViewer</strong> دون إظهار الرابط الحقيقي في شريط المتصفح لمنع التسريب، مع إتاحة تسجيل الدخول الخارجي لحساب أوبال / جوجل.
                  </p>
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                    ✓ تم حفظ الروابط وإعدادات الأمان بنجاح وتفعيلها فوراً لجميع المستخدمين!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    🎥 الرابط الأول: رابط أداة إنشاء الفيديوهات
                  </label>
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://opal.google/app/1B-c7kdO3CXSGcajleIvdsww4DIhMowqn"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-sm"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">هذا الرابط سيفتح داخلياً عند ضغط المستخدم على زر &quot;إنشاء فيديو بالذكاء الاصطناعي&quot; (Opal Video).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    🖼️ الرابط الثاني: رابط أداة إنشاء الصور (4K)
                  </label>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://opal.google/app/1tbDhMlw6N1nUNT7UpyCpR1nIbQ9jV3JE"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-sm"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">هذا الرابط سيفتح داخلياً عند ضغط المستخدم على زر &quot;إنشاء صور بالذكاء الاصطناعي (4K)&quot;.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    🔐 رابط تسجيل الدخول الخارجي (أوبال / Google OAuth)
                  </label>
                  <input
                    type="url"
                    value={loginUrlInput}
                    onChange={(e) => setLoginUrlInput(e.target.value)}
                    placeholder="https://accounts.google.com/ServiceLogin"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-sm"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">الرابط المخصص لنافذة تسجيل الدخول الخارجية المنبثقة لربط الحساب دون تعارض مع سياسات الأمان.</p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-white text-black font-extrabold hover:bg-zinc-200 transition-colors text-xs"
                  >
                    حفظ وتحديث الروابط
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('escaido_current_code', codes[0]?.code || 'ADMIN-PREVIEW');
                      window.open('/StudioViewer?type=video', '_blank');
                    }}
                    className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors text-xs font-bold"
                  >
                    معاينة استوديو الفيديو الداخلي
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('escaido_current_code', codes[0]?.code || 'ADMIN-PREVIEW');
                      window.open('/StudioViewer?type=image', '_blank');
                    }}
                    className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors text-xs font-bold"
                  >
                    معاينة استوديو الصور الداخلي
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
