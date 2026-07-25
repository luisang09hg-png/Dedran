"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/auth'

export function useAuth() {
  const queryClient = useQueryClient()

  const authQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => api.getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 1
    },
    initialData: null, // Handle null/undefined cases
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.signIn(email, password),
    onSuccess: (data) => {
      // Invalidate auth query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error) => {
      // Handle error (toast notification would go here)
      console.error('Login failed:', error)
    },
  })

  const registerMutation = useMutation({
    mutationFn: ({ email, password, fullName }: { email: string; password: string; fullName: string }) =>
      api.signUp(email, password, fullName),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: (updates: any) => api.updateUser(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data)
    },
  })

  const subscribeToAuth = (callback: (user: any | null) => void) => {
    return api.subscribeToAuth(callback)
  }

  return {
    user: authQuery.data,
    isLoading: authQuery.isLoading,
    isError: authQuery.isError,
    error: authQuery.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    updateUser: updateUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,

    subscribeToAuth,
  }
}