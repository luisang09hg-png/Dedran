import { useEffect, useCallback, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePosts, useToggleLike } from '../../hooks/usePosts'
import { subscribeToNewPosts } from '../../api/posts'
import PostCard from '../../components/feed/PostCard'
import { CreatePost as CreatePostComponent } from '../../components/posts/CreatePost'
import EventHorizon from '../../components/ui/EventHorizon'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import Badge from '../../components/ui/Badge'
import { Users, Sparkles, TrendingUp, Clock, Filter } from 'lucide-react'

export const Feed = () => {
  const { user } = useAuth()
  const userId = user?.id
  const [sortBy, setSortBy] = useState('recent')
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts(userId)

  const toggleLikeMutation = useToggleLike()

  useEffect(() => {
    if (!userId) return
    const unsubscribe = subscribeToNewPosts(() => {
      refetch()
    })
    return unsubscribe
  }, [userId, refetch])

  const handleLike = useCallback(async (postId) => {
    if (!userId) return
    const allPages = data?.pages || []
    let currentlyLiked = false
    for (const page of allPages) {
      const post = page.find(p => p.id === postId)
      if (post) {
        currentlyLiked = post.has_liked || false
        break
      }
    }
    toggleLikeMutation.mutate({ postId, userId, currentlyLiked })
  }, [userId, data, toggleLikeMutation])

  const handleUpdate = useCallback(() => {
    refetch()
  }, [refetch])

  const handleDelete = useCallback(() => {
    refetch()
  }, [refetch])

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl p-6 bg-error-container text-on-error-container rounded-lg">
        <h2 className="font-headline-sm text-headline-sm mb-2">Failed to load feed</h2>
        <p className="font-body-md text-body-md">Please try again later.</p>
      </div>
    )
  }

  const allPosts = data?.pages?.flat() || []

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <Sparkles size={24} className="text-primary" />
            Cosmic Feed
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Discover what's happening in your professional galaxy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-on-surface-variant" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface text-sm focus:border-primary focus:outline-none transition-smooth"
          >
            <option value="recent">Recent</option>
            <option value="relevant">Relevant</option>
            <option value="activity">Activity</option>
          </select>
        </div>
      </div>

      {/* Sort Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge
          variant={sortBy === 'recent' ? 'default' : 'outline'}
          className="cursor-pointer hover:border-primary/50 transition-smooth flex items-center gap-1.5"
          onClick={() => setSortBy('recent')}
        >
          <Clock size={14} />
          Recent
        </Badge>
        <Badge
          variant={sortBy === 'relevant' ? 'default' : 'outline'}
          className="cursor-pointer hover:border-primary/50 transition-smooth flex items-center gap-1.5"
          onClick={() => setSortBy('relevant')}
        >
          <TrendingUp size={14} />
          Relevant
        </Badge>
        <Badge
          variant={sortBy === 'activity' ? 'default' : 'outline'}
          className="cursor-pointer hover:border-primary/50 transition-smooth flex items-center gap-1.5"
          onClick={() => setSortBy('activity')}
        >
          <Sparkles size={14} />
          Activity
        </Badge>
      </div>

      <CreatePostComponent />

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <Skeleton variant="avatar" />
                <div className="flex-1 space-y-3">
                  <Skeleton variant="title" />
                  <Skeleton className="h-20" />
                  <div className="flex gap-3">
                    <Skeleton variant="button" />
                    <Skeleton variant="button" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : allPosts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No signals yet"
          description="Be the first to share your journey with the community. Post about your achievements, projects, or insights."
          action={
            <button className="text-primary hover:underline font-body-sm text-body-sm">
              Create your first post
            </button>
          }
        />
      ) : (
        <>
          <div className="space-y-6">
            {allPosts.map((post, index) => (
              <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <PostCard
                  post={post}
                  currentUser={user}
                  onLike={handleLike}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  formatTime={formatTime}
                />
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-8 py-3 bg-primary-container/40 border border-nebula-stroke text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-primary-container/60 hover:border-primary/30 transition-smooth disabled:opacity-50 flex items-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <EventHorizon variant="spinner" size={20} />
                    Loading...
                  </>
                ) : (
                  'Load More Signals'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
