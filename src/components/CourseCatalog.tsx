import { useState } from 'react';
import { Course, StudentProgress } from '../types';
import { Search, GraduationCap, ChevronRight, Clock, Plus, BookOpen, Trash2 } from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  progress: StudentProgress;
  onSelectCourse: (courseId: string) => void;
  onDeleteCourse?: (courseId: string) => void; // Allow deleting custom courses
  onShowCreator: () => void;
  currentUserRole?: 'admin' | 'student';
}

export default function CourseCatalog({ courses, progress, onSelectCourse, onDeleteCourse, onShowCreator, currentUserRole }: CourseCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');


  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCourseProgress = (course: Course) => {
    if (course.lessons.length === 0) return 0;
    const completedForThis = course.lessons.filter(l => 
      progress.completedLessons.includes(`${course.id}-${l.id}`)
    ).length;
    return Math.round((completedForThis / course.lessons.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-neutral-900">Catálogo de Cursos</h1>
          <p className="text-neutral-500 text-sm">Explora los programas de discipulado y capacitaciones disponibles.</p>
        </div>
        {currentUserRole === 'admin' && (
          <button
            onClick={onShowCreator}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-550 font-medium text-white text-sm rounded-xl transition shadow-sm cursor-pointer whitespace-nowrap self-start"
          >
            <Plus className="w-4 h-4" />
            Crear Nuevo Curso
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cursos por título, pastor o palabras clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 font-medium font-sans">No se encontraron cursos con estos criterios.</p>
          <p className="text-slate-400 text-xs">Intenta buscar otra palabra o crea un nuevo curso personalizado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const prg = getCourseProgress(course);
            const completedCount = course.lessons.filter(l => progress.completedLessons.includes(`${course.id}-${l.id}`)).length;
            
            return (
              <div 
                key={course.id} 
                className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col"
              >
                {/* Course Header Banner with Logo Colors */}
                <div className={`p-6 bg-gradient-to-br ${course.logoColor || 'from-indigo-650 to-indigo-500'} text-white relative`}>
                  <div className="absolute top-4 right-4 bg-white/25 px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase rounded">
                    {course.category}
                  </div>
                  <h3 className="text-xl font-bold font-sans text-white group-hover:underline cursor-pointer" onClick={() => onSelectCourse(course.id)}>
                    {course.title}
                  </h3>
                  <p className="text-white/80 text-xs font-sans font-medium mt-1">
                    {course.subtitle}
                  </p>
                </div>

                {/* Content & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.lessons.length} Módulos</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    {prg > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium font-sans">Progreso</span>
                          <span className="font-mono text-slate-700 font-semibold">{prg}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${course.logoColor || 'from-indigo-600 to-indigo-500'}`}
                            style={{ width: `${prg}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans tracking-wide uppercase rounded-xl transition cursor-pointer shadow-md shadow-indigo-650/15 hover:shadow-indigo-650/25"
                      >
                        {prg === 0 ? 'Iniciar Curso' : 'Continuar'}
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {currentUserRole === 'admin' && onDeleteCourse && course.id !== 'vida-abundante' && course.id !== 'liderazgo-cristiano' && (
                        <button
                          onClick={() => onDeleteCourse(course.id)}
                          title="Eliminar curso"
                          className="p-2.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
