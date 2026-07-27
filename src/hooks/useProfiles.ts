"use client";

import { useEffect } from 'react'
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
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  website_url: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  linkedin_url: z.string()
    .url('Must be a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github_url: z.string()
    .url('Must be a valid GitHub URL')
    .optional()
    .or(z.literal('')),
  twitter_url: z.string()
    .url('Must be a valid Twitter URL')
    .optional()
    .or(z.literal('')),
  skills: z.array(z.string())
    .max(20, 'You can add up to 20 skills'),
  avatar_url: z.string().optional().or(z.literal('')),
  banner_url: z.string().optional().or(z.literal(''))
})

export { profileSchema }

// Original hooks remain unchanged
export function useProfile(userId) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userId ? api.getProfile(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useProfileByUsername(username) {
  return useQuery({
    queryKey: ['profile', 'username', username],
    queryFn: () => username ? api.getProfileByUsername(username) : Promise.resolve(null),
    enabled: !!username,
    staleTime: 2 * 60 * 1000,
  })
}

export function useProfileStats(userId) {
  return useQuery({
    queryKey: ['profile', 'stats', userId],
    queryFn: () => userId ? api.getProfileStats(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, file }) =>
      api.uploadAvatar(userId, file),
    onSuccess: (url, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.userId] })
    },
  })
}

export function useUploadBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, file }) =>
      api.uploadBanner(userId, file),
    onSuccess: (url, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.userId] })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profileData) => api.updateProfile(profileData),
    onSuccess: (data) => {
      // Update cache optimistically
      if (data?.id) {
        queryClient.setQueryData(['profile', data.id], data)
        queryClient.invalidateQueries({ queryKey: ['profile', 'stats', data.id] })
      }
    },
  })
}

// Hook for Profile Form Management
export function useProfileForm(userId) {
  const queryClient = useQueryClient()
  const profileQuery = useProfile(userId)
  const updateProfileMutation = useUpdateProfile()
  const uploadAvatarMutation = useUploadAvatar()
  const uploadBannerMutation = useUploadBanner()

  const form = useForm({
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
      avatar_url: '',
      banner_url: '',
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
        avatar_url: profileData.avatar_url || '',
        banner_url: profileData.banner_url || '',
      })
    }
  }, [profileQuery.data, form.reset])

  const handleSubmit = async (data) => {
    if (!userId) return

    try {
      // Prepare profile data
      const profileData = {
        id: userId,
        ...data,
        avatar_url: data.avatar_url || profileQuery.data?.avatar_url || null,
        banner_url: data.banner_url || profileQuery.data?.banner_url || null,
        updated_at: new Date().toISOString(),
      }

      // Update profile
      await updateProfileMutation.mutateAsync(profileData)

      return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const uploadAvatar = async (file) => {
    if (!userId) return

    try {
      const avatarUrl = await uploadAvatarMutation.mutateAsync({ userId, file })
      return avatarUrl
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  const addSkill = (skill) => {
    const currentSkills = form.getValues('skills') || []
    if (!skill || currentSkills.includes(skill)) return

    const newSkills = [...currentSkills, skill]
    form.setValue('skills', newSkills)
  }

  const removeSkill = (skillToRemove) => {
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
    isUploadingBanner: uploadBannerMutation.isPending,

    // Actions
    addSkill,
    removeSkill,
    uploadAvatar,
    uploadBanner: async (file) => {
      if (!userId) return
      try {
        const bannerUrl = await uploadBannerMutation.mutateAsync({ userId, file })
        return bannerUrl
      } catch (error) {
        console.error('Banner upload error:', error)
        throw error
      }
    },

    // Reset form helper
    resetForm: form.reset,
  }
}