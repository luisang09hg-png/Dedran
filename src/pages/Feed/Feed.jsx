import { useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePosts, useToggleLike } from '../../hooks/usePosts'
import { subscribeToNewPosts } from '../../api/posts'
import PostCard from '../../components/feed/PostCard'
import { CreatePost as CreatePostComponent } from '../../components/posts/CreatePost'
import EventHorizon from '../../components/ui/EventHorizon'
import { Users } from 'lucide-react'

export const Feed = () => {
  const { user } = useAuth()
  const userId = user?.id
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
      <CreatePostComponent />

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-primary-container/60 backdrop-blur-[12px] border border-nebula-stroke rounded-xl p-6">
              <div className="flex items-start gap-4">
                <EventHorizon variant="spinner" size={40} />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-on-surface-variant/20" />
                  <div className="h-3 w-full rounded bg-on-surface-variant/20" />
                  <div className="h-3 w-5/6 rounded bg-on-surface-variant/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-16">
          <Users size={64} className="mx-auto text-on-surface-variant/30 mb-4" />
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">No posts yet</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Be the first to share something!</p>
        </div>
      ) : (
        <>
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onLike={handleLike}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              formatTime={formatTime}
            />
          ))}

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-primary-container/40 border border-nebula-stroke text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-primary-container/60 transition-all disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <EventHorizon variant="spinner" size={20} /> Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
