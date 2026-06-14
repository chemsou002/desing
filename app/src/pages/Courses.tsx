import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { courses, type Course } from '@/data/courses';
import { BookOpen, PlayCircle, Filter } from 'lucide-react';

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentLang, direction } = useLanguage();
  const [filter, setFilter] = useState<LevelFilter>('all');

  const filtered: Course[] =
    filter === 'all' ? courses : courses.filter((c) => c.level === filter);

  const filters: { key: LevelFilter; label: string }[] = [
    { key: 'all', label: t('courses.catalog.filterAll') },
    { key: 'beginner', label: t('courses.catalog.filterBeginner') },
    { key: 'intermediate', label: t('courses.catalog.filterIntermediate') },
    { key: 'advanced', label: t('courses.catalog.filterAdvanced') },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5]" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3">
            {t('courses.catalog.title')}
          </h1>
          <p className="text-[#1A1A1A]/50">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Filter className="w-4 h-4 text-[#006D77]" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[#006D77] text-white'
                  : 'bg-white text-[#1A1A1A]/60 border border-[#E5E5E5] hover:border-[#006D77]/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#1A1A1A]/40">
            {direction === 'rtl' ? 'لا توجد دورات بهذا المستوى' : 'No courses at this level'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] hover:shadow-xl hover:border-[#006D77]/20 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title[currentLang as 'ar' | 'en']}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.level === 'beginner'
                          ? 'bg-[#006D77] text-white'
                          : course.level === 'intermediate'
                          ? 'bg-[#E9C46A] text-[#1A1A1A]'
                          : 'bg-[#0D1B2A] text-white'
                      }`}
                    >
                      {t(`courses.levels.${course.level}`)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#1A1A1A] mb-2 group-hover:text-[#006D77] transition-colors">
                    {course.title[currentLang as 'ar' | 'en']}
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/50 leading-relaxed mb-4 line-clamp-2">
                    {course.description[currentLang as 'ar' | 'en']}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#1A1A1A]/40">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.lessons}
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5" />
                        {course.hours}h
                      </span>
                    </div>
                    <span className="font-mono-tech font-bold text-[#006D77]">
                      ${course.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
