import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCourseById } from '@/data/courses';
import {
  BookOpen,
  PlayCircle,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Lock,
  CreditCard,
} from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentLang, direction } = useLanguage();
  const { isAuthenticated, user, enrollInCourse } = useAuth();
  const navigate = useNavigate();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const course = getCourseById(id || '');
  const isEnrolled = user?.enrolledCourses.includes(id || '');
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FDFBF5]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
            {direction === 'rtl' ? 'الدورة غير موجودة' : 'Course Not Found'}
          </h2>
          <Link to="/courses" className="text-[#006D77] hover:underline">
            {direction === 'rtl' ? 'العودة للدورات' : 'Back to Courses'}
          </Link>
        </div>
      </div>
    );
  }

  const detectCardType = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    return null;
  };

  const handleCardChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    setCardType(detectCardType(clean));
  };

  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 2) {
      setExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setExpiry(clean);
    }
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      errs.card = t('payment.errors.cardInvalid');
    }
    if (!cardHolder.trim()) errs.holder = t('payment.errors.holderRequired');
    if (!expiry || expiry.length < 5) errs.expiry = t('payment.errors.expiryRequired');
    if (!cvv || cvv.length < 3) errs.cvv = t('payment.errors.cvvRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    if (!validatePayment()) return;
    setTimeout(() => {
      enrollInCourse(course.id);
      setPaymentSuccess(true);
      setShowPayment(false);
    }, 1500);
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/courses/${course.id}&buy=true`);
      return;
    }
    setShowPayment(true);
  };

  const includedItems = [
    `${course.lessons} ${t('courses.detail.lessonsCount')}`,
    `${course.hours} ${t('courses.hours')} ${direction === 'rtl' ? 'فيديو' : 'video'}`,
    t('courses.detail.certificate'),
    t('courses.detail.access'),
    direction === 'rtl' ? 'محاكاة تفاعلية' : 'Interactive simulation',
    direction === 'rtl' ? 'دعم فني' : 'Technical support',
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5]" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-1 text-sm text-[#006D77] mb-6 hover:underline"
        >
          <ArrowIcon className="w-4 h-4" />
          {t('courses.viewAll')}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0D1B2A] aspect-video mb-8">
              <img
                src={course.image}
                alt={course.title[currentLang as 'ar' | 'en']}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <PlayCircle className="w-8 h-8 text-[#006D77]" />
                </div>
              </div>
            </div>

            {/* Title & Meta */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.level === 'beginner'
                      ? 'bg-[#006D77]/10 text-[#006D77]'
                      : course.level === 'intermediate'
                      ? 'bg-[#E9C46A]/20 text-[#B8860B]'
                      : 'bg-[#0D1B2A]/10 text-[#0D1B2A]'
                  }`}
                >
                  {t(`courses.levels.${course.level}`)}
                </span>
                <span className="flex items-center gap-1 text-sm text-[#1A1A1A]/50">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons} {t('courses.lessons')}
                </span>
                <span className="flex items-center gap-1 text-sm text-[#1A1A1A]/50">
                  <Clock className="w-4 h-4" />
                  {course.hours} {t('courses.hours')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
                {course.title[currentLang as 'ar' | 'en']}
              </h1>
              <p className="text-[#1A1A1A]/60 leading-relaxed">
                {course.fullDesc[currentLang as 'ar' | 'en']}
              </p>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#E5E5E5] mb-8">
              <img
                src="/instructor.jpg"
                alt={course.instructor}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-sm text-[#1A1A1A]">{course.instructor}</div>
                <div className="text-xs text-[#1A1A1A]/50">
                  {direction === 'rtl' ? 'مدرب معتمد' : 'Certified Instructor'}
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
                {t('courses.detail.curriculum')}
              </h2>
              <div className="space-y-2">
                {course.curriculum.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedLesson(
                          expandedLesson === lesson.id ? null : lesson.id
                        )
                      }
                      className="w-full flex items-center gap-3 p-4 text-start hover:bg-[#FDFBF5] transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[#006D77]/10 text-[#006D77] flex items-center justify-center text-xs font-mono-tech font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[#1A1A1A] truncate">
                          {lesson.title[currentLang as 'ar' | 'en']}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#1A1A1A]/40">{lesson.duration}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              lesson.type === 'video'
                                ? 'bg-blue-50 text-blue-600'
                                : lesson.type === 'quiz'
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-green-50 text-green-600'
                            }`}
                          >
                            {lesson.type === 'video'
                              ? direction === 'rtl'
                                ? 'فيديو'
                                : 'Video'
                              : lesson.type === 'quiz'
                              ? direction === 'rtl'
                                ? 'اختبار'
                                : 'Quiz'
                              : direction === 'rtl'
                              ? 'محاكاة'
                              : 'Sim'}
                          </span>
                        </div>
                      </div>
                      {isEnrolled ? (
                        <PlayCircle className="w-5 h-5 text-[#006D77] shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-[#1A1A1A]/30 shrink-0" />
                      )}
                      {expandedLesson === lesson.id ? (
                        <ChevronUp className="w-4 h-4 text-[#1A1A1A]/30 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#1A1A1A]/30 shrink-0" />
                      )}
                    </button>
                    {expandedLesson === lesson.id && (
                      <div className="px-4 pb-4 pl-15">
                        <p className="text-sm text-[#1A1A1A]/50 pl-[44px]">
                          {direction === 'rtl'
                            ? `هذا الدرس يغطي ${lesson.title.ar} بشكل مفصل مع أمثلة عملية.`
                            : `This lesson covers ${lesson.title.en} in detail with practical examples.`}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                {!isEnrolled && !paymentSuccess ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-[#1A1A1A] font-mono-tech">
                        ${course.price}
                      </span>
                      <span className="text-sm text-[#1A1A1A]/40 line-through">
                        ${Math.floor(course.price * 1.4)}
                      </span>
                    </div>

                    {!showPayment ? (
                      <button
                        onClick={handleBuyClick}
                        className="shimmer-btn w-full py-3 rounded-xl text-white font-semibold mb-3"
                      >
                        {t('courses.detail.buyNow')}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-[#1A1A1A]/50 mb-1 block">
                            {t('payment.cardNumber')}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => handleCardChange(e.target.value)}
                              placeholder="0000 0000 0000 0000"
                              className="ai-input w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                            />
                            {cardType && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <CreditCard className="w-5 h-5 text-[#006D77]" />
                              </div>
                            )}
                          </div>
                          {errors.card && (
                            <p className="text-xs text-red-500 mt-1">{errors.card}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-[#1A1A1A]/50 mb-1 block">
                            {t('payment.cardHolder')}
                          </label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="ai-input w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                          />
                          {errors.holder && (
                            <p className="text-xs text-red-500 mt-1">{errors.holder}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-[#1A1A1A]/50 mb-1 block">
                              {t('payment.expiry')}
                            </label>
                            <input
                              type="text"
                              value={expiry}
                              onChange={(e) => handleExpiryChange(e.target.value)}
                              placeholder="MM/YY"
                              className="ai-input w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                            />
                            {errors.expiry && (
                              <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-[#1A1A1A]/50 mb-1 block">
                              {t('payment.cvv')}
                            </label>
                            <input
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="123"
                              className="ai-input w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                            />
                            {errors.cvv && (
                              <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={handlePay}
                          className="shimmer-btn w-full py-3 rounded-xl text-white font-semibold"
                        >
                          {t('payment.payNow')} — ${course.price}
                        </button>
                        <p className="text-xs text-center text-[#1A1A1A]/30 flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3" />
                          {t('payment.secure')}
                        </p>
                        <button
                          onClick={() => setShowPayment(false)}
                          className="w-full text-center text-sm text-[#1A1A1A]/40 hover:text-[#1A1A1A] py-1"
                        >
                          {direction === 'rtl' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1">
                      {direction === 'rtl' ? 'تم الشراء بنجاح!' : 'Purchase Successful!'}
                    </h3>
                    <p className="text-sm text-[#1A1A1A]/50 mb-4">
                      {direction === 'rtl'
                        ? 'يمكنك الآن الوصول لجميع محتويات الدورة'
                        : 'You can now access all course content'}
                    </p>
                    <Link
                      to="/dashboard"
                      className="shimmer-btn inline-block w-full py-3 rounded-xl text-white font-semibold"
                    >
                      {direction === 'rtl' ? 'الذهاب للوحة التحكم' : 'Go to Dashboard'}
                    </Link>
                  </div>
                )}
              </div>

              {/* Included Items */}
              {!isEnrolled && !paymentSuccess && (
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                  <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4">
                    {t('courses.detail.included')}
                  </h3>
                  <ul className="space-y-3">
                    {includedItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-[#1A1A1A]/60">
                        <Check className="w-4 h-4 text-[#006D77] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
