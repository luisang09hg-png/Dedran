import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import GlassCard from '../ui/GlassCard';
import { useUIStore } from '../../stores/useUIStore'
import { useCreatePost } from "../../hooks/usePosts";

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content is required')
    .max(500, 'Post content cannot exceed 500 characters'),
})

export const CreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useUIStore()
  const createPostMutation = useCreatePost()

  // Se remueve <CreatePostFormData>
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

  // Se remueve la anotación de tipo `: CreatePostFormData`
  const handleCreatePost = async (data) => {
    setIsSubmitting(true)

    try {
      await createPostMutation.mutateAsync(data)

      reset()
      addToast('Post created successfully!', 'success')
    } catch (error) {
      console.error('Failed to create post:', error)
      addToast('Failed to create post. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchContent = watch('content') || ''

  return (
    <GlassCard className='p-6'>
      <div className='relative'>
        <form onSubmit={handleSubmit(handleCreatePost)}>
          <textarea
            placeholder='Share your thoughts...'
            className='w-full resize-none border-none bg-transparent p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0'
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
            {...register('content')}
          />

          <div className='mt-4 flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              {500 - watchContent.length} characters remaining
            </div>

            <button
              type='submit'
              disabled={!isValid || isSubmitting || watchContent.length === 0}
              className='rounded-full bg-[#7f53ac] px-8 py-2 font-medium text-white transition-all duration-200 hover:bg-[#7048a0] disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {errors.content && (
          <div className='mt-2 text-sm text-red-400'>{errors.content.message}</div>
        )}
      </div>
    </GlassCard>
  )
}