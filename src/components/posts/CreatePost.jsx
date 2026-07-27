import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../hooks/useAuth'
import { useCreatePost, useUploadPostMedia } from '../../hooks/usePosts'
import { useUIStore } from '../../stores/useUIStore'
import GlassCard from '../ui/GlassCard'
import Button from '../ui/Button'
import { Image, X, Loader2 } from 'lucide-react'

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content is required')
    .max(500, 'Post content cannot exceed 500 characters'),
})

export const CreatePost = () => {
  const { user } = useAuth()
  const { addToast } = useUIStore()
  const createPostMutation = useCreatePost()
  const uploadMediaMutation = useUploadPostMedia()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(createPostSchema),
    mode: 'onChange',
  })

  const handleMediaSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      addToast('Only image files are allowed', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error')
      return
    }
    setMediaFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setMediaPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCreatePost = async (data) => {
    if (!user) return
    setIsSubmitting(true)

    try {
      let mediaUrls = []
      if (mediaFile) {
        setUploadingMedia(true)
        const url = await uploadMediaMutation.mutateAsync({ userId: user.id, file: mediaFile })
        mediaUrls = [url]
        setUploadingMedia(false)
      }

      await createPostMutation.mutateAsync({
        author_id: user.id,
        content: data.content,
        type: 'post',
        media_urls: mediaUrls,
        is_published: true,
      })

      reset()
      removeMedia()
      addToast('Post created successfully!', 'success')
    } catch (error) {
      console.error('Failed to create post:', error)
      addToast('Failed to create post. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
      setUploadingMedia(false)
    }
  }

  const watchContent = watch('content') || ''

  return (
    <GlassCard className="p-6" hover={false}>
      <form onSubmit={handleSubmit(handleCreatePost)}>
        <textarea
          placeholder="Share your thoughts..."
          className="w-full resize-none border-none bg-transparent p-4 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-0 font-body-md text-body-md"
          rows={3}
          maxLength={500}
          disabled={isSubmitting}
          {...register('content')}
        />

        {mediaPreview && (
          <div className="relative mb-4 inline-block">
            <img src={mediaPreview} alt="" className="max-h-48 rounded-lg object-cover" />
            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-on-surface hover:bg-background transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || uploadingMedia}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm"
            >
              <Image size={18} />
              Media
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleMediaSelect}
              className="hidden"
            />
            <span className="text-on-surface-variant font-body-sm text-body-sm">
              {500 - watchContent.length} characters remaining
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!isValid || isSubmitting || uploadingMedia || watchContent.length === 0}
          >
            {isSubmitting || uploadingMedia ? (
              <><Loader2 size={14} className="animate-spin" /> Posting</>
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </form>

      {errors.content && (
        <div className="mt-2 text-body-sm bg-error-container text-on-error-container px-3 py-2 rounded">
          {errors.content.message}
        </div>
      )}
    </GlassCard>
  )
}
