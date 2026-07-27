import {
  Heart, MessageSquare, Share2, MoreHorizontal, Flag, Bookmark,
  Code2, Image, Briefcase, Award, Star, Globe, Link2,
  Loader2, Trash2, Edit, Copy, ExternalLink, FileText, User
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../ui/GlassCard';

const POST_TYPES = [
  { value: 'post', label: 'Publicación', icon: MessageSquare },
  { value: 'article', label: 'Artículo', icon: FileText },
  { value: 'project', label: 'Proyecto', icon: Code2 },
  { value: 'achievement', label: 'Logro', icon: Award },
  { value: 'job', label: 'Oferta', icon: Briefcase },
];

const typeStyles = {
  post: { bg: 'bg-primary-container/40', text: 'text-on-surface' },
  article: { bg: 'bg-primary-container/40', text: 'text-on-surface' },
  project: { bg: 'bg-primary-container/40', text: 'text-on-surface' },
  achievement: { bg: 'bg-primary-container/40', text: 'text-on-surface' },
  job: { bg: 'bg-primary-container/40', text: 'text-on-surface' },
};

const typeLabels = {
  post: 'SIGNAL',
  article: 'BRIEF',
  project: 'MISSION',
  achievement: 'MILESTONE',
  job: 'CONTRACT',
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
    if (!confirm('Delete this post?')) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) throw error;
      onDelete(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEdit = () => {
    console.log('Edit post:', post.id);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      await navigator.share({
        title: post.author?.full_name || 'Dedran post',
        text: post.content.slice(0, 100),
        url,
      });
      onUpdate({ ...post, shares_count: post.shares_count + 1 });
    } catch (err) {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleBookmark = async () => { };

  const handleReport = () => { };

  const TypeIcon = typeStyles[post.type]?.icon || MessageSquare;
  const typeStyle = typeStyles[post.type] || typeStyles.post;

  const renderContent = () => {
    if (post.type === 'job') {
      return (
        <div className="mt-4 p-4 bg-surface-container rounded-lg border border-nebula-stroke">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
              <Briefcase size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-body-md font-bold text-on-surface">{post.content.split('\n')[0]}</h4>
              {post.content.split('\n').slice(1).join('\n') && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">{post.content.split('\n').slice(1).join('\n')}</p>
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
              <img key={i} src={url} alt={`Project ${i + 1}`} className="w-full h-48 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      );
    }

    if (post.media_urls?.length) {
      return (
        <div className="mt-4 rounded-lg overflow-hidden border border-nebula-stroke">
          {post.media_urls.slice(0, 1).map((url, i) => (
            <img key={i} src={url} alt={`Attachment ${i + 1}`} className="w-full h-64 object-cover" />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <GlassCard className="p-stack-md space-y-4" hover={false}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-nebula-stroke shrink-0 bg-surface-container">
            {post.author?.avatar_url ? (
              <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-headline-sm font-bold text-primary">
                  {post.author?.full_name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{post.author?.full_name || 'User'}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {post.author?.headline || 'Explorer'} &middot; {formatTime(post.published_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-primary-container/40 px-2 py-1 rounded-sm border border-nebula-stroke">
          <Star size={14} className="text-on-surface" />
          <span className="font-label-caps text-label-caps text-on-surface">{typeLabels[post.type] || 'SIGNAL'}</span>
        </div>
      </div>

      <div className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
        {post.content}
      </div>

      {renderContent()}

      {(post.type === 'job' || post.type === 'project') && post.media_urls?.[0] && (
        <a href={post.media_urls[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-label-caps text-label-caps text-primary hover:underline">
          <ExternalLink size={14} />
          View {post.type === 'job' ? 'contract' : 'mission'}
        </a>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-nebula-stroke text-on-surface-variant">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 transition-all hover:text-primary ${post.has_liked ? 'text-primary' : ''}`}
            aria-label={post.has_liked ? 'Unlike' : 'Like'}
            aria-pressed={post.has_liked}
          >
            <Heart size={18} className={post.has_liked ? 'fill-current' : ''} />
            <span className="font-body-sm text-body-sm">{post.likes_count}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 transition-all hover:text-primary"
            aria-label={`${post.comments_count} comments`}
            aria-expanded={showComments}
          >
            <MessageSquare size={18} />
            <span className="font-body-sm text-body-sm">{post.comments_count}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 transition-all hover:text-primary"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 rounded hover:bg-primary-container/40 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
          {showMenu && (
            <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-surface-container border border-nebula-stroke rounded-lg shadow-lg py-1 min-w-[160px] z-20">
              {isAuthor && (
                <>
                  <button onClick={handleEdit} className="w-full px-4 py-2 text-left flex items-center gap-2 font-body-sm text-body-sm text-on-surface hover:bg-primary-container/40">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={handleDelete} className="w-full px-4 py-2 text-left flex items-center gap-2 font-body-sm text-body-sm text-error hover:bg-error/10">
                    <Trash2 size={16} /> Delete
                  </button>
                  <hr className="my-1 border-nebula-stroke" />
                </>
              )}
              <button onClick={handleShare} className="w-full px-4 py-2 text-left flex items-center gap-2 font-body-sm text-body-sm text-on-surface hover:bg-primary-container/40">
                <Share2 size={16} /> Share
              </button>
              <button onClick={handleBookmark} className="w-full px-4 py-2 text-left flex items-center gap-2 font-body-sm text-body-sm text-on-surface hover:bg-primary-container/40">
                <Bookmark size={16} /> Save
              </button>
              {!isAuthor && (
                <>
                  <hr className="my-1 border-nebula-stroke" />
                  <button onClick={handleReport} className="w-full px-4 py-2 text-left flex items-center gap-2 font-body-sm text-body-sm text-error hover:bg-error/10">
                    <Flag size={16} /> Report
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-4 border-t border-nebula-stroke animate-slide-down">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container shrink-0">
                    {comment.author?.avatar_url ? (
                      <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-label-md font-bold text-primary">
                          {comment.author?.full_name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 bg-surface-container rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold font-body-sm text-body-sm text-on-surface">
                        {comment.author?.full_name || 'User'}
                      </span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">@{comment.author?.username}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">&middot; {formatTime(comment.created_at)}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && !loadingComments && (
                <p className="text-center text-on-surface-variant py-4 font-body-sm text-body-sm">No comments yet. Be the first!</p>
              )}

              <div className="flex gap-3 mt-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container shrink-0">
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-label-md font-bold text-primary">
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
                    placeholder="Write a comment..."
                    className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant"
                    disabled={sendingComment}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || sendingComment}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-caps text-label-caps disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    {sendingComment ? <Loader2 size={16} className="animate-spin" /> : 'Send'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </GlassCard>
  );
};

export default PostCard;