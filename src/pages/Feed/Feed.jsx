import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Heart, MessageSquare, Share2, MoreHorizontal,
  Image, FileText, Code2, Trophy, Briefcase, BookOpen,
  Loader2, Send, X, ChevronDown, Flag, Edit, Trash2,
  User, Clock, Globe, Link2, Star, Rocket, Users as UsersIcon
} from 'lucide-react';
import CreatePost from '../../components/feed/CreatePost';
import PostCard from '../../components/feed/PostCard';
import GlassCard from '../../components/ui/GlassCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6" aria-busy="true">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container p-6 rounded-xl animate-pulse border border-nebula-stroke">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest" />
                <div className="flex-1">
                  <div className="h-4 w-3/12 rounded bg-surface-container-highest" />
                  <div className="h-3 w-2/12 rounded bg-surface-container-highest mt-1" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 w-full rounded bg-surface-container-highest" />
                <div className="h-6 w-5/6 rounded bg-surface-container-highest" />
                <div className="h-6 w-4/6 rounded bg-surface-container-highest" />
              </div>
              <div className="h-32 w-full rounded-xl bg-surface-container-highest mt-4" />
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-6">
                  <div className="h-5 w-20 rounded bg-surface-container-highest" />
                  <div className="h-5 w-24 rounded bg-surface-container-highest" />
                  <div className="h-5 w-20 rounded bg-surface-container-highest" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-stack-lg">
      {/* Feed Column */}
      <div className="flex-1 max-w-3xl space-y-gutter">
        {/* Inline Composer Card */}
        {showCreatePost ? (
          <CreatePost
            onClose={() => setShowCreatePost(false)}
            onPostCreated={handlePostCreated}
            profile={profile}
          />
        ) : (
          <GlassCard className="p-stack-md" hover={false}>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-nebula-stroke shrink-0 bg-surface-container">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  readOnly
                  onClick={() => setShowCreatePost(true)}
                  placeholder="Transmit your coordinates..."
                  className="w-full bg-[#07090E] border border-charcoal-gray rounded-lg p-3 min-h-[80px] resize-none font-body-md text-body-md text-on-surface cursor-text focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all placeholder:text-on-surface-variant"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-nebula-stroke">
              <div className="flex gap-2 text-on-surface-variant">
                <button
                  onClick={() => { setShowCreatePost(true); }}
                  className="p-2 rounded-full hover:bg-primary-container/40 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Image size={16} />
                  <span className="font-body-sm text-body-sm hidden sm:inline">Media</span>
                </button>
                <button
                  onClick={() => { setShowCreatePost(true); }}
                  className="p-2 rounded-full hover:bg-primary-container/40 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Rocket size={16} />
                  <span className="font-body-sm text-body-sm hidden sm:inline">Log</span>
                </button>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-[#D9D9D6] text-[#07090E] px-6 py-2 rounded-lg font-bold font-body-sm text-body-sm hover:opacity-90 transition-opacity"
              >
                Transmit
              </button>
            </div>
          </GlassCard>
        )}

        {/* Error Banner */}
        {error && (
          <GlassCard className="p-4 border border-error/30 bg-error-container/20 flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-error-container">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-error/20 rounded">✕</button>
          </GlassCard>
        )}

        {/* Posts Feed */}
        <div className="space-y-gutter" role="feed">
          {posts.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <FileText className="text-on-surface-variant/50 mx-auto mb-4" size={64} />
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No transmissions yet</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Be the first to share with the cosmos</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-caps text-label-caps flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Create First Post
              </button>
            </GlassCard>
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

          <div ref={loadMoreRef} className="h-4" aria-hidden="true">
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {hasMoreRef.current === false && posts.length > 0 && (
              <div className="text-center py-4 font-label-caps text-label-caps text-on-surface-variant">
                No more transmissions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar — Desktop Only */}
      <aside className="hidden lg:block w-80 shrink-0 space-y-stack-lg">
        <GlassCard className="p-stack-md" hover={false}>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 pb-2 border-b border-nebula-stroke">Trending Anomalies</h3>
          <ul className="space-y-3">
            <li className="group cursor-pointer">
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">#OrionSpike</p>
              <p className="font-label-caps text-label-caps text-charcoal-gray">45.2k Logs</p>
            </li>
            <li className="group cursor-pointer">
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">#DarkMatterClusters</p>
              <p className="font-label-caps text-label-caps text-charcoal-gray">12.8k Logs</p>
            </li>
            <li className="group cursor-pointer">
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">#Sector7Clearance</p>
              <p className="font-label-caps text-label-caps text-charcoal-gray">8.1k Logs</p>
            </li>
          </ul>
        </GlassCard>
        <GlassCard className="p-stack-md" hover={false}>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 pb-2 border-b border-nebula-stroke">Stellar Connections</h3>
          <ul className="space-y-4">
            {[
              { name: 'Lyra', role: 'Xeno-Biologist' },
              { name: 'Capt. Jax', role: 'Freighter Cmdr' },
            ].map((conn) => (
              <li key={conn.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-nebula-stroke bg-primary-container/40 flex items-center justify-center">
                    <UsersIcon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface font-semibold">{conn.name}</p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">{conn.role}</p>
                  </div>
                </div>
                <button className="text-primary hover:text-[#FFFFFF] transition-colors">
                  <Plus size={18} />
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </aside>
    </div>
  );
};

export default Feed;