import React, { useState, useEffect, useRef } from 'react';
import { mangalLessons, krutidevLessons } from '../data/hindiLessons';
import { englishLessons } from '../data/englishLessons';
import { ArrowLeft, CheckCircle, RotateCcw, ArrowRight, PlayCircle } from 'lucide-react';
import { playKeystrokeSound, playErrorSound, playSuccessSound } from '../utils/audio';

interface LessonPracticeProps {
  lessonId: number;
  courseType: 'mangal' | 'krutidev' | 'english';
  onBack: () => void;
  onNextLesson: (nextId: number) => void;
  soundEnabled: boolean;
}

export default function LessonPractice({ lessonId, courseType, onBack, onNextLesson, soundEnabled }: LessonPracticeProps) {
  const lessons = courseType === 'mangal' ? mangalLessons : courseType === 'english' ? englishLessons : krutidevLessons;
  const lesson = lessons.find(l => l.id === lessonId);
  
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<'running' | 'finished'>('running');
  const [errorCount, setErrorCount] = useState(0);
  const [isErrorFlash, setIsErrorFlash] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && status === 'running' && !showVideo) {
      inputRef.current.focus();
    }
  }, [status, showVideo]);

  if (!lesson) return <div>Lesson not found</div>;

  const targetText = lesson.content;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== 'running') return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    const val = e.target.value;
    
    // Prevent deleting correct characters
    if (val.length < userInput.length) return; 

    const addedChar = val.slice(-1);
    const expectedChar = targetText[userInput.length];
    
    const mappedExpectedKey = lesson.hintMap[expectedChar];
    
    const isCorrectChar = addedChar === expectedChar;
    const isCorrectKey = mappedExpectedKey && addedChar.toLowerCase() === mappedExpectedKey.toLowerCase();
    
    if (isCorrectChar || isCorrectKey || (expectedChar === ' ' && addedChar === ' ')) {
      setUserInput(prev => prev + expectedChar);
      if (soundEnabled) playKeystrokeSound();
      
      if (userInput.length + 1 >= targetText.length) {
        // Finished
        setStatus('finished');
        if (soundEnabled) playSuccessSound();
        const timeTaken = (Date.now() - (startTime || Date.now())) / 1000 / 60; // minutes
        const finalWpm = Math.round((targetText.length / 5) / (timeTaken || 0.1));
        setWpm(finalWpm);
      }
    } else {
      setErrorCount(prev => prev + 1);
      if (soundEnabled) playErrorSound();
      setIsErrorFlash(true);
      setTimeout(() => setIsErrorFlash(false), 200);
    }
  };

  const currentChar = targetText[userInput.length];
  const currentHint = currentChar ? lesson.hintMap[currentChar] : '';
  const themeColor = courseType === 'mangal' ? 'blue' : courseType === 'english' ? 'emerald' : 'amber';

    const renderText = () => {
    return targetText.split('').map((char, index) => {
      const isActive = index === userInput.length;
      const isTyped = index < userInput.length;
      
      let colorClass = 'text-slate-400 dark:text-slate-500';
      if (isTyped) {
        colorClass = 'text-green-500 dark:text-green-400';
      } else if (isActive) {
        if (isErrorFlash) {
          colorClass = 'text-red-600 dark:text-red-300 bg-red-500/30';
        } else {
          colorClass = themeColor === 'blue'
            ? 'text-blue-600 dark:text-blue-300 bg-blue-500/30'
            : themeColor === 'emerald'
            ? 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/30'
            : 'text-amber-600 dark:text-amber-300 bg-amber-500/30';
        }
      }
      
      let activeShadow = '';
      if (isActive) {
        if (isErrorFlash) {
          activeShadow = 'shadow-[0_2px_0_0_#ef4444]';
        } else {
          activeShadow = themeColor === 'blue' ? 'shadow-[0_2px_0_0_#3b82f6]' : themeColor === 'emerald' ? 'shadow-[0_2px_0_0_#10b981]' : 'shadow-[0_2px_0_0_#f59e0b]';
        }
      }
        
      const pulseClass = isActive ? (isErrorFlash ? 'rounded-sm' : 'animate-pulse rounded-sm') : '';

      return (
        <span 
          key={index} 
          className={`font-medium transition-colors ${colorClass} ${activeShadow} ${pulseClass}`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 mt-4 sm:mt-8 animate-fade-in flex flex-col items-center pb-20">
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Lessons
        </button>
        <div className={`px-4 py-1.5 rounded-full font-bold text-sm border 
          ${themeColor === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : themeColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
          Level {lesson.id} ({courseType === 'mangal' ? 'Mangal' : courseType === 'english' ? 'English' : 'Kruti Dev'})
        </div>
      </div>

      {status === 'running' && (
        <>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{lesson.description}</p>
          </div>

          {lesson.videoUrl && (
            <div className="mb-8 w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
              {showVideo ? (
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative">
                  <iframe 
                    src={lesson.videoUrl} 
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full absolute inset-0"
                  ></iframe>
                </div>
              ) : (
                <button 
                  onClick={() => setShowVideo(true)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95
                    ${themeColor === 'blue' ? 'bg-blue-500 shadow-blue-500/25' : themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-500/25' : 'bg-amber-500 shadow-amber-500/25'}`}
                >
                  <PlayCircle className="w-6 h-6" /> Watch Tutorial Video
                </button>
              )}
            </div>
          )}

          <div 
            className={`w-full glass-panel p-8 sm:p-12 rounded-3xl relative text-center text-3xl sm:text-4xl leading-relaxed cursor-text select-none min-h-[200px] flex items-center justify-center shadow-xl ${courseType === 'krutidev' ? 'font-krutidev tracking-wider' : ''} ${courseType === 'english' ? 'font-mono' : ''}`}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="w-full text-center whitespace-pre-wrap break-words">{renderText()}</div>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 bg-transparent text-transparent border-none outline-none cursor-default sm:cursor-text z-10 resize-none"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false"
            autoFocus={!showVideo}
          />
          
          {currentChar && (
            <div className="mt-12 glass-panel p-6 rounded-2xl border border-black/10 dark:border-white/10 flex flex-col items-center animate-fade-in-up">
              <p className="text-sm text-slate-500 mb-2 uppercase tracking-widest font-semibold">{courseType === 'english' ? 'Hint / Next Key' : 'Hint / अगला बटन'}</p>
              <div className="flex items-center gap-4 text-xl">
                <span className="font-bold text-2xl text-slate-900 dark:text-white">'{currentChar}'</span>
                <span className="text-slate-400">{courseType === 'english' ? 'Press' : 'दबाने के लिए'}</span>
                <kbd className={`px-4 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-sm font-mono font-bold text-2xl
                  ${themeColor === 'blue' ? 'text-blue-600 dark:text-blue-400' : themeColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}
                `}>
                  {currentHint === 'Space' ? 'Spacebar' : currentHint || '?'}
                </kbd>
                {courseType !== 'english' && <span className="text-slate-400">दबाएं</span>}
              </div>
            </div>
          )}
        </>
      )}

      {status === 'finished' && (
        <div className="glass-panel p-10 rounded-3xl text-center border border-green-500/30 max-w-lg w-full mt-10">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Level Complete!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Great job! You have completed Level {lesson.id}.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="text-sm text-slate-500 mb-1">Errors</div>
              <div className="text-2xl font-bold text-red-500">{errorCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div className="text-sm text-slate-500 mb-1">Speed</div>
              <div className="text-2xl font-bold text-emerald-500">{wpm} WPM</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setUserInput('');
                setErrorCount(0);
                setStartTime(null);
                setStatus('running');
                setShowVideo(false);
              }}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Retry
            </button>
            
            {lessonId < lessons.length && (
              <button 
                onClick={() => onNextLesson(lessonId + 1)}
                className={`px-6 py-3 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-lg
                  ${themeColor === 'blue' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25' : themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/25'}
                `}
              >
                Next Level <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
