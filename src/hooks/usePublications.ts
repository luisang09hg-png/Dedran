import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/publications'

export function usePublications(profileId) {
  return useQuery({
    queryKey: ['publications', profileId],
    queryFn: () => api.getPublications(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreatePublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.createPublication(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publications', variables.profile_id] })
    },
  })
}

export function useUpdatePublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.updatePublication(id, data),
    onSuccess: (data) => {
      if (data?.profile_id) {
        queryClient.invalidateQueries({ queryKey: ['publications', data.profile_id] })
      }
    },
  })
}

export function useDeletePublication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, profileId }) => api.deletePublication(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publications', variables.profileId] })
    },
  })
}
