import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  PlusCircle, 
  Search, 
  Trash2, 
  User as UserIcon, 
  Clock, 
  Users, 
  Flag,
  Share2,
  X,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { Post, Comment, UserProfile } from '../types';

interface CommunityProps {
  currentUser: any; // Firebase User
  currentUserProfile: UserProfile | null;
}

export default function Community({ currentUser, currentUserProfile }: CommunityProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: Comment[] }>({});
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'mine'>('all');
  
  // Modal controllers
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  
  // Active viewing post details
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});

  const [loading, setLoading] = useState(true);

  // 1. Subscribe to real-time posts feed sorted by newest
  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(150));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts: Post[] = [];
      snapshot.forEach((docSnap) => {
        const rawData = docSnap.data();
        loadedPosts.push({
          id: docSnap.id,
          authorId: rawData.authorId || '',
          authorName: rawData.authorName || 'Usuario',
          authorPhoto: rawData.authorPhoto || '',
          title: rawData.title || '',
          content: rawData.content || '',
          likes: rawData.likes || [],
          createdAt: rawData.createdAt || '',
          updatedAt: rawData.updatedAt
        });
      });
      setPosts(loadedPosts);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });

    return unsubscribe;
  }, []);

  // 2. Load members list for Skool's student sidebar directory
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(40));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMembers: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedMembers.push({
          uid: docSnap.id,
          email: data.email || '',
          role: data.role || 'student',
          displayName: data.displayName || 'Estudiante',
          photoURL: data.photoURL || '',
          createdAt: data.createdAt || ''
        });
      });
      setMembers(loadedMembers);
    }, (error) => {
      // Graceful error handle for private scopes
      console.warn('Error reading active members roster:', error);
    });

    return unsubscribe;
  }, []);

  // 3. Listen to comments on posts dynamically if expanded
  useEffect(() => {
    if (!posts.length) return;

    const unsubscribers = posts.map(post => {
      const commentsRef = collection(db, 'posts', post.id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      
      return onSnapshot(q, (snapshot) => {
        const comments: Comment[] = [];
        snapshot.forEach((docSnap) => {
          const rawDoc = docSnap.data();
          comments.push({
            id: docSnap.id,
            postId: post.id,
            authorId: rawDoc.authorId || '',
            authorName: rawDoc.authorName || 'Compañero',
            authorPhoto: rawDoc.authorPhoto || '',
            content: rawDoc.content || '',
            createdAt: rawDoc.createdAt || ''
          });
        });
        
        setCommentsMap(prev => ({
          ...prev,
          [post.id]: comments
        }));
      }, (error) => {
        console.warn(`Could not subscribe to comments for post ${post.id}:`, error);
      });
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [posts]);

  // Handle Likes
  const handleLikeToggle = async (post: Post) => {
    if (!currentUser) return;
    const path = `posts/${post.id}`;
    try {
      const hasLiked = post.likes.includes(currentUser.uid);
      const updatedLikes = hasLiked 
        ? post.likes.filter(id => id !== currentUser.uid)
        : [...post.likes, currentUser.uid];

      const postDocRef = doc(db, 'posts', post.id);
      await updateDoc(postDocRef, {
        likes: updatedLikes
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  // Submit Comments
  const handleAddComment = async (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text || !currentUser) return;

    const path = `posts/${postId}/comments`;
    try {
      const commentId = `comment_${Date.now()}`;
      const commentDocRef = doc(db, 'posts', postId, 'comments', commentId);
      
      const newComment: Comment = {
        id: commentId,
        postId: postId,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUserProfile?.displayName || 'Estudiante',
        authorPhoto: currentUser.photoURL || '',
        content: text,
        createdAt: new Date().toISOString()
      };

      await setDoc(commentDocRef, newComment);
      
      // Reset comments state input
      setNewCommentText(prev => ({
        ...prev,
        [postId]: ''
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim() || !currentUser) return;

    const postId = `post_${Date.now()}`;
    const path = `posts/${postId}`;
    
    try {
      const newPost: Post = {
        id: postId,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUserProfile?.displayName || 'Teólogo ITA',
        authorPhoto: currentUser.photoURL || '',
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        likes: [],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'posts', postId), newPost);
      
      // Cleanup
      setNewPostTitle('');
      setNewPostContent('');
      setIsCreatingPost(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Deseas eliminar permanentemente esta discusión de la comunidad?')) return;
    const path = `posts/${postId}`;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      if (viewingPostId === postId) {
        setViewingPostId(null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Filter and search
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeFilter === 'mine') {
      return matchesSearch && currentUser && post.authorId === currentUser.uid;
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* LEFT / CENTER: Feed & Create Form */}
      <div className="flex-1 space-y-6">
        
        {/* Community Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
            <Users size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-mono font-bold uppercase tracking-wider">
                  ¡COMUNIDAD GENERAL!
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-sans font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Interactúa con tus compañeros
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Portal de Compañerismo ITA</h1>
              <p className="text-slate-300 text-xs mt-1 md:max-w-xl">
                Crea publicaciones, responde dudas de tus hermanos teólogos, comparte avances bíblicos y fortalezcan juntos la sana doctrina en este foro exclusivo.
              </p>
            </div>
            
            <button
              onClick={() => setIsCreatingPost(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider shrink-0 transition shadow-lg cursor-pointer"
            >
              <PlusCircle size={15} />
              Crear Publicación
            </button>
          </div>
        </div>

        {/* Filters and Search Bar combo */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-0.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos los Temas
            </button>
            <button
              onClick={() => setActiveFilter('mine')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeFilter === 'mine' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Mis Publicaciones
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar discusiones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* CREATE POST MODAL-DRAWER PANEL */}
        {isCreatingPost && (
          <div className="bg-white rounded-2xl border-2 border-indigo-500 p-5 shadow-md relative transition-all duration-300">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1 px-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Megaphone size={16} />
                </span>
                <h3 className="font-bold text-sm text-slate-800">Escribir nueva discusión</h3>
              </div>
              <button 
                onClick={() => setIsCreatingPost(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Título de la publicación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dudas sobre las objeciones del Bautismo del Espíritu Santo"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Contenido / Pregunta teológica</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe tus argumentos bíblicos, dudas, referencias para la clase..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-slate-50/50"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Publicar en el Muro
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FEED LIST */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400 text-xs">
            Cargando publicaciones de la comunidad en tiempo real...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Users className="mx-auto w-10 h-10 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">No hay publicaciones activas</h3>
            <p className="text-slate-400 text-xs mt-1">Sé el primero en iniciar un debate haciendo clic en "Crear Publicación".</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isLikedByMe = currentUser && post.likes.includes(currentUser.uid);
              const postComments = commentsMap[post.id] || [];
              const isViewingDetails = viewingPostId === post.id;

              return (
                <article 
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition duration-150 overflow-hidden"
                >
                  {/* Author Header */}
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {post.authorPhoto ? (
                        <img 
                          src={post.authorPhoto} 
                          alt={post.authorName} 
                          className="w-10 h-10 rounded-full border border-slate-100 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <UserIcon size={18} />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-xs text-slate-800 font-sans">{post.authorName}</h4>
                          {post.authorId === 'cesarestebandelao@gmail.com' || post.authorName.includes('Pastor') || post.authorName.includes('Admin') ? (
                            <span className="flex items-center gap-0.5 text-[8px] bg-amber-500/10 text-amber-700 font-extrabold px-1 py-0.5 rounded-sm uppercase tracking-tight">
                              <ShieldCheck size={9} />
                              DOCENTE
                            </span>
                          ) : (
                            <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1 py-0.5 rounded-sm uppercase tracking-tight">
                              ALUMNO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono mt-0.5">
                          <Clock size={11} />
                          {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Recién publicado'}
                        </div>
                      </div>
                    </div>

                    {/* Delete logic for author or admin */}
                    {currentUser && (post.authorId === currentUser.uid || currentUserProfile?.role === 'admin') && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                        title="Eliminar publicación"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="px-5 pb-3">
                    <h2 className="font-extrabold text-sm text-slate-900 font-sans leading-snug tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed whitespace-pre-wrap font-sans">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions (Like & Comment triggers) */}
                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Likes click */}
                      <button
                        onClick={() => handleLikeToggle(post)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-transform hover:scale-105 active:scale-95 text-xs font-semibold font-sans cursor-pointer ${
                          isLikedByMe 
                            ? 'bg-rose-50 border border-rose-100 text-rose-500' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likes.length} {post.likes.length === 1 ? 'Me gusta' : 'Me gustas'}</span>
                      </button>

                      {/* Comment toggle expand */}
                      <button
                        onClick={() => setViewingPostId(isViewingDetails ? null : post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold font-sans cursor-pointer ${
                          isViewingDetails 
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <MessageSquare size={14} />
                        <span>{postComments.length} {postComments.length === 1 ? 'Comentario' : 'Comentarios'}</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans font-medium flex items-center gap-1">
                      <Users size={12} />
                      Classroom Activa
                    </div>
                  </div>

                  {/* COMMENTS DRAWER-LIKE DESK (If expanded) */}
                  {isViewingDetails && (
                    <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-4">
                      {/* List of comments */}
                      {postComments.length > 0 && (
                        <div className="space-y-3">
                          {postComments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2 text-xs">
                              {comment.authorPhoto ? (
                                <img 
                                  src={comment.authorPhoto} 
                                  alt={comment.authorName} 
                                  className="w-8 h-8 rounded-full border border-slate-100 object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                  <UserIcon size={14} />
                                </div>
                              )}
                              <div className="bg-white border border-slate-200/60 p-2.5 rounded-2xl flex-1">
                                <div className="flex items-center justify-between pb-1">
                                  <span className="font-bold text-slate-800 text-[11px] leading-none mb-0.5">{comment.authorName}</span>
                                  <span className="text-[9px] text-slate-400 font-mono leading-none">
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                  </span>
                                </div>
                                <p className="text-slate-600 leading-snug">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Escribe un comentario teológico o de motivación..."
                          required
                          value={newCommentText[post.id] || ''}
                          onChange={(e) => setNewCommentText(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))}
                          className="flex-1 px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition cursor-pointer"
                        >
                          <Send size={14} />
                        </button>
                      </form>
                    </div>
                  )}

                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR: Member Leaderboard (Skool Style) */}
      <div className="w-full lg:w-72 space-y-4">
        
        {/* Active Classmates Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-50 mb-3">
            <Users className="text-indigo-600" size={18} />
            <div className="flex flex-col">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wilder font-sans">Compañeros Conectados</h3>
              <p className="text-[9px] text-slate-400 font-sans leading-none mt-0.5">Roster de teólogos de la plataforma</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {members.length === 0 ? (
              <p className="text-center text-[10px] text-slate-400 font-sans py-4">Inicia sesión con Google para aparecer en la comunidad.</p>
            ) : (
              members.map((member) => (
                <div 
                  key={member.uid} 
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                    currentUser && member.uid === currentUser.uid 
                      ? 'bg-indigo-50/50 border border-indigo-100/40' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    {member.photoURL ? (
                      <img 
                        src={member.photoURL} 
                        alt={member.displayName} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                        {member.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[11px] text-slate-800 font-sans block truncate leading-tight">
                        {member.displayName}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none">
                      {member.role === 'admin' ? 'Docente / Pastor' : 'Teólogo Estudiante'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Community Guidelines Board */}
        <div className="bg-slate-900 rounded-2xl p-4 text-slate-100 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 mb-2">
            <Flag className="text-amber-500" size={14} />
            <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-slate-400">Conducta del Instituto</h4>
          </div>
          <ol className="text-[10px] space-y-1.5 text-slate-300 font-sans leading-relaxed list-decimal list-inside">
            <li>Sean amables y edifiquen el espíritu.</li>
            <li>No se permite atacar doctrinas de forma no constructiva.</li>
            <li>Centrar las publicaciones en las asignaturas.</li>
          </ol>
          <div className="mt-3 text-[8px] text-indigo-400 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/15 text-center font-bold">
            ITA HUÁNUCO • 2026
          </div>
        </div>

      </div>

    </div>
  );
}
