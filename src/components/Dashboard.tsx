import { Course, StudentProgress } from '../types';
import { BookOpen, Award, CheckCircle2, Flame, Play, Trophy } from 'lucide-react';
import { AsambleasDeDiosLogo, ItaHuanucoLogo } from './Logos';

interface DashboardProps {
  courses: Course[];
  progress: StudentProgress;
  onSelectCourse: (courseId: string) => void;
  onSelectLesson: (courseId: string, lessonId: string) => void;
}

export default function Dashboard({ courses, progress, onSelectCourse, onSelectLesson }: DashboardProps) {
  // Safe calculation helper
  const getCourseProgress = (course: Course) => {
    if (course.lessons.length === 0) return 0;
    const completedForThis = course.lessons.filter(l => 
      progress.completedLessons.includes(`${course.id}-${l.id}`)
    ).length;
    return Math.round((completedForThis / course.lessons.length) * 100);
  };

  const completedTotal = progress.completedLessons.length;
  
  // High-fidelity stats
  const activeCourse = courses.find(c => c.id === progress.selectedCourseId) || courses[0];
  const activeCourseProgress = activeCourse ? getCourseProgress(activeCourse) : 0;

  // Let's find the next lesson to resume
  const nextLesson = activeCourse?.lessons.find(
    l => !progress.completedLessons.includes(`${activeCourse.id}-${l.id}`)
  ) || activeCourse?.lessons[0];

  // Calculate overall grade average
  const totalScores = Object.values(progress.scores);
  const avgScorePercent = totalScores.length > 0 
    ? Math.round((totalScores.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalScores.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-850 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 font-mono tracking-wide">
            PLATAFORMA ACADÉMICA ITA HUÁNUCO
          </span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
            ¡Bienvenido a tu Crecimiento Espiritual!
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Explora las Sagradas Escrituras, completa las guías interactivas del manual de discipulado <strong className="text-indigo-400 font-semibold">Vida Abundante</strong>, y lleva una bitácora profesional de tu aprendizaje teológico en el Instituto Teológico de las Asambleas de Dios, sede Huánuco.
          </p>
          {nextLesson && (
            <div className="pt-2">
              <button
                onClick={() => onSelectLesson(activeCourse.id, nextLesson.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-650/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                Continuar con: {nextLesson.title}
              </button>
            </div>
          )}
        </div>

        {/* Decorative branding insignia right-hand side */}
        <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl md:max-w-xs text-center self-start md:self-auto w-full md:w-auto justify-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-md hover:scale-105 transition-transform duration-250 shrink-0">
              <ItaHuanucoLogo size={52} />
            </div>
            <div className="p-2 bg-white rounded-xl shadow-md hover:scale-105 transition-transform duration-250 shrink-0">
              <AsambleasDeDiosLogo size={40} />
            </div>
          </div>
          <div className="text-left md:text-center">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">ITA HUÁNUCO</h3>
            <p className="text-[9px] text-slate-400 font-bold font-sans uppercase mt-0.5">Asambleas de Dios del Perú</p>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-mono tracking-wider uppercase">Cursos Activos</p>
            <p className="text-2xl font-bold font-sans text-slate-900 mt-1">{courses.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-mono tracking-wider uppercase">Guías Completadas</p>
            <p className="text-2xl font-bold font-sans text-slate-900 mt-1">{completedTotal}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-mono tracking-wider uppercase">Racha de Estudio</p>
            <p className="text-2xl font-bold font-sans text-slate-900 mt-1 flex items-center gap-1.5">
              5 <span className="text-xs font-normal text-slate-500 font-sans">Días</span>
            </p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Flame className="w-5 h-5 fill-orange-500 stroke-orange-500 animate-pulse" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-505 field-placeholder text-xs font-mono tracking-wider uppercase">Promedio Calificación</p>
            <p className="text-2xl font-bold font-sans text-slate-900 mt-1">
              {totalScores.length > 0 ? `${avgScorePercent}%` : 'N/A'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Stats layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Curricular Progress */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-sans text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Progreso en tus Cursos
          </h2>
          <div className="space-y-5">
            {courses.map(course => {
              const prg = getCourseProgress(course);
              return (
                <div key={course.id} className="p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{course.title}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">{course.category} • {course.duration}</p>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {prg}% Completado
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${course.logoColor || 'from-indigo-500 to-indigo-650'}`}
                      style={{ width: `${prg}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      {course.lessons.filter(l => progress.completedLessons.includes(`${course.id}-${l.id}`)).length} de {course.lessons.length} unidades
                    </span>
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
                    >
                      Ir al curso →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grades / History */}
        <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-sans text-slate-900">Historial de Repasos</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {totalScores.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300" />
                <p className="text-slate-505 text-xs text-slate-500">Aún no has calificado repasos.</p>
                <p className="text-slate-400 text-[11px]">Completa los cuestionarios interactivos de cada guía.</p>
              </div>
            ) : (
              Object.entries(progress.scores).map(([lessonId, { score, total, completedAt }]) => {
                const lessonName = lessonId.replace('vida-abundante-', '').replace('liderazgo-cristiano-', '').replace('-', ' ').toUpperCase();
                const gradePercent = Math.round((score / total) * 100);
                return (
                  <div key={lessonId} className="p-3.5 rounded-lg bg-slate-55 border border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-tight">{lessonName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {new Date(completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-mono font-bold ${gradePercent >= 80 ? 'text-emerald-600' : gradePercent >= 60 ? 'text-amber-600' : 'text-rose-500'}`}>
                        {score}/{total}
                      </span>
                      <p className="text-[10px] font-mono text-slate-500">{gradePercent}%</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
