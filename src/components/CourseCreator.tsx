import { useState } from 'react';
import { Course, Lesson, Question } from '../types';
import { Plus, Trash2, ArrowLeft, Layers, CheckCircle, HelpCircle, FileText, Settings, Book } from 'lucide-react';

interface CourseCreatorProps {
  courses: Course[];
  onSaveCourse: (course: Course) => void;
  onCancel: () => void;
}

export default function CourseCreator({ courses, onSaveCourse, onCancel }: CourseCreatorProps) {
  // Course-level fields
  const [selectedCourseId, setSelectedCourseId] = useState<string>('new');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [category, setCategory] = useState('Discipulado');
  const [author, setAuthor] = useState('');
  const [duration, setDuration] = useState('');
  const [logoColor, setLogoColor] = useState('from-amber-500 to-orange-600');
  const [iconName, setIconName] = useState('book-open');

  // Lesson-level list & form
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubtitle, setLessonSubtitle] = useState('');
  const [paragraphsText, setParagraphsText] = useState('');
  
  // Verses & Questions builders
  const [versesText, setVersesText] = useState(''); // Syntax: reference|verse text (one per line)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [questionType, setQuestionType] = useState<'fill-in-the-blank' | 'multiple-choice' | 'yes-no' | 'written'>('written');
  const [questionBlanksText, setQuestionBlanksText] = useState(''); // e.g., "La Biblia es la * de Dios."
  const [questionOptionsText, setQuestionOptionsText] = useState(''); // e.g., "a. Opcion 1 \n b. Opcion 2"
  const [questionCorrectAns, setQuestionCorrectAns] = useState(''); // e.g., "Palabra" or "c"

  const logoThemes = [
    { label: 'Oro / Naranja', value: 'from-amber-500 to-orange-600' },
    { label: 'Azul Real', value: 'from-blue-600 to-indigo-800' },
    { label: 'Esmeralda', value: 'from-emerald-600 to-teal-850' },
    { label: 'Purpura Imperial', value: 'from-purple-600 to-fuchsia-800' },
    { label: 'Rojo Carmesí', value: 'from-rose-600 to-red-800' },
  ];

  const handleCourseSelectionChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (courseId === 'new') {
      setCourseTitle('');
      setCourseSubtitle('');
      setCourseDescription('');
      setCategory('Discipulado');
      setAuthor('');
      setDuration('');
      setLessons([]);
    } else {
      const selected = courses.find(c => c.id === courseId);
      if (selected) {
        setCourseTitle(selected.title);
        setCourseSubtitle(selected.subtitle);
        setCourseDescription(selected.description);
        setCategory(selected.category);
        setAuthor(selected.author);
        setDuration(selected.duration);
        setLessons(selected.lessons);
        setLogoColor(selected.logoColor);
        setIconName(selected.iconName);
      }
    }
  };

  const handleAddQuestion = () => {
    if (!questionPrompt.trim()) return;

    let newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: questionType,
      prompt: questionPrompt,
    };

    if (questionType === 'fill-in-the-blank') {
      // Split by '*'
      const parts = questionBlanksText.split('*');
      newQuestion.blankTexts = parts;
      newQuestion.correctAnswers = questionCorrectAns.split(',').map(s => s.trim());
    } else if (questionType === 'multiple-choice') {
      newQuestion.options = questionOptionsText.split('\n').filter(l => l.trim().length > 0);
      newQuestion.correctAnswers = [questionCorrectAns.trim()];
    } else if (questionType === 'yes-no') {
      newQuestion.options = ['Sí', 'No'];
      newQuestion.correctAnswers = [questionCorrectAns.trim()];
    }

    setQuestions([...questions, newQuestion]);
    
    // Reset Q fields
    setQuestionPrompt('');
    setQuestionBlanksText('');
    setQuestionOptionsText('');
    setQuestionCorrectAns('');
  };

  const handleDeleteQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId));
  };

  const handleSaveLesson = () => {
    if (!lessonTitle.trim()) return;

    // Process paragraphs
    const paragraphs = paragraphsText.split('\n\n').filter(p => p.trim().length > 0);

    // Process verses
    const verses = versesText.split('\n').filter(l => l.includes('|')).map(line => {
      const [reference, text] = line.split('|');
      return { reference: reference.trim(), text: text.trim() };
    });

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: lessonTitle,
      subtitle: lessonSubtitle || undefined,
      index: lessons.length + 1,
      content: [
        {
          title: 'Contenido Teológico',
          paragraphs,
          verses: verses.length > 0 ? verses : undefined
        }
      ],
      reviewQuestions: questions
    };

    setLessons([...lessons, newLesson]);

    // Reset lesson form
    setLessonTitle('');
    setLessonSubtitle('');
    setParagraphsText('');
    setVersesText('');
    setQuestions([]);
    setIsAddingLesson(false);
  };

  const handleDeleteLessonFromCourse = (lessonId: string) => {
    setLessons(lessons.filter(l => l.id !== lessonId).map((l, idx) => ({ ...l, index: idx + 1 })));
  };

  const handleSaveCourse = () => {
    if (!courseTitle.trim()) return;

    const courseId = selectedCourseId === 'new' ? `course-${Date.now()}` : selectedCourseId;

    const newCourse: Course = {
      id: courseId,
      title: courseTitle,
      subtitle: courseSubtitle,
      description: courseDescription,
      category,
      author,
      duration: duration || `${lessons.length} Módulos`,
      logoColor,
      iconName,
      lessons
    };

    onSaveCourse(newCourse);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Portal
        </button>
        <span className="text-xs font-semibold text-slate-500 font-mono">Editor de Currícula</span>
      </div>

      {/* Target choice: New Course vs Edit Course */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
        <Settings className="w-5 h-5 text-slate-500 shrink-0" />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <label className="block text-xs font-mono font-bold uppercase text-slate-600">Acción del Editor</label>
          <p className="text-xs text-slate-500">¿Qué deseas hacer hoy? Crea nuevos cursos desde cero o expande los existentes.</p>
        </div>
        <select
          value={selectedCourseId}
          onChange={(e) => handleCourseSelectionChange(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
        >
          <option value="new">Crear Nuevo Programa (Desde cero)</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>Agregar Lecciones/Modificar: {c.title}</option>
          ))}
        </select>
      </div>

      {/* Course Specifications Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold font-sans text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-5 h-5 text-indigo-600" />
          1. Especificaciones del Programa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">Título del Curso *</label>
            <input
              type="text"
              placeholder="Ej: Teología Sistemática o Guía N° 6 en adelante"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Subtítulo Descriptivo</label>
            <input
              type="text"
              placeholder="Ej: Principios prácticos para líderes"
              value={courseSubtitle}
              onChange={(e) => setCourseSubtitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Categoría</label>
            <input
              type="text"
              placeholder="Ej: Discipulado, Liderazgo, Teología"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Autor / Pastor</label>
            <input
              type="text"
              placeholder="Ej: Pastor Juan Pérez"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Duración Aproximada</label>
            <input
              type="text"
              placeholder="Ej: 4 Módulos / 6 Semanas"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700">Descripción General</label>
            <textarea
              rows={3}
              placeholder="Breve reseña sobre el contenido de este curso..."
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-650"
            />
          </div>

          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block">Tema Visual (Gradiente)</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {logoThemes.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setLogoColor(t.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r ${t.value} transition border ${
                    logoColor === t.value ? 'border-slate-900 ring-2 ring-indigo-400' : 'border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course syllabus Lessons List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold font-sans text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            2. Capitulos / Lecciones de Estudio
          </h2>
          {!isAddingLesson && (
            <button
              onClick={() => setIsAddingLesson(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 font-bold text-xs rounded-xl text-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Lección
            </button>
          )}
        </div>

        {/* Existing Lessons queue */}
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Aún no has agregado lecciones a este curso. Haz clic en "Nueva Lección" para empezar.
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((les, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Lección {les.index}</span>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{les.title}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{les.subtitle || 'Sin descripción'}</p>
                  <p className="text-[10px] text-indigo-600 font-semibold mt-1 uppercase font-mono">
                    {les.reviewQuestions.length} Preguntas de Repaso asociadas
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLessonFromCourse(les.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Adding lesson form */}
        {isAddingLesson && (
          <div className="p-5 border border-dashed border-indigo-300 rounded-2xl bg-indigo-50/10 space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-850 flex items-center gap-1">
              <Plus className="w-4 h-4 text-indigo-500" />
              Estructurar Nueva Lección
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <input
                  type="text"
                  placeholder="Título de la Lección (Ej: Guía N° 6: Temas Clave)"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <input
                  type="text"
                  placeholder="Subtítulo de la Lección"
                  value={lessonSubtitle}
                  onChange={(e) => setLessonSubtitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none"
                />
              </div>

              {/* Rich Lesson Body text */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-700">Párrafos de Estudio / Libro (Separa con doble espacio)</label>
                <textarea
                  rows={6}
                  placeholder="Escribe aquí el contenido del texto bíblico o explicativo de la lección para que el alumno lo lea..."
                  value={paragraphsText}
                  onChange={(e) => setParagraphsText(e.target.value)}
                  className="w-full p-4 bg-white border border-neutral-300 rounded-xl text-sm focus:outline-none leading-relaxed"
                />
              </div>

              {/* Biblical Verses database builder */}
              <div className="space-y-1.5 col-span-1 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-700 block">Soporte Bíblico Asociado (Opcional, formato: Referencia|Contenido del versículo)</label>
                <textarea
                  rows={3}
                  placeholder="Génesis 1:1|En el principio creó Dios los cielos y la tierra.&#10;Juan 3:16|Porque de tal manera amó Dios al mundo..."
                  value={versesText}
                  onChange={(e) => setVersesText(e.target.value)}
                  className="w-full p-3 font-mono bg-white border border-neutral-300 rounded-xl text-xs focus:outline-none"
                />
              </div>

              {/* Interactive Q&A for this Lesson Creator */}
              <div className="space-y-4 col-span-1 sm:col-span-2 border-t pt-4">
                <h4 className="text-xs font-bold font-mono uppercase text-neutral-700 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  Agregar Preguntas de Repaso / Evaluaciones Interactivos
                </h4>

                {/* Question List Preview */}
                {questions.length > 0 && (
                  <div className="space-y-2 max bg-neutral-50 p-3 rounded-lg border">
                    {questions.map((q, qIdx) => (
                      <div key={qIdx} className="flex justify-between items-center text-xs">
                        <span>Pauta {qIdx + 1}: <strong>{q.prompt}</strong> ({q.type})</span>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)} 
                          className="text-rose-500 font-semibold"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Enunciado de la Pregunta (Ej: Señale si...)"
                        value={questionPrompt}
                        onChange={(e) => setQuestionPrompt(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <select
                        value={questionType}
                        onChange={(e: any) => setQuestionType(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      >
                        <option value="written">Escrita (Desarrollo libre)</option>
                        <option value="fill-in-the-blank">Completar Blancos</option>
                        <option value="multiple-choice">Opción Múltiple</option>
                        <option value="yes-no">Sí/No</option>
                      </select>
                    </div>
                  </div>

                  {/* Form fields depending on type */}
                  {questionType === 'fill-in-the-blank' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Usa el símbolo '*' para marcar el blanco. Ej: La Biblia es la * de Dios."
                        value={questionBlanksText}
                        onChange={(e) => setQuestionBlanksText(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Palabra correctas correspondientes al blanco. Ej: Palabra"
                        value={questionCorrectAns}
                        onChange={(e) => setQuestionCorrectAns(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {questionType === 'multiple-choice' && (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        placeholder="Escribe las opciones una por línea (Ej: &#10;a. Opcion uno&#10;b. Opcion dos)"
                        value={questionOptionsText}
                        onChange={(e) => setQuestionOptionsText(e.target.value)}
                        className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Letra correcta (Ej: a)"
                        value={questionCorrectAns}
                        onChange={(e) => setQuestionCorrectAns(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {questionType === 'yes-no' && (
                    <div className="space-y-2">
                      <select
                        value={questionCorrectAns}
                        onChange={(e) => setQuestionCorrectAns(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      >
                        <option value="">Selecciona la correcta</option>
                        <option value="Sí">Sí</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end col-span-1 sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-3 py-1.5 bg-slate-900 text-white font-semibold text-xs rounded hover:bg-slate-800 cursor-pointer"
                    >
                      Añadir Pregunta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveLesson}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans rounded-xl transition cursor-pointer"
              >
                Inscribir Lección
              </button>
              <button
                type="button"
                onClick={() => setIsAddingLesson(false)}
                className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveCourse}
          disabled={lessons.length === 0 || !courseTitle}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-sm font-bold font-sans transition shadow-lg shadow-indigo-650/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar Programa Académico
        </button>
      </div>
    </div>
  );
}
