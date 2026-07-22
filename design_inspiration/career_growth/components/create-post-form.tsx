'use client'

import { useState } from 'react'
import { createPost } from '@/app/actions/posts'
import { Zap } from 'lucide-react'

export function CreatePostForm() {
  const [content, setContent] = useState('')
  const [type, setType] = useState<'regular' | 'temporary'>('regular')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      await createPost(content, type)
      setContent('')
      setType('regular')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-foreground mb-3">
          Share Your Achievement
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What&apos;s on your mind? Share your latest project, skill, or milestone..."
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={type === 'regular'}
                onChange={() => setType('regular')}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Regular Post</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={type === 'temporary'}
                onChange={() => setType('temporary')}
                className="w-4 h-4"
              />
              <span className="flex items-center gap-1 text-sm text-secondary">
                <Zap className="w-4 h-4 text-yellow-500" />
                Temporary (6 hours)
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  )
}
