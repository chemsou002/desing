import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MessageSquare, User, Send, Phone, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5]" dir={direction}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3">
            {t('contact.title')}
          </h1>
          <p className="text-[#1A1A1A]/50">{t('contact.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">
                    {t('contact.success')}
                  </h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                      {t('contact.name')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                      {t('contact.email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                      {t('contact.message')}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#1A1A1A]/30" />
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="shimmer-btn w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {t('contact.send')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">{t('contact.info')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#006D77]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#006D77]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </div>
                    <div className="text-sm text-[#1A1A1A]/50">support@electrohub.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#006D77]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#006D77]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {isRTL ? 'الهاتف' : 'Phone'}
                    </div>
                    <div className="text-sm text-[#1A1A1A]/50">+966 50 000 0000</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#006D77]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#006D77]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {isRTL ? 'ساعات العمل' : 'Working Hours'}
                    </div>
                    <div className="text-sm text-[#1A1A1A]/50">
                      {isRTL ? 'الأحد - الخميس: 9ص - 5م' : 'Sun - Thu: 9AM - 5PM'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
