import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, Heart, MessageSquare, Share2, MoreHorizontal, 
  Image, FileText, Code2, Trophy, Briefcase, BookOpen,
  Loader2, Send, X, ChevronDown, Flag, Edit, Trash2,
  User, Clock, Globe, Link2
} from 'lucide-react';
import CreatePost from '../../components/feed/CreatePost';
import PostCard from '../../components/feed/PostCard';

const POST_TYPES = [
  { value: 'post', label: 'Publicación', icon: FileText },
  { value: 'article', label: 'Artículo', icon: BookOpen },
  { value: 'project', label: 'Proyecto', icon: Code2 },
  { value: 'achievement', label: 'Logro', icon: Trophy },
  { value: 'job', label: 'Oferta de empleo', icon: Briefcase },
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedType, setSelectedType] = useState('post');
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMore) {
          fetchPosts(true);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadingMore]);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
  };

  const fetchPosts = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
        pageRef.current += 1;
      } else {
        setLoading(true);
        pageRef.current = 0;
        hasMoreRef.current = true;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!author_id (
            id, full_name, username, avatar_url, headline
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range(pageRef.current * 10, (pageRef.current + 1) * 10 - 1);

      const { data, error } = await query;
      if (error) throw error;

      const postsWithLikes = await Promise.all(
        (data || []).map(async (post) => {
          let hasLiked = false;
          if (user) {
            const { data: like } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            hasLiked = !!like;
          }
          return { ...post, has_liked: hasLiked };
        })
      );

      if (loadMore) {
        setPosts(prev => [...prev, ...postsWithLikes]);
      } else {
        setPosts(postsWithLikes);
      }
      
      hasMoreRef.current = (data?.length || 0) === 10;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePostCreated = async (newPost) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: author } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, headline')
      .eq('id', user.id)
      .single();
    
    setPosts(prev => [{ 
      ...newPost, 
      author, 
      has_liked: false,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0 
    }, ...prev]);
    setShowCreatePost(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p));
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleLike = async (postId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const optimisticPost = { 
      ...post, 
      has_liked: !post.has_liked,
      likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1
    };
    setPosts(prev => prev.map(p => p.id === postId ? optimisticPost : p));

    try {
      if (post.has_liked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
    } catch (err) {
      setPosts(prev => prev.map(p => p.id === postId ? post : p));
      setError(err.message);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div className="space-y-6" aria-busy="true">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-variant" />
                <div className="flex-1">
                  <div className="h-4 w-3/12 rounded bg-surface-variant" />
                  <div className="h-3 w-2/12 rounded bg-surface-variant mt-1" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 w-full rounded bg-surface-variant" />
                <div className="h-6 w-5/6 rounded bg-surface-variant" />
                <div className="h-6 w-4/6 rounded bg-surface-variant" />
              </div>
              <div className="h-32 w-full rounded-xl bg-surface-variant mt-4" />
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-6">
                  <div className="h-5 w-20 rounded bg-surface-variant" />
                  <div className="h-5 w-24 rounded bg-surface-variant" />
                  <div className="h-5 w-20 rounded bg-surface-variant" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background starry-bg">
      <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-8">
        {/* Create Post */}
        {showCreatePost ? (
          <CreatePost
            onClose={() => setShowCreatePost(false)}
            onSubmit={handlePostCreated}
            initialType={selectedType}
            profile={profile}
          />
        ) : (
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 hover:bg-surface-container-highest/50 transition-colors border border-outline-variant/30"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={20} className="text-primary" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-body-md text-on-surface-variant font-body-md">¿Qué quieres compartir?</p>
              <p className="text-label-sm text-on-surface-variant/70">Escribe una publicación, comparte un proyecto o celebra un logro</p>
            </div>
            <Plus size={24} className="text-primary" />
          </button>
        )}

        {/* Post Type Selector (when creating) */}
        {showCreatePost && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2" role="tablist">
            {POST_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all ${
                  selectedType === type.value
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
                role="tab"
                aria-selected={selectedType === type.value}
              >
                <type.icon size={16} />
                {type.label}
              </button>
            ))}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="glass-card rounded-xl p-4 mb-6 border border-error/30 bg-error-container/20 flex items-center justify-between animate-slide-in">
            <span className="text-on-error-container text-label-md">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-error/20 rounded">✕</button>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6" role="feed" aria-label="Publicaciones">
          {posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <FileText className="text-on-surface-variant/50 mx-auto mb-4" size={64} />
              <h3 className="text-headline-md font-headline-md text-on-surface mb-2">No hay publicaciones aún</h3>
              <p className="text-body-md text-on-surface-variant mb-6">Sé el primero en compartir algo con la comunidad</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md flex items-center gap-2 mx-auto hover:scale-[0.98] transition-transform"
              >
                <Plus size={18} />
                Crear primera publicación
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={profile}
                onLike={handleLike}
                onUpdate={handlePostUpdated}
                onDelete={handlePostDeleted}
                formatTime={formatTime}
              />
            ))
          )}

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="h-4" aria-hidden="true">
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {hasMoreRef.current === false && posts.length > 0 && (
              <div className="text-center py-4 text-label-md text-on-surface-variant">
                No hay más publicaciones
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;