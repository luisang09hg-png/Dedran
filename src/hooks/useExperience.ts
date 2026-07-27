import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/experience'

export function useExperience(profileId) {
  return useQuery({
    queryKey: ['experience', profileId],
    queryFn: () => api.getExperience(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.createExperience(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.profile_id] })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.updateExperience(id, data),
    onSuccess: (data) => {
      if (data?.profile_id) {
        queryClient.invalidateQueries({ queryKey: ['experience', data.profile_id] })
      }
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, profileId }) => api.deleteExperience(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience', variables.profileId] })
    },
  })
}
