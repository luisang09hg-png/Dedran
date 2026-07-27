import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/certifications'

export function useCertifications(profileId) {
  return useQuery({
    queryKey: ['certifications', profileId],
    queryFn: () => api.getCertifications(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateCertification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.createCertification(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certifications', variables.profile_id] })
    },
  })
}

export function useUpdateCertification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.updateCertification(id, data),
    onSuccess: (data) => {
      if (data?.profile_id) {
        queryClient.invalidateQueries({ queryKey: ['certifications', data.profile_id] })
      }
    },
  })
}

export function useDeleteCertification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, profileId }) => api.deleteCertification(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certifications', variables.profileId] })
    },
  })
}
