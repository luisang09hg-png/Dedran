import React from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { CreatePost as CreatePostComponent } from '../../components/posts/CreatePost'
import { usePosts } from '../../hooks/usePosts'

const SkeletonPost = () => {
  return (
    <GlassCard className='p-6 animate-pulse'>
      <div className='flex items-start gap-4'>
        <div className='h-10 w-10 rounded-full bg-muted-foreground/20' />
        <div className='flex-1 space-y-4'>
          <div className='h-4 w-3/4 rounded bg-muted-foreground/20' />
          <div className='h-3 w-full rounded bg-muted-foreground/20' />
          <div className='h-3 w-5/6 rounded bg-muted-foreground/20' />
        </div>
      </div>
      <div className='mt-4 flex gap-4 pl-14'>
        <div className='h-4 w-16 rounded bg-muted-foreground/20' />
        <div className='h-4 w-16 rounded bg-muted-foreground/20' />
        <div className='h-4 w-16 rounded bg-muted-foreground/20' />
      </div>
    </GlassCard>
  )
}

export const Feed = () => {
  const { data: posts, isLoading, isError } = usePosts()

  if (isError) {
    return (
      <div className='mx-auto max-w-2xl rounded-lg bg-red-900/20 p-6 text-red-400'>
        <h2 className='mb-2 text-xl font-semibold'>Failed to load feed</h2>
        <p>Please try again later.</p>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-2xl space-y-6 p-4'>
      <div className='mb-6'>
        <CreatePostComponent />
      </div>

      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => <SkeletonPost key={index} />)
        : posts?.map((post) => (
            <GlassCard key={post.id} className='p-6'>
              <div className='flex items-start gap-4'>
                <img
                  src={post.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.name || 'User'}`}
                  alt={post.author?.name || 'User'}
                  className='h-10 w-10 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <span className='font-medium text-foreground'>{post.author?.name || 'Anonymous'}</span>
                    <span className='text-sm text-muted-foreground'>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className='whitespace-pre-wrap break-words text-foreground'>{post.content}</p>
                </div>
              </div>
              <div className='mt-4 flex gap-6 pl-14'>
                <button className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary'>
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14 10l-2 1m0 0l-2-1m2 1l2-1m2 4l-2 1m2-4l2 1m-2-1v2m0-4V8m0 0l2 1m-2-1l-2 1'
                    />
                  </svg>
                  <span>Like</span>
                </button>
                <button className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary'>
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                  <span>Comment</span>
                </button>
                <button className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary'>
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-1.342m0 2.684l-5.132 2.732'
                    />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </GlassCard>
          ))}
    </div>
  )
}