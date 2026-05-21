export type QuestionType = 'fill-in-the-blank' | 'multiple-choice' | 'yes-no' | 'written';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  // Used for fill-in-the-blank, like ["La Biblia es la ", " de ", "."]
  blankTexts?: string[];
  // The correct words to fill the blanks, or correct multiple-choice label, or "si"/"no"
  correctAnswers?: string[];
  // Options for multiple choice
  options?: string[];
}

export interface SectionContent {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  verses?: { reference: string; text: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle?: string;
  index: number;
  welcome?: boolean; // Whether this represents a welcome module rather than a textbook chapter
  content: SectionContent[];
  reviewQuestions: Question[];
  tasks?: string[]; // Homework / memory tasks like "memorizar los primeros libros"
  videoUrl?: string; // YouTube video URL or ID to load inside the platform
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  author: string;
  duration: string; // e.g. "11 Semanas" or "4 Módulos"
  logoColor: string; // Tailwind bg class for theme customization
  iconName: string; // e.g. 'book', 'heart', 'church', 'shield'
  lessons: Lesson[];
}

export interface StudentProgress {
  selectedCourseId: string;
  completedLessons: string[]; // List of lesson IDs
  answers: {
    [lessonId: string]: {
      [questionId: string]: string[]; // Answers typed or selected by the student
    };
  };
  scores: {
    [lessonId: string]: {
      score: number;
      total: number;
      completedAt: string;
    };
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'student';
  displayName: string;
  photoURL: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  title: string;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: string;
}

