"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/profiles'

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
    queryFn: () => userId ? api.getProfileStats(userId) : Promise.resolve(null),
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