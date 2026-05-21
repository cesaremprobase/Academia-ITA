import { useState, useEffect } from 'react';
import { Course, StudentProgress, UserProfile } from './types';
import { AsambleasDeDiosLogo, ItaHuanucoLogo } from './components/Logos';
import { INITIAL_COURSES } from './data';
import Dashboard from './components/Dashboard';
import CourseCatalog from './components/CourseCatalog';
import StudyRoom from './components/StudyRoom';
import CourseCreator from './components/CourseCreator';
import SectasAlert from './components/SectasAlert';
import Community from './components/Community';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { 
  GraduationCap, 
  BookOpen, 
  Layout, 
  BookMarked, 
  Settings, 
  RotateCcw, 
  User, 
  Sparkles,
  HelpCircle,
  LogOut,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function App() {
  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Firestore Collections State
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<StudentProgress>({
    selectedCourseId: 'vida-abundante',
    completedLessons: [],
    answers: {},
    scores: {}
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalogo' | 'sectas' | 'study-room' | 'creator' | 'comunidad'>('dashboard');
  const [viewingCourseId, setViewingCourseId] = useState<string>('vida-abundante');
  const [studyRoomLessonId, setStudyRoomLessonId] = useState<string>('');

  // 1. Google Auth Connection & Role Determination
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Fetch user document from Firestore (or register user automatically)
        const userDocRef = doc(db, 'users', user.uid);
        let profileSnap = await getDoc(userDocRef);
        
        let profile: UserProfile;
        if (!profileSnap.exists()) {
          // Automatic bootstrap: cesarestebandelao@gmail.com is absolute System Admin
          const assignedRole = user.email === 'cesarestebandelao@gmail.com' ? 'admin' : 'student';
          
          profile = {
            uid: user.uid,
            email: user.email || '',
            role: assignedRole,
            displayName: user.displayName || 'Estudiante ITA',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString()
          };
          
          await setDoc(userDocRef, profile);
          
          // Secure mirrored write inside /admins/ collection for security rules
          if (assignedRole === 'admin') {
            await setDoc(doc(db, 'admins', user.uid), { uid: user.uid, email: user.email || '' });
          }
        } else {
          profile = profileSnap.data() as UserProfile;
          // Synchronize admin permissions rules table
          if (profile.role === 'admin') {
            await setDoc(doc(db, 'admins', user.uid), { uid: user.uid, email: user.email || '' }, { merge: true });
          }
        }
        setCurrentUserProfile(profile);
      } else {
        setCurrentUser(null);
        setCurrentUserProfile(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // 2. Real-time sync of Courses (Seeds INITIAL_COURSES to cloud if database collection is empty)
  useEffect(() => {
    if (!currentUser) return;

    const coursesRef = collection(db, 'courses');
    const unsubscribe = onSnapshot(coursesRef, async (snapshot) => {
      if (snapshot.empty) {
        // Automatically seed Cloud catalog
        for (const defaultCourse of INITIAL_COURSES) {
          try {
            await setDoc(doc(db, 'courses', defaultCourse.id), defaultCourse);
          } catch (e) {
            console.error(`Failed to seed course ${defaultCourse.id}:`, e);
          }
        }
      } else {
        const loadedCourses: Course[] = [];
        snapshot.forEach((docSnap) => {
          loadedCourses.push(docSnap.data() as Course);
        });

        // Ensure predictable sort order
        loadedCourses.sort((a, b) => {
          if (a.id === 'vida-abundante') return -1;
          if (b.id === 'vida-abundante') return 1;
          if (a.id === 'liderazgo-cristiano') return -1;
          if (b.id === 'liderazgo-cristiano') return 1;
          return a.title.localeCompare(b.title);
        });

        setCourses(loadedCourses);
      }
    }, (error) => {
      console.error("Error loading courses:", error);
    });

    return unsubscribe;
  }, [currentUser]);

  // 3. Real-time Student Study progress synchronization
  useEffect(() => {
    if (!currentUser) return;

    const progressDocRef = doc(db, 'progress', currentUser.uid);
    const unsubscribe = onSnapshot(progressDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setProgress(snapshot.data() as StudentProgress);
      } else {
        // Set standard progress model outline
        const initProg: StudentProgress = {
          selectedCourseId: 'vida-abundante',
          completedLessons: [],
          answers: {},
          scores: {}
        };
        setProgress(initProg);
      }
    }, (error) => {
      console.warn("Could not load student progress:", error);
    });

    return unsubscribe;
  }, [currentUser]);

  // Auth Action handlers
  const handleSignInGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google login failed:", error);
      const isNetworkError = error?.code === 'auth/network-request-failed' || String(error).includes('network-request-failed');
      if (isNetworkError) {
        setAuthError('network-request-failed');
      } else {
        setAuthError(error?.message || String(error));
      }
    }
  };

  const handleSignOutGoogle = async () => {
    if (confirm('¿Deseas cerrar tu sesión de estudiante?')) {
      await signOut(auth);
      // Reset state contexts
      setProgress({
        selectedCourseId: 'vida-abundante',
        completedLessons: [],
        answers: {},
        scores: {}
      });
      setActiveTab('dashboard');
    }
  };

  // Saved course changes (Admins only)
  const handleSaveCourse = async (savedCourse: Course) => {
    if (!currentUser || currentUserProfile?.role !== 'admin') {
      alert('Solo los administradores certificados pueden modificar la malla académica.');
      return;
    }
    const path = `courses/${savedCourse.id}`;
    try {
      await setDoc(doc(db, 'courses', savedCourse.id), savedCourse);
      setActiveTab('catalogo');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  // Delete course programs (Admins only)
  const handleDeleteCourse = async (courseId: string) => {
    if (!currentUser || currentUserProfile?.role !== 'admin') {
      alert('Operación restringida. Los alumnos no pueden eliminar materiales.');
      return;
    }
    const path = `courses/${courseId}`;
    if (confirm('¿Estás seguro de que deseas eliminar este programa académico del catálogo? del servidor?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, path);
      }
    }
  };

  // Sync answers to Cloud progress
  const handleUpdateAnswers = async (lessonId: string, questionId: string, value: string[]) => {
    if (!currentUser) return;
    
    // Copy progress answers
    const currentLessonAnswers = progress.answers[lessonId] || {};
    const updatedAnswers = {
      ...progress.answers,
      [lessonId]: {
        ...currentLessonAnswers,
        [questionId]: value
      }
    };

    const updatedProg = {
      ...progress,
      answers: updatedAnswers,
      uid: currentUser.uid,
      updatedAt: new Date().toISOString()
    };

    // Optimistic state
    setProgress(updatedProg);

    // Save
    try {
      await setDoc(doc(db, 'progress', currentUser.uid), updatedProg, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `progress/${currentUser.uid}`);
    }
  };

  // Save graded score
  const handleSaveScore = async (lessonId: string, score: number, total: number) => {
    if (!currentUser) return;
    const progressId = `${viewingCourseId}-${lessonId}`;
    
    const alreadyCompleted = progress.completedLessons.includes(progressId);
    const newCompleted = alreadyCompleted 
      ? progress.completedLessons 
      : [...progress.completedLessons, progressId];

    const updatedProg = {
      ...progress,
      completedLessons: newCompleted,
      scores: {
        ...progress.scores,
        [progressId]: {
          score,
          total,
          completedAt: new Date().toISOString()
        }
      },
      uid: currentUser.uid,
      updatedAt: new Date().toISOString()
    };

    setProgress(updatedProg);

    try {
      await setDoc(doc(db, 'progress', currentUser.uid), updatedProg, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `progress/${currentUser.uid}`);
    }
  };

  const handleUpdateLessonVideo = async (courseId: string, lessonId: string, videoUrl: string) => {
    if (!currentUser || currentUserProfile?.role !== 'admin') {
      alert('Solo los pastores/administradores pueden configurar las clases de video.');
      return;
    }
    
    const target = courses.find(c => c.id === courseId);
    if (!target) return;

    const updatedLessons = target.lessons.map(l => {
      if (l.id === lessonId) {
        return { ...l, videoUrl };
      }
      return l;
    });

    const updatedCourse = {
      ...target,
      lessons: updatedLessons
    };

    try {
      await setDoc(doc(db, 'courses', courseId), updatedCourse);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `courses/${courseId}`);
    }
  };

  const handleEnterCourse = (courseId: string) => {
    setViewingCourseId(courseId);
    setStudyRoomLessonId('');
    setActiveTab('study-room');
  };

  const handleEnterLesson = (courseId: string, lessonId: string) => {
    setViewingCourseId(courseId);
    setStudyRoomLessonId(lessonId);
    setActiveTab('study-room');
  };

  // Factory state reset (Admins only)
  const handleResetDatabase = async () => {
    if (!currentUser || currentUserProfile?.role !== 'admin') {
      alert('Solo un administrador certificado puede resetear el catálogo general de cursos.');
      return;
    }
    if (confirm('¿Deseas restablecer la plataforma al estado de fábrica en la Base de Datos? Todos los cursos personalizados y progresos en la nube se verán afectados.')) {
      try {
        // Iterate and delete all non-default courses from cloud, and rewrite defaults
        for (const c of courses) {
          await deleteDoc(doc(db, 'courses', c.id));
        }
        for (const defaultCourse of INITIAL_COURSES) {
          await setDoc(doc(db, 'courses', defaultCourse.id), defaultCourse);
        }
        alert('Base de Datos restablecida con los cursos por defecto.');
        setActiveTab('dashboard');
      } catch (e) {
        alert('Error restableciendo colecciones: ' + String(e));
      }
    }
  };

  const currentCourse = courses.find(c => c.id === viewingCourseId) || courses[0];

  // Render Loader if auth status is unknown
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:scale-105 transition-transform duration-200 inline-block">
            <ItaHuanucoLogo size={42} />
          </div>
          <p className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase animate-pulse">
            Iniciando credenciales de estudias ...
          </p>
        </div>
      </div>
    );
  }

  // Render Light Elegant Login Screen if Logged Out (Zero Mock-data, pure Google authentication)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
        
        {/* Subtle geometric background decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl translate-y-12 -translate-x-12"></div>
        
        {/* Simple topbar */}
        <header className="px-6 py-4 flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap bg-white/70 backdrop-blur-md px-4 py-2 border border-slate-200/80 rounded-2xl shadow-xs">
            <ItaHuanucoLogo size={28} />
            <span className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
              PLATAFORMA ITA
            </span>
          </div>
        </header>

        {/* Center Card Portal */}
        <main className="flex-1 flex items-center justify-center px-4 md:px-0">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative z-10">
            
            {/* Double Brand Identity Row */}
            <div className="flex items-center justify-center gap-4">
              <div className="p-1 px-1.5 bg-white border border-slate-100 rounded-xl shadow-xs shrink-0">
                <ItaHuanucoLogo size={46} />
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="p-1 px-1.5 bg-white border border-slate-100 rounded-xl shadow-xs shrink-0">
                <AsambleasDeDiosLogo size={32} />
              </div>
            </div>

            {/* Portal Labels */}
            <div className="text-center space-y-2">
              <h1 className="text-lg md:text-xl font-extrabold font-sans text-slate-900 tracking-tight uppercase leading-tight">
                Portal del Estudiante ITA
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium font-sans">
                Instituto Teológico de las Asambleas de Dios del Perú • Huánuco
              </p>
            </div>

            {/* Google Action Trigger */}
            <div className="space-y-3 pt-3">
              <button
                onClick={handleSignInGoogle}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold font-sans uppercase tracking-wider transition shadow-lg cursor-pointer transform hover:-translate-y-0.5"
              >
                {/* Embedded SVG Google Icon */}
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Ingresar con Google
              </button>

              {authError === 'network-request-failed' ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-800 leading-tight">
                        Restricción de Privacidad del Navegador
                      </p>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                        La conexión se bloqueó debido a que el navegador restringe cookies de terceros dentro del marco (iframe) de vista previa de AI Studio.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-1.5 border-t border-amber-100">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                      ¿Cómo solucionarlo?
                    </p>
                    <p className="text-[10px] text-slate-600">
                      Abre la plataforma en su propia pestaña e intenta de nuevo. Aquí iniciará sesión correctamente sin bloqueos:
                    </p>
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition text-center shadow-sm cursor-pointer"
                      onClick={() => setAuthError(null)}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Abrir ITA en pestaña nueva
                    </a>
                  </div>
                </div>
              ) : authError ? (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-left space-y-2 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-800 leading-tight">
                        Error al iniciar sesión
                      </p>
                      <p className="text-[10px] text-slate-600 leading-relaxed mt-1">
                        {authError}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setAuthError(null)}
                      className="text-[10px] font-bold text-rose-700 hover:underline px-2 py-1 cursor-pointer"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              ) : null}
              
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/40 text-left space-y-1.5">
                <p className="text-[10px] text-indigo-700 font-bold flex items-center gap-1 leading-none">
                  <Lock size={12} />
                  INGRESO RESTRINGIDO
                </p>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Debes utilizar tu cuenta de correo verificada de Google. Los accesos están protegidos y monitoreados por el Instituto.
                </p>
              </div>
            </div>

            {/* General FAQs helper contact */}
            <div className="pt-2 text-center">
              <span className="text-[10px] inline-flex items-center gap-1 text-slate-400">
                <HelpCircle size={12} />
                ¿Soporte con tu cuenta? Contacta al Pastor
              </span>
            </div>

          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="py-6 text-center text-[10px] text-slate-400 font-medium">
          PLATAFORMA ITA HUÁNUCO • © 2026 Todos los derechos reservados
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Top Professional Elegant Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 md:px-8 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-3 animate-fade-in flex-wrap">
            {/* Unified Brand Group (Logo 1 + Title + Logo 2) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
              {/* Logo 1 on the left */}
              <div className="p-1 bg-white border border-slate-200 rounded-xl shadow-xs hover:scale-105 transition-transform duration-200 shrink-0">
                <ItaHuanucoLogo size={36} />
              </div>

              {/* Title in the middle */}
              <h1 className="font-extrabold text-xs sm:text-sm md:text-base lg:text-lg font-sans tracking-tight text-slate-900 leading-none uppercase select-none whitespace-nowrap">
                PLATAFORMA ITA HUÁNUCO
              </h1>

              {/* Logo 2 on the right */}
              <div className="p-1 bg-white border border-slate-200 rounded-xl shadow-xs hover:scale-105 transition-transform duration-200 shrink-0">
                <AsambleasDeDiosLogo size={24} />
              </div>
            </div>

            {/* Student vs Admin role badges */}
            {currentUserProfile?.role === 'admin' ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[8px] font-mono bg-amber-500 text-slate-950 font-extrabold tracking-wider rounded-md">
                <ShieldCheck size={11} />
                DOCENTE / PASTOR
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 text-[8px] font-mono bg-indigo-650 text-white font-bold tracking-wider rounded-md">
                ALUMNO SECTOR
              </span>
            )}
          </div>
          <p className="text-[9px] md:text-[10px] text-slate-500 font-bold font-sans uppercase tracking-wider pl-1.5 leading-none">
            Instituto Teológico de las Asambleas de Dios • ITA Huánuco
          </p>
        </div>

        {/* User context widget */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-neutral-800 font-sans">{currentUser.displayName || 'Estudiante ITA'}</span>
            <span className="text-[10px] font-mono text-neutral-400">{currentUser.email}</span>
          </div>
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || ''} 
              className="w-8 h-8 rounded-full border border-neutral-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-sans font-bold text-indigo-700">
              {currentUser.displayName?.slice(0, 2).toUpperCase() || 'ES'}
            </div>
          )}
          
          <button
            onClick={handleSignOutGoogle}
            title="Cerrar sesión"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition shrink-0 cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main Body Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row bg-slate-50">
        {/* Responsive Dashboard/Creator sidebar menu */}
        <aside className="w-full md:w-64 bg-slate-900 p-4 flex flex-col justify-between gap-4 shrink-0 select-none md:min-h-[calc(100vh-70px)]">
          <div className="md:space-y-1 my-2 flex flex-col w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold leading-none tracking-wider uppercase transition-all duration-150 cursor-pointer w-full text-left ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <Layout className="w-4 h-4 shrink-0" />
              <span>Mi Portal</span>
            </button>

            {/* SKOOL STYLE COMMUNITY FEED (Highly Interactive forum) */}
            <button
              onClick={() => setActiveTab('comunidad')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold leading-none tracking-wider uppercase transition-all duration-150 cursor-pointer w-full text-left relative ${
                activeTab === 'comunidad' 
                  ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Comunidad</span>
              <span className="absolute right-3 bg-indigo-550 text-white text-[8px] px-1.5 py-0.5 rounded-full font-sans font-bold uppercase tracking-tighter">
                Skool
              </span>
            </button>

            <button
              onClick={() => setActiveTab('catalogo')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold leading-none tracking-wider uppercase transition-all duration-150 cursor-pointer w-full text-left ${
                activeTab === 'catalogo' 
                  ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Catálogo</span>
            </button>

            <button
              onClick={() => setActiveTab('sectas')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold leading-none tracking-wider uppercase transition-all duration-150 cursor-pointer w-full text-left ${
                activeTab === 'sectas' 
                  ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
              }`}
            >
              <BookMarked className="w-4 h-4 shrink-0" />
              <span>Sectas y Cultos</span>
            </button>

            {/* Plan de Cursos (Admins only) */}
            {currentUserProfile?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('creator')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold leading-none tracking-wider uppercase transition-all duration-150 cursor-pointer w-full text-left ${
                  activeTab === 'creator' 
                    ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-indigo-400 font-bold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-l-4 border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Plan de Cursos</span>
              </button>
            )}

          </div>

          {/* Reset Action (Admins only) */}
          {currentUserProfile?.role === 'admin' && (
            <div className="hidden md:block mt-auto pt-4 border-t border-slate-800">
              <button
                onClick={handleResetDatabase}
                className="w-full flex items-center gap-2 px-3 py-2 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 rounded-xl text-xs font-medium font-sans transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resetear Catálogo
              </button>
            </div>
          )}
        </aside>

        {/* Dynamic Section Contents desk */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard 
              courses={courses} 
              progress={progress} 
              onSelectCourse={handleEnterCourse}
              onSelectLesson={handleEnterLesson}
            />
          )}

          {activeTab === 'comunidad' && (
            <Community 
              currentUser={currentUser}
              currentUserProfile={currentUserProfile}
            />
          )}

          {activeTab === 'catalogo' && (
            <CourseCatalog 
              courses={courses} 
              progress={progress} 
              onSelectCourse={handleEnterCourse}
              onDeleteCourse={handleDeleteCourse}
              onShowCreator={() => setActiveTab('creator')}
              currentUserRole={currentUserProfile?.role}
            />
          )}

          {activeTab === 'sectas' && (
            <SectasAlert />
          )}

          {activeTab === 'creator' && currentUserProfile?.role === 'admin' && (
            <CourseCreator
              courses={courses}
              onSaveCourse={handleSaveCourse}
              onCancel={() => setActiveTab('catalogo')}
            />
          )}

          {activeTab === 'study-room' && currentCourse && (
            <StudyRoom
              course={currentCourse}
              progress={progress}
              onUpdateAnswers={handleUpdateAnswers}
              onSaveScore={handleSaveScore}
              onBackToCatalog={() => setActiveTab('catalogo')}
              initialLessonId={studyRoomLessonId}
              onUpdateVideo={(lessonId, videoUrl) => handleUpdateLessonVideo(currentCourse.id, lessonId, videoUrl)}
              currentUserRole={currentUserProfile?.role}
            />
          )}
        </main>
      </div>

      {/* Footer system branding element */}
      <footer className="bg-white border-t border-slate-200 p-4 text-center text-xs text-slate-400 font-sans tracking-wide">
        PLATAFORMA ITA HUÁNUCO • Instituto Teológico de las Asambleas de Dios del Perú
      </footer>
    </div>
  );
}
