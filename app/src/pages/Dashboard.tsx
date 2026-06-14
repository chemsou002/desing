import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCourseById } from '@/data/courses';
import {
  PlayCircle,
  BookOpen,
  Award,
  Cpu,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  BarChart3,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { direction, currentLang } = useLanguage();
  const isRTL = direction === 'rtl';
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    user?.enrolledCourses[0] || ''
  );
  const [activeTab, setActiveTab] = useState<'lessons' | 'simulator'>('lessons');

  if (!user || user.enrolledCourses.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5] flex items-center justify-center" dir={direction}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-[#006D77]/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-[#006D77]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
            {isRTL ? 'لا توجد دورات مسجلة' : 'No Enrolled Courses'}
          </h2>
          <p className="text-[#1A1A1A]/50 mb-6">{t('dashboard.noCourses')}</p>
          <Link
            to="/courses"
            className="shimmer-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
          >
            <BookOpen className="w-4 h-4" />
            {t('courses.viewAll')}
          </Link>
        </div>
      </div>
    );
  }

  const selectedCourse = getCourseById(selectedCourseId) || getCourseById(user.enrolledCourses[0]);
  const progress = selectedCourse
    ? user.courseProgress[selectedCourse.id] || 0
    : 0;

  return (
    <div className="min-h-screen pt-20 pb-8 bg-[#FDFBF5]" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              {t('dashboard.welcome')}، {user.name}!
            </h1>
            <p className="text-sm text-[#1A1A1A]/50 mt-1">
              {isRTL ? 'تابع رحلتك التعليمية من حيث توقفت' : 'Continue your learning journey'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E9C46A]/20">
              <Zap className="w-5 h-5 text-[#B8860B]" />
              <span className="font-mono-tech font-bold text-[#B8860B]">
                {user.xp} XP
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006D77]/10">
              <BarChart3 className="w-5 h-5 text-[#006D77]" />
              <span className="font-mono-tech font-bold text-[#006D77]">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Layout: 3 Columns */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - My Courses */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
              <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#006D77]" />
                {t('dashboard.myCourses')}
              </h3>
              <div className="space-y-2">
                {user.enrolledCourses.map((courseId: string) => {
                  const c = getCourseById(courseId);
                  if (!c) return null;
                  const prog = user.courseProgress[courseId] || 0;
                  const isActive = selectedCourseId === courseId;
                  return (
                    <button
                      key={courseId}
                      onClick={() => setSelectedCourseId(courseId)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-start transition-colors ${
                        isActive
                          ? 'bg-[#006D77]/10 border border-[#006D77]/20'
                          : 'hover:bg-[#FDFBF5] border border-transparent'
                      }`}
                    >
                      <img
                        src={c.image}
                        alt={c.title[currentLang as 'ar' | 'en']}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-[#1A1A1A] truncate">
                          {c.title[currentLang as 'ar' | 'en']}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#006D77] rounded-full transition-all"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono-tech text-[#006D77]">
                            {prog}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center - Video & Lessons */}
          <div className="lg:col-span-6">
            {/* Video Player */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden mb-4">
              <div className="relative aspect-video bg-[#0D1B2A] flex items-center justify-center">
                <img
                  src={selectedCourse?.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 text-center">
                  <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform mx-auto mb-3">
                    <PlayCircle className="w-8 h-8 text-[#006D77]" />
                  </button>
                  <p className="text-white/80 text-sm">
                    {isRTL ? 'اضغط للبدء' : 'Click to start'}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1A1A1A]">
                  {selectedCourse?.title[currentLang as 'ar' | 'en']}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#1A1A1A]/50">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {selectedCourse?.lessons} {t('courses.lessons')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedCourse?.hours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {t('courses.detail.certificate')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
              <div className="flex border-b border-[#E5E5E5]">
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'lessons'
                      ? 'text-[#006D77] border-b-2 border-[#006D77]'
                      : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60'
                  }`}
                >
                  {t('dashboard.lessons')}
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'simulator'
                      ? 'text-[#006D77] border-b-2 border-[#006D77]'
                      : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60'
                  }`}
                >
                  {t('dashboard.simulator')}
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'lessons' ? (
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {selectedCourse?.curriculum.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF5] transition-colors cursor-pointer group"
                      >
                        {idx < Math.floor((progress / 100) * (selectedCourse?.curriculum.length || 1)) ? (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#E5E5E5] group-hover:text-[#006D77] shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#1A1A1A] truncate">
                            {lesson.title[currentLang as 'ar' | 'en']}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#1A1A1A]/40">{lesson.duration}</span>
                          </div>
                        </div>
                        <PlayCircle className="w-4 h-4 text-[#006D77] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="trunk-grid rounded-xl aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Cpu className="w-12 h-12 text-[#006D77] mx-auto mb-3" />
                      <p className="text-white/80 text-sm mb-4">
                        {isRTL ? 'محاكي PLC التفاعلي' : 'Interactive PLC Simulator'}
                      </p>
                      <div className="flex items-center gap-4 justify-center">
                        <div className="w-16 h-10 rounded bg-[#006D77]/20 border border-[#006D77] flex items-center justify-center">
                          <Zap className="w-4 h-4 text-[#00B4D8]" />
                        </div>
                        <div className="w-20 h-0.5 bg-[#006D77]/40" />
                        <div className="w-12 h-12 rounded-full bg-[#006D77]/20 border border-[#006D77] flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-white/40 text-xs mt-4">
                        {isRTL ? 'قم بتوصيل الدائرة وتشغيل المحاكاة' : 'Connect the circuit and run simulation'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Progress */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
              <h3 className="font-semibold text-sm text-[#1A1A1A] mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#006D77]" />
                {t('dashboard.progress')}
              </h3>

              {/* Circular Progress */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#E5E5E5"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#006D77"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.64} ${264 - progress * 2.64}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#1A1A1A] font-mono-tech">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF5]">
                  <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {isRTL ? 'الدروس المكتملة' : 'Completed'}
                  </div>
                  <span className="font-mono-tech font-bold text-[#1A1A1A]">
                    {Math.floor((progress / 100) * (selectedCourse?.curriculum.length || 0))}/
                    {selectedCourse?.curriculum.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF5]">
                  <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                    <Clock className="w-4 h-4 text-[#006D77]" />
                    {isRTL ? 'الوقت المستغرق' : 'Time Spent'}
                  </div>
                  <span className="font-mono-tech font-bold text-[#1A1A1A]">
                    {Math.floor((progress / 100) * (selectedCourse?.hours || 0))}h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF5]">
                  <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                    <Award className="w-4 h-4 text-[#E9C46A]" />
                    {isRTL ? 'الشهادة' : 'Certificate'}
                  </div>
                  <span className="text-xs font-medium text-[#1A1A1A]/40">
                    {progress >= 100
                      ? isRTL
                        ? 'مكتملة'
                        : 'Completed'
                      : isRTL
                      ? 'قيد التقدم'
                      : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mt-4">
              <h3 className="font-semibold text-sm text-[#1A1A1A] mb-3">
                {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>
              <Link
                to="/courses"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF5] transition-colors text-sm text-[#1A1A1A]/70"
              >
                <BookOpen className="w-4 h-4 text-[#006D77]" />
                {t('courses.viewAll')}
                <ChevronRight className="w-4 h-4 ms-auto" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
