import { 
  Heart, MessageSquare, Share2, MoreHorizontal, Flag, Bookmark, 
  Code2, Image, Briefcase, Award, Star, Globe, Link2, 
  Loader2, Trash2, Edit, Copy, ExternalLink 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const POST_TYPES = [
  { value: 'post', label: 'Publicación', icon: MessageSquare },
  { value: 'article', label: 'Artículo', icon: FileText },
  { value: 'project', label: 'Proyecto', icon: Code2 },
  { value: 'achievement', label: 'Logro', icon: Award },
  { value: 'job', label: 'Oferta', icon: Briefcase },
];

const typeStyles = {
  post: { bg: 'bg-primary/10', text: 'text-primary', icon: MessageSquare },
  article: { bg: 'bg-blue/10', text: 'text-blue-400', icon: FileText },
  project: { bg: 'bg-purple/10', text: 'text-purple-400', icon: Code2 },
  achievement: { bg: 'bg-yellow/10', text: 'text-yellow-400', icon: Award },
  job: { bg: 'bg-green/10', text: 'text-green-400', icon: Briefcase },
};

const typeLabels = {
  post: 'Publicación',
  article: 'Artículo',
  project: 'Proyecto',
  achievement: 'Logro',
  job: 'Oferta de empleo',
};

const PostCard = ({ post, currentUser, onLike, onUpdate, onDelete, formatTime }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const isAuthor = currentUser && post.author_id === currentUser.id;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles!author_id (id, full_name, username, avatar_url, headline)
        `)
        .eq('post_id', post.id)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments) loadComments();
  }, [showComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || sendingComment) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSendingComment(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          author_id: user.id,
          content: newComment.trim(),
        })
        .select(`
          *,
          author:profiles!author_id (id, full_name, username, avatar_url, headline)
        `)
        .single();

      if (error) throw error;
      
      setComments(prev => [...prev, data]);
      setNewComment('');
      onUpdate({ ...post, comments_count: post.comments_count + 1 });
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSendingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta publicación?')) return;
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) throw error;
      onDelete(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit modal
    console.log('Edit post:', post.id);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      await navigator.share({
        title: post.author?.full_name || 'Publicación en Dedran',
        text: post.content.slice(0, 100),
        url,
      });
      onUpdate({ ...post, shares_count: post.shares_count + 1 });
    } catch (err) {
      await navigator.clipboard.writeText(url);
      // TODO: Show toast "Copiado al portapapeles"
    }
  };

  const handleBookmark = async () => {
    // TODO: Implement bookmark
  };

  const handleReport = () => {
    // TODO: Implement report
  };

  const TypeIcon = typeStyles[post.type]?.icon || MessageSquare;
  const typeStyle = typeStyles[post.type] || typeStyles.post;

  const renderContent = () => {
    if (post.type === 'job') {
      return (
        <div className="mt-4 p-4 glass-card rounded-xl border border-outline-variant/30">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
              <Briefcase size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-body-lg font-bold text-on-surface">{post.content.split('\n')[0]}</h4>
              {post.content.split('\n').slice(1).join('\n') && (
                <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">{post.content.split('\n').slice(1).join('\n')}</p>
              )}
            </div>
          </div>
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.media_urls.slice(0, 4).map((url, i) => (
                <img key={i} src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (post.type === 'project' && post.media_urls?.length) {
      return (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {post.media_urls.map((url, i) => (
              <img key={i} src={url} alt={`Proyecto ${i+1}`} className="w-full h-48 object-cover rounded-xl" />
            ))}
          </div>
        </div>
      );
    }

    if (post.media_urls?.length) {
      return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {post.media_urls.map((url, i) => (
            <img key={i} src={url} alt={`Adjunto ${i+1}`} className="w-full h-48 object-cover rounded-xl" />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <article className="glass-card rounded-2xl p-5 border border-outline-variant/30 hover:border-outline-variant/50 transition-colors relative">
      <div ref={menuRef} className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <a href={`/profile/${post.author?.username}`} className="block">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container">
              {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-headline-sm font-bold text-primary">
                    {post.author?.full_name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
          </a>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <a href={`/profile/${post.author?.username}`} className="hover:underline">
                <span className="text-body-md font-bold text-on-surface truncate block">
                  {post.author?.full_name || 'Usuario'}
                </span>
              </a>
              <span className="text-label-md text-on-surface-variant whitespace-nowrap">
                @{post.author?.username || 'usuario'}
              </span>
              <span className="text-label-md text-on-surface-variant">·</span>
              <time className="text-label-md text-on-surface-variant whitespace-nowrap" dateTime={post.published_at}>
                {formatTime(post.published_at)}
              </time>
              <span className={typeStyle.bg + ' ' + typeStyle.text + ' px-2 py-0.5 rounded-full text-[10px] font-label-md whitespace-nowrap'}>
                <TypeIcon size={10} className="inline mr-0.5" />
                {typeLabels[post.type] || 'Publicación'}
              </span>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant"
                aria-label="Más opciones"
              >
                <MoreHorizontal size={20} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 glass-card rounded-xl shadow-lg border border-outline-variant/30 py-1 min-w-[160px] z-20 animate-fade-in">
                  {isAuthor && (
                    <>
                      <button onClick={handleEdit} className="w-full px-4 py-2 text-left flex items-center gap-2 text-label-md text-on-surface hover:bg-surface-variant">
                        <Edit size={16} /> Editar
                      </button>
                      <button onClick={handleDelete} className="w-full px-4 py-2 text-left flex items-center gap-2 text-label-md text-error hover:bg-error/10">
                        <Trash2 size={16} /> Eliminar
                      </button>
                      <hr className="my-1 border-outline-variant/30" />
                    </>
                  )}
                  <button onClick={handleShare} className="w-full px-4 py-2 text-left flex items-center gap-2 text-label-md text-on-surface hover:bg-surface-variant">
                    <Share2 size={16} /> Compartir
                  </button>
                  <button onClick={handleBookmark} className="w-full px-4 py-2 text-left flex items-center gap-2 text-label-md text-on-surface hover:bg-surface-variant">
                    <Bookmark size={16} /> Guardar
                  </button>
                  {!isAuthor && (
                    <>
                      <hr className="my-1 border-outline-variant/30" />
                      <button onClick={handleReport} className="w-full px-4 py-2 text-left flex items-center gap-2 text-label-md text-error hover:bg-error/10">
                        <Flag size={16} /> Reportar
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Headline/Role */}
          {post.author?.headline && (
            <p className="text-label-sm text-on-surface-variant mb-3">{post.author.headline}</p>
          )}

          {/* Post Content */}
          <div className="text-body-md text-on-surface font-body-md whitespace-pre-wrap mb-3">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/30 text-label-sm text-on-surface-variant">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Media Content */}
          {renderContent()}

          {/* External Links for jobs/projects */}
          {(post.type === 'job' || post.type === 'project') && post.media_urls?.[0] && (
            <a href={post.media_urls[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-label-md text-primary hover:underline font-label-md">
              <ExternalLink size={14} />
              Ver {post.type === 'job' ? 'oferta' : 'proyecto'}
            </a>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 mt-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                  post.has_liked
                    ? 'bg-error/10 text-error'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
                aria-label={post.has_liked ? 'Quitar like' : 'Dar like'}
                aria-pressed={post.has_liked}
              >
                <Heart size={18} className={post.has_liked ? 'fill-current' : ''} />
                <span className="text-label-md font-label-md">{post.likes_count}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors"
                aria-label={`Ver ${post.comments_count} comentarios`}
                aria-expanded={showComments}
              >
                <MessageSquare size={18} />
                <span className="text-label-md font-label-md">{post.comments_count}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors"
                aria-label="Compartir"
              >
                <Share2 size={18} />
                <span className="text-label-md font-label-md">{post.shares_count}</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={handleBookmark} className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors" aria-label="Guardar">
                <Bookmark size={20} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-outline-variant/30 animate-slide-down">
              {loadingComments ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                        {comment.author?.avatar_url ? (
                          <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-label-md font-bold text-primary">
                              {comment.author?.full_name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 glass-card rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <a href={`/profile/${comment.author?.username}`} className="font-bold text-body-sm text-on-surface hover:underline">
                            {comment.author?.full_name || 'Usuario'}
                          </a>
                          <span className="text-label-sm text-on-surface-variant">@{comment.author?.username}</span>
                          <span className="text-label-sm text-on-surface-variant">· {formatTime(comment.created_at)}</span>
                        </div>
                        <p className="text-body-sm text-on-surface font-body-md whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && !loadingComments && (
                    <p className="text-center text-on-surface-variant py-4 text-body-md">No hay comentarios aún. ¡Sé el primero!</p>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                      {currentUser?.avatar_url ? (
                        <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-label-md font-bold text-primary">
                            {currentUser?.full_name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment())}
                        placeholder="Escribe un comentario..."
                        className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm"
                        disabled={sendingComment}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || sendingComment}
                        className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-sm disabled:opacity-50 hover:scale-[0.98] transition-transform"
                      >
                        {sendingComment ? <Loader2 size={16} className="animate-spin" /> : 'Enviar'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;