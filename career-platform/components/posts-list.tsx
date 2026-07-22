'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Trash2, Zap } from 'lucide-react'
import { deletePost, likePost, unlikePost } from '@/app/actions/posts'
import Link from 'next/link'

interface Post {
  id: string
  userId: string
  content: string
  type: string | null
  expiresAt: Date | null
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface PostsListProps {
  posts: Post[]
  currentUserId: string
}

export function PostsList({ posts, currentUserId }: PostsListProps) {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<Set<string>>(new Set())

  const handleLike = async (postId: string) => {
    const newLiked = new Set(liked)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
      setLiked(newLiked)
      await unlikePost(postId)
    } else {
      newLiked.add(postId)
      setLiked(newLiked)
      await likePost(postId)
    }
  }

  const handleDelete = async (postId: string) => {
    setLoading(prev => new Set([...prev, postId]))
    try {
      await deletePost(postId)
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getTimeUntilExpire = (expiresAt: Date | null) => {
    if (!expiresAt) return null
    const now = new Date()
    const diffMinutes = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Expiring now'
    if (diffMinutes < 60) return `Expires in ${diffMinutes}m`
    const hours = Math.floor(diffMinutes / 60)
    return `Expires in ${hours}h`
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary text-lg">No posts yet. Be the first to share!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-secondary">{formatDate(post.createdAt)}</span>
                {post.type === 'temporary' && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-600">
                    <Zap className="w-3 h-3" />
                    {getTimeUntilExpire(post.expiresAt)}
                  </span>
                )}
              </div>
            </div>
            {post.userId === currentUserId && (
              <button
                onClick={() => handleDelete(post.id)}
                disabled={loading.has(post.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-foreground mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${liked.has(post.id) ? 'fill-primary text-primary' : 'group-hover:text-primary'}`}
              />
              <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
            </button>
            <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{Math.floor(Math.random() * 20)}</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
