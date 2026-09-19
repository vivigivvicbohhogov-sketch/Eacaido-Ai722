import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { Header } from '../components/Header';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { getSupportTickets, saveSupportTickets } from '../lib/storage';
import { SupportTicket } from '../types';
import { MessageSquare, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Support: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const userCode = sessionStorage.getItem('escaido_current_code') || 'GUEST';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageFiles((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tickets = getSupportTickets();
    const newTicket: SupportTicket = {
      id: 'tkt_' + Math.random().toString(36).substring(2, 9),
      user_code: userCode,
      message,
      image_urls: imageFiles,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    tickets.unshift(newTicket);
    saveSupportTickets(tickets);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-zinc-800">
      <BackgroundEffects />
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 z-10 flex flex-col justify-center py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>العودة للخلف</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
            <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center text-white">
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">{t('support_ticket')}</h2>
              <p className="text-xs text-zinc-400">فريق الدعم الفني جاهز لمساعدتك على مدار الساعة.</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold">تم إرسال تذكرتك بنجاح</h3>
              <p className="text-sm text-zinc-400">سنقوم بالرد عليك في أقرب وقت ممكن عبر سجل التذاكر.</p>
              <button
                onClick={() => navigate('/VideoCreation')}
                className="mt-4 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-sm"
              >
                العودة للرئيسية
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">رصيد الكود الخاص بك</label>
                <input
                  type="text"
                  value={userCode}
                  disabled
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-zinc-400 font-mono text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">تفاصيل المشكلة أو الاستفسار</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اشرح مشكلتك بالتفصيل..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">إرفاق لقطة شاشة (اختياري)</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-xs font-bold cursor-pointer hover:bg-zinc-700 transition-colors">
                    <Upload size={16} />
                    <span>اختر صورة</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-zinc-400">{imageFiles.length} صورة مرفقة</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-white text-black font-extrabold hover:bg-zinc-200 transition-all shadow-lg text-sm"
              >
                إرسال التذكرة
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
};
