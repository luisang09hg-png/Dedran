import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/education'

export function useEducation(profileId) {
  return useQuery({
    queryKey: ['education', profileId],
    queryFn: () => api.getEducation(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.createEducation(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['education', variables.profile_id] })
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.updateEducation(id, data),
    onSuccess: (data) => {
      if (data?.profile_id) {
        queryClient.invalidateQueries({ queryKey: ['education', data.profile_id] })
      }
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, profileId }) => api.deleteEducation(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['education', variables.profileId] })
    },
  })
}
