import React from 'react';
import { Play, CheckCircle, Lock, Monitor, Type, Globe } from 'lucide-react';
import { mangalLessons, krutidevLessons, Lesson } from '../data/hindiLessons';
import { englishLessons } from '../data/englishLessons';

interface LessonListProps {
  courseType: 'mangal' | 'krutidev' | 'english';
  onCourseTypeChange: (type: 'mangal' | 'krutidev' | 'english') => void;
  onSelectLesson: (lessonId: number) => void;
}

export default function LessonList({ courseType, onCourseTypeChange, onSelectLesson }: LessonListProps) {
  const lessons = courseType === 'mangal' ? mangalLessons : courseType === 'english' ? englishLessons : krutidevLessons;
  const courseTitle = courseType === 'mangal' ? "Mangal (Inscript) Course" : courseType === 'english' ? "English Typing Course" : "Kruti Dev Course";
  const themeColor = courseType === 'mangal' ? 'blue' : courseType === 'english' ? 'emerald' : 'amber';

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 mt-4 sm:mt-8 animate-fade-in pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400 pb-2">
          Typing Courses
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-3">
          Step-by-step levels to master typing in Hindi and English.
        </p>

        {/* Course Toggle */}
        <div className="flex flex-wrap items-center justify-center mt-8 gap-2">
          <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl flex flex-wrap gap-1 border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => onCourseTypeChange('english')}
              className={`px-4 sm:px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                courseType === 'english'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Globe className="w-5 h-5" /> English
            </button>
            <button
              onClick={() => onCourseTypeChange('mangal')}
              className={`px-4 sm:px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                courseType === 'mangal'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Type className="w-5 h-5" /> Mangal (Hindi)
            </button>
            <button
              onClick={() => onCourseTypeChange('krutidev')}
              className={`px-4 sm:px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                courseType === 'krutidev'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Monitor className="w-5 h-5" /> Kruti Dev (Hindi)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => {
          const isUnlocked = true; // Later we can add local storage logic to lock/unlock
          return (
            <div 
              key={lesson.id}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 relative group
                ${isUnlocked 
                  ? themeColor === 'blue'
                    ? 'border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer'
                    : themeColor === 'emerald'
                    ? 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] cursor-pointer'
                    : 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer'
                  : 'border-slate-500/10 opacity-75 cursor-not-allowed'}
              `}
              onClick={() => isUnlocked && onSelectLesson(lesson.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                  ${isUnlocked 
                    ? themeColor === 'blue' ? 'bg-blue-500 text-white' : themeColor === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  {lesson.id}
                </div>
                {isUnlocked ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                    ${themeColor === 'blue' ? 'bg-green-500/10 text-green-500' : themeColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}
                  `}>
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-500/10 text-slate-500 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{lesson.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {lesson.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                <p className={`text-xs font-semibold uppercase tracking-wider
                  ${themeColor === 'blue' ? 'text-blue-600 dark:text-blue-400' : themeColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
                `}>
                  Keys: {lesson.keysFocused}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
