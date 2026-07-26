"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/profiles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// Profile update schema
const profileSchema = z.object({
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-z0-9_]+$/i, 'Username can only contain letters, numbers, and underscores'),
  headline: z.string()
    .max(100, 'Headline must be less than 100 characters')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  website_url: z.string()
    .url('Must be a valid URL')
    .optional(),
  linkedin_url: z.string()
    .url('Must be a valid LinkedIn URL')
    .optional(),
  github_url: z.string()
    .url('Must be a valid GitHub URL')
    .optional(),
  twitter_url: z.string()
    .url('Must be a valid Twitter URL')
    .optional(),
  skills: z.array(z.string())
    .max(20, 'You can add up to 20 skills')
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Original hooks remain unchanged
export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userId ? api.getProfile(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useProfileStats(userId: string | null) {
  return useQuery({
    queryKey: ['profile', 'stats', userId],
    queryFn: () => userId ? api.getProfileStats(userUserId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      api.uploadAvatar(userId, file),
    onSuccess: (url, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.userId] })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profileData: any) => api.updateProfile(profileData),
    onSuccess: (data) => {
      // Update cache optimistically
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile', 'stats', data.id] })
    },
  })
}

// Hook for Profile Form Management
export function useProfileForm(userId: string | null) {
  const queryClient = useQueryClient()
  const profileQuery = useProfile(userId)
  const updateProfileMutation = useUpdateProfile()
  const uploadAvatarMutation = useUploadAvatar()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      username: '',
      headline: '',
      bio: '',
      location: '',
      website_url: '',
      linkedin_url: '',
      github_url: '',
      twitter_url: '',
      skills: [],
    },
    mode: 'onChange',
  })

  // Load profile data into form when available
  useEffect(() => {
    if (profileQuery.data) {
      const profileData = profileQuery.data
      form.reset({
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        headline: profileData.headline || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website_url: profileData.website_url || '',
        linkedin_url: profileData.linkedin_url || '',
        github_url: profileData.github_url || '',
        twitter_url: profileData.twitter_url || '',
        skills: profileData.skills || [],
      })
    }
  }, [profileQuery.data, form.reset])

  const handleSubmit = async (data: ProfileFormData) => {
    if (!userId) return

    try {
      // Prepare profile data
      const profileData = {
        id: userId,
        ...data,
        avatar_url: null, // Avatar handled separately
        updated_at: new Date().toISOString(),
      }

      // Update profile
      await updateProfileMutation.mutateAsync(profileData)

      // Handle avatar upload if needed
      return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!userId) return

    try {
      const avatarUrl = await uploadAvatarMutation.mutateAsync({ userId, file })
      return avatarUrl
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  const addSkill = (skill: string) => {
    const currentSkills = form.getValues('skills') || []
    if (!skill || currentSkills.includes(skill)) return

    const newSkills = [...currentSkills, skill]
    form.setValue('skills', newSkills)
  }

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('skills') || []
    const newSkills = currentSkills.filter(skill => skill !== skillToRemove)
    form.setValue('skills', newSkills)
  }

  return {
    // Form state
    form,
    handleSubmit,

    // Profile data from query
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,

    // Mutation states
    isUpdating: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,

    // Actions
    addSkill,
    removeSkill,
    uploadAvatar,

    // Reset form helper
    resetForm: form.reset,
  }
}