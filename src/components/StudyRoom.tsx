import { useState, useEffect } from 'react';
import { Course, Lesson, Question, StudentProgress } from '../types';
import { ChevronLeft, Check, AlertCircle, HelpCircle, ArrowRight, ArrowLeft, Trophy, AlertTriangle, Book, Bookmark, Youtube, Video, Edit2, CheckCircle2 } from 'lucide-react';

interface StudyRoomProps {
  course: Course;
  progress: StudentProgress;
  onUpdateAnswers: (lessonId: string, questionId: string, value: string[]) => void;
  onSaveScore: (lessonId: string, score: number, total: number) => void;
  onBackToCatalog: () => void;
  initialLessonId?: string;
  onUpdateVideo?: (lessonId: string, videoUrl: string) => void;
  currentUserRole?: 'admin' | 'student';
}

export default function StudyRoom({ course, progress, onUpdateAnswers, onSaveScore, onBackToCatalog, initialLessonId, onUpdateVideo, currentUserRole }: StudyRoomProps) {
  const [activeLessonId, setActiveLessonId] = useState<string>(initialLessonId || course.lessons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'content' | 'repaso'>('content');
  const [selectedVerse, setSelectedVerse] = useState<{ reference: string; text: string } | null>(null);
  
  // Scoring state
  const [graded, setGraded] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(0);
  const [localAnswers, setLocalAnswers] = useState<{ [qId: string]: string[] }>({});

  // Dynamic YouTube editing state
  const [inputVideoUrl, setInputVideoUrl] = useState<string>('');
  const [showVideoEditor, setShowVideoEditor] = useState<boolean>(false);

  const activeLesson = course.lessons.find(l => l.id === activeLessonId) || course.lessons[0];

  // Helper to extract clean embed URL
  const getYoutubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // If they paste exactly the 11 character ID
    if (url.trim().length === 11) {
      return `https://www.youtube.com/embed/${url.trim()}`;
    }
    return null;
  };

  // Sync state on lesson change
  useEffect(() => {
    setGraded(false);
    setSelectedVerse(null);
    setActiveTab('content');
    setInputVideoUrl(activeLesson.videoUrl || '');
    setShowVideoEditor(false);
    
    // Load existing answers if any
    const savedAnswers = progress.answers[activeLesson.id] || {};
    const newLocalAnswers: { [qId: string]: string[] } = {};
    activeLesson.reviewQuestions.forEach(q => {
      newLocalAnswers[q.id] = savedAnswers[q.id] || (q.type === 'fill-in-the-blank' ? Array(q.blankTexts?.length ? q.blankTexts.length - 1 : 1).fill('') : []);
    });
    setLocalAnswers(newLocalAnswers);

    // If already graded for this lesson in the past, show progress score
    if (progress.scores[activeLesson.id]) {
      setGraded(true);
      setLastScore(progress.scores[activeLesson.id].score);
    }
  }, [activeLessonId, activeLesson.id]);

  if (!activeLesson) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-500">Este curso no tiene lecciones estructuradas todavía.</p>
        <button onClick={onBackToCatalog} className="mt-4 px-4 py-2 bg-amber-500 text-neutral-900 font-semibold rounded-xl">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleTextChange = (qId: string, idx: number, text: string) => {
    setLocalAnswers(prev => {
      const current = [...(prev[qId] || [])];
      current[idx] = text;
      const updated = { ...prev, [qId]: current };
      onUpdateAnswers(activeLesson.id, qId, current);
      return updated;
    });
  };

  const handleSelectAnswer = (qId: string, val: string) => {
    const updatedAnswers = [val];
    setLocalAnswers(prev => ({ ...prev, [qId]: updatedAnswers }));
    onUpdateAnswers(activeLesson.id, qId, updatedAnswers);
  };

  const handleCalificar = () => {
    let score = 0;
    let totalEvaluable = 0;

    activeLesson.reviewQuestions.forEach(q => {
      if (q.type === 'written') {
        // Written questions are always parsed as correct for completing as long as there is text
        const ans = localAnswers[q.id]?.[0] || '';
        if (ans.trim().length > 3) {
          score += 1;
        }
        totalEvaluable += 1;
        return;
      }

      totalEvaluable += 1;
      const studentAnswers = localAnswers[q.id] || [];
      const correctAnswers = q.correctAnswers || [];

      if (q.type === 'fill-in-the-blank') {
        // Match all blanks (case insensitive and trimmed whitespace)
        const isAllBlanksCorrect = correctAnswers.every((correctWord, idx) => {
          const studentWord = (studentAnswers[idx] || '').trim().toLowerCase();
          return studentWord.includes(correctWord.toLowerCase()) || correctWord.toLowerCase().includes(studentWord);
        });
        if (isAllBlanksCorrect) {
          score += 1;
        }
      } else {
        // Multiple choice & YES-NO
        const isCorrect = correctAnswers.some(correctVal => {
          const studentVal = (studentAnswers[0] || '').trim().toLowerCase();
          return studentVal.startsWith(correctVal.toLowerCase());
        });
        if (isCorrect) {
          score += 1;
        }
      }
    });

    setLastScore(score);
    setGraded(true);
    onSaveScore(activeLesson.id, score, totalEvaluable);
  };

  // Nav helper
  const adjacentLessons = () => {
    const currentIndex = course.lessons.findIndex(l => l.id === activeLessonId);
    return {
      prev: currentIndex > 0 ? course.lessons[currentIndex - 1] : null,
      next: currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null
    };
  };

  const { prev, next } = adjacentLessons();

  const isCompleted = progress.completedLessons.includes(`${course.id}-${activeLesson.id}`);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch animate-fade-in relative">
      {/* Popover/Alert showing Verse Bible Lookup */}
      {selectedVerse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-150">
            <div className="p-5 bg-indigo-650 text-white font-bold font-sans flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Book className="w-4 h-4 text-indigo-200" />
                Referencia Bíblica: {selectedVerse.reference}
              </span>
              <button 
                onClick={() => setSelectedVerse(null)} 
                className="text-white hover:bg-indigo-700/80 p-1.5 rounded-lg font-mono font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-800 text-lg italic font-serif leading-relaxed">
                "{selectedVerse.text}"
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedVerse(null)}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-500 cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Navigation Column */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col space-y-4 shadow-xs">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Cursos
        </button>

        <div className="py-2 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-900 leading-tight">{course.title}</h2>
          <p className="text-indigo-600 text-[11px] font-mono mt-1 font-semibold uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded inline-block">
            {course.category}
          </p>
        </div>

        {/* Lessons List */}
        <div className="flex-1 space-y-1 overflow-y-auto max-h-[300px] lg:max-h-full pr-1 font-sans">
          {course.lessons.map(les => {
            const isLesComp = progress.completedLessons.includes(`${course.id}-${les.id}`);
            const isActive = les.id === activeLessonId;
            return (
              <button
                key={les.id}
                onClick={() => setActiveLessonId(les.id)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between text-xs sm:text-sm cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-transparent'
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <div className={`text-[10px] uppercase font-mono tracking-wider ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {les.index === 0 ? 'Introducción' : `Módulo ${les.index}`}
                  </div>
                  <div className="line-clamp-1">{les.title}</div>
                </div>
                {isLesComp && (
                  <Check className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Study Desk Area */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl flex flex-col min-h-[500px] shadow-xs overflow-hidden">
        {/* Desk Header tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-bold font-sans text-lg text-slate-900 leading-tight">{activeLesson.title}</h3>
            <p className="text-xs text-slate-500">{activeLesson.subtitle || 'Instrucción teológica y bíblica'}</p>
          </div>

          {activeLesson.reviewQuestions.length > 0 && (
            <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-300/60">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase ${
                  activeTab === 'content' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Estudio
              </button>
              <button
                onClick={() => setActiveTab('repaso')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition tracking-wide cursor-pointer uppercase flex items-center gap-1.5 ${
                  activeTab === 'repaso' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Repaso
                {isCompleted && (
                  <Check className={`w-3.5 h-3.5 ${activeTab === 'repaso' ? 'text-indigo-200' : 'text-emerald-650 font-bold'}`} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Desk Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[600px]">
          {activeTab === 'content' ? (
            <div className="space-y-8 max-w-3xl">
              {/* YouTube Video-Teaching Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 md:p-6 text-white space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Video Clase / Enseñanza</h4>
                      <p className="text-[10px] text-slate-400 tracking-wide uppercase font-mono font-bold mt-0.5">Lección: {activeLesson.title}</p>
                    </div>
                  </div>
                  {currentUserRole === 'admin' && (
                    <button 
                      onClick={() => setShowVideoEditor(!showVideoEditor)}
                      className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-805 transition cursor-pointer self-start sm:self-auto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {activeLesson.videoUrl ? 'Cambiar Video de YouTube' : 'Cargar Video'}
                    </button>
                  )}
                </div>

                {/* Editor to dynamic paste a separate link on the fly */}
                {showVideoEditor && (
                  <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2.5 animate-fade-in text-xs">
                    <p className="text-slate-300 font-medium">Ingresa un enlace o código de video de YouTube para esta lección:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text"
                        value={inputVideoUrl}
                        onChange={(e) => setInputVideoUrl(e.target.value)}
                        placeholder="Ejemplo: https://www.youtube.com/watch?v=FjIAdt4Y9vE"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono placeholder:text-slate-650 focus:outline-none focus:border-indigo-500 text-xs"
                      />
                      <button 
                        onClick={() => {
                          if (onUpdateVideo) {
                            onUpdateVideo(activeLesson.id, inputVideoUrl);
                            setShowVideoEditor(false);
                          } else {
                            activeLesson.videoUrl = inputVideoUrl;
                            setShowVideoEditor(false);
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 font-bold rounded-lg text-white transition tracking-wide text-xs uppercase shrink-0 cursor-pointer"
                      >
                        Establecer Enlace
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500">Admite URL normales (`watch?v=...`), compartidos cortos (`youtu.be/...`) o el código identificador de 11 letras.</p>
                  </div>
                )}

                {/* Render Embedded Iframe Player vs Placeholder */}
                {getYoutubeEmbedUrl(activeLesson.videoUrl) ? (
                  <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden shadow-inner border border-slate-800/65">
                    <iframe 
                      src={getYoutubeEmbedUrl(activeLesson.videoUrl) || ''}
                      title={`Video de la Lección ${activeLesson.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <div className="py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-850/45 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-300 font-bold text-xs">Aún no se ha cargado una video clase para esta lección</p>
                      <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto">Esta plataforma permite complementar tu estudio teológico con material práctico de YouTube.</p>
                    </div>
                    <button 
                      onClick={() => setShowVideoEditor(true)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-755 text-white rounded-lg text-[11px] font-bold tracking-wide uppercase transition hover:scale-103 cursor-pointer"
                    >
                      Cargar Enlace del Video
                    </button>
                  </div>
                )}
              </div>

              {/* Special Welcome view if first module 0 */}
              {activeLesson.welcome ? (
                <div className="space-y-6 text-slate-800 leading-relaxed">
                  <div className="text-center py-6">
                    <span className="text-5xl">⛪</span>
                    <h4 className="text-2xl font-sans font-extrabold text-slate-900 mt-4 leading-none">Vida Abundante</h4>
                    <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-mono font-bold">Manual del Discípulo</p>
                  </div>
                  {activeLesson.content.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      <h4 className="text-xl font-bold font-sans text-slate-900 border-b border-slate-100 pb-2">{sec.title}</h4>
                      {sec.subtitle && (
                        <p className="font-semibold text-slate-700 italic font-mono text-sm">{sec.subtitle}</p>
                      )}
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-slate-700 font-sans text-base leading-relaxed text-justify">
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => {
                        const nextMod = course.lessons.find(l => l.index === 1);
                        if (nextMod) setActiveLessonId(nextMod.id);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-650 hover:bg-indigo-600 font-bold text-white text-xs rounded-xl transition shadow-lg shadow-indigo-500/10 cursor-pointer uppercase tracking-wider"
                    >
                      Empezar Lección 1
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Lesson content view */
                <>
                  {activeLesson.content.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <h4 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-2">
                        {sec.title}
                      </h4>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-slate-700 text-sm md:text-base leading-relaxed text-justify whitespace-pre-wrap">
                          {p}
                        </p>
                      ))}

                      {/* Interactive scripture/verses panel */}
                      {sec.verses && sec.verses.length > 0 && (
                        <div className="mt-4 p-4 rounded-xl bg-indigo-50/40 border border-indigo-150 space-y-3">
                          <h5 className="text-[11px] font-mono font-bold tracking-widest text-indigo-800 uppercase flex items-center gap-1.5">
                            <Book className="w-3.5 h-3.5 text-indigo-600" />
                            Versículos Clave (Haz clic para ampliar)
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {sec.verses.map((v, vIdx) => (
                              <button
                                key={vIdx}
                                onClick={() => setSelectedVerse(v)}
                                className="text-left p-3 rounded-lg bg-white border border-slate-150 hover:border-indigo-300 hover:bg-indigo-50/20 transition flex items-center justify-between text-xs cursor-pointer group shadow-2xs"
                              >
                                <div>
                                  <p className="font-bold text-slate-800 group-hover:text-indigo-800">{v.reference}</p>
                                  <p className="text-slate-500 line-clamp-1 italic mt-0.5">"{v.text}"</p>
                                </div>
                                <Bookmark className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Tasks and memory guidelines */}
                  {activeLesson.tasks && activeLesson.tasks.length > 0 && (
                    <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3 shadow-lg">
                      <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-indigo-400 animate-pulse" />
                        Tarea y Memorización
                      </h4>
                      <ul className="space-y-2 text-xs md:text-sm text-slate-300 pl-4 list-disc">
                        {activeLesson.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="leading-relaxed">
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Immediate prompt button to do verification */}
                  {activeLesson.reviewQuestions.length > 0 && (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-sm text-slate-900">¿Listo para evaluar tu conocimiento?</h4>
                        <p className="text-xs text-slate-500">Completa el cuestionario interactivo de repaso de esta guía.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('repaso')}
                        className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-650 font-bold text-white text-xs rounded-xl tracking-wider uppercase transition cursor-pointer"
                      >
                        Ir al Repaso ahora
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Review and Self QA questionnaire view */
            <div className="space-y-8 max-w-3xl">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide">Cuestionario del Alumno</h4>
                  <p className="text-xs text-slate-650">Completa cada espacio en blanco o selecciona la opción válida de acuerdo a tu manual. Al terminar, presiona "Calificar Respuestas".</p>
                </div>
              </div>

              {/* Questions Mapper */}
              <div className="space-y-8">
                {activeLesson.reviewQuestions.map((q, idx) => {
                  const studentAns = localAnswers[q.id] || [];
                  const isCuratedCorrect = graded && q.type !== 'written' && (() => {
                    const studentAnswers = localAnswers[q.id] || [];
                    const correctAnswers = q.correctAnswers || [];
                    if (q.type === 'fill-in-the-blank') {
                      return correctAnswers.every((corr, i) => {
                        const std = (studentAnswers[i] || '').trim().toLowerCase();
                        return std.includes(corr.toLowerCase()) || corr.toLowerCase().includes(std);
                      });
                    } else {
                      return correctAnswers.some(corr => {
                        const std = (studentAnswers[0] || '').trim().toLowerCase();
                        return std.startsWith(corr.toLowerCase());
                      });
                    }
                  })();

                  return (
                    <div 
                      key={q.id} 
                      className={`p-5 rounded-xl border transition ${
                        graded 
                          ? q.type === 'written' 
                            ? 'bg-neutral-50 border-neutral-200' 
                            : isCuratedCorrect 
                              ? 'bg-emerald-50 border-emerald-200' 
                              : 'bg-rose-50 border-rose-200'
                          : 'bg-white border-neutral-200 shadow-3xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h4 className="font-bold text-neutral-900 text-sm sm:text-base flex items-start gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 bg-neutral-100 rounded text-neutral-600 shrink-0 mt-0.5">
                            Pauta {idx + 1}
                          </span>
                          <span>{q.prompt}</span>
                        </h4>
                        
                        {graded && q.type !== 'written' && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isCuratedCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isCuratedCorrect ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Correcto
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5" />
                                Incorrecto
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Question logic types */}
                      {q.type === 'fill-in-the-blank' && q.blankTexts && (
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-800 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-3 font-sans">
                          {q.blankTexts.map((text, bIdx) => (
                            <span key={bIdx} className="flex items-center gap-2">
                              <span>{text}</span>
                              {bIdx < q.blankTexts!.length - 1 && (
                                <input
                                  type="text"
                                  disabled={graded}
                                  value={studentAns[bIdx] || ''}
                                  onChange={(e) => handleTextChange(q.id, bIdx, e.target.value)}
                                  placeholder="Escribir aquí"
                                  className={`px-3 py-1 bg-white border rounded-lg text-sm text-center font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px] ${
                                    graded 
                                      ? 'bg-slate-105 text-slate-700 font-bold' 
                                      : 'border-slate-200 focus:border-indigo-650'
                                  }`}
                                />
                              )}
                            </span>
                          ))}
                        </div>
                      )}

                      {q.type === 'multiple-choice' && q.options && (
                        <div className="space-y-2.5">
                          {q.options.map((opt, oIdx) => {
                            const optCode = opt.substring(0, 1).toLowerCase();
                            const isSelected = studentAns[0] === optCode;
                            return (
                              <button
                                key={oIdx}
                                disabled={graded}
                                onClick={() => handleSelectAnswer(q.id, optCode)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-650 border-indigo-650 text-white font-bold'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'yes-no' && q.options && (
                        <div className="flex gap-4 font-sans">
                          {q.options.map((opt) => {
                            const isSelected = studentAns[0] === opt;
                            return (
                              <button
                                key={opt}
                                disabled={graded}
                                onClick={() => handleSelectAnswer(q.id, opt)}
                                className={`flex-1 p-3.5 rounded-xl border text-sm font-semibold transition cursor-pointer text-center ${
                                  isSelected
                                    ? 'bg-indigo-650 border-indigo-650 text-white font-bold'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'written' && (
                        <div className="space-y-1 font-sans">
                          <textarea
                            disabled={graded}
                            rows={3}
                            placeholder="Escribe tu respuesta y explicación bíblica..."
                            value={studentAns[0] || ''}
                            onChange={(e) => handleTextChange(q.id, 0, e.target.value)}
                            className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-650 leading-relaxed disabled:bg-slate-55"
                          />
                        </div>
                      )}

                      {/* Display correct solution when student is wrong */}
                      {graded && !isCuratedCorrect && q.type !== 'written' && q.correctAnswers && (
                        <div className="mt-3.5 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 text-xs font-mono font-medium flex items-center gap-1.5 leading-relaxed">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Pauta de corrección: <strong className="uppercase">{q.correctAnswers.join(', ')}</strong></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons to calculate grading */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-sans">
                {graded ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                    <Trophy className="w-8 h-8 text-indigo-600 shrink-0" />
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Calificación final: {lastScore} / {activeLesson.reviewQuestions.length}</h5>
                      <span className="text-xs text-slate-500 font-medium">
                        {lastScore === activeLesson.reviewQuestions.length 
                          ? '¡Excelente! Respuestas perfectas.' 
                          : 'Continúa repasando los capítulos en tu Biblia para lograr el puntaje perfecto.'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-sans italic font-medium">Revisa bien tus respuestas antes de procesar.</p>
                )}

                <div className="flex gap-2">
                  {!graded ? (
                    <button
                      onClick={handleCalificar}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-650 hover:bg-indigo-600 font-bold text-white text-xs tracking-wider uppercase rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                    >
                      Calificar Respuestas
                    </button>
                  ) : (
                    <button
                      onClick={() => setGraded(false)}
                      className="px-4 py-3 border border-slate-305 font-bold text-slate-700 text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer uppercase tracking-wider"
                    >
                      Volver a Intentar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desk Footer Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center text-xs font-sans font-semibold">
          {prev ? (
            <button
              onClick={() => setActiveLessonId(prev.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-205 bg-white text-slate-700 hover:text-slate-900 rounded-lg font-medium transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {next ? (
            <button
              onClick={() => setActiveLessonId(next.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg font-bold transition cursor-pointer"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onBackToCatalog}
              className="px-4 py-2 bg-indigo-605 hover:bg-indigo-505 text-white rounded-lg font-extrabold transition shadow-md shadow-indigo-600/15 cursor-pointer uppercase tracking-wider text-[11px]"
            >
              Culminar Curso 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
