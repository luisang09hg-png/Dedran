import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/courses'

export function useUserCourses(profileId) {
  return useQuery({
    queryKey: ['user_courses', profileId],
    queryFn: () => api.getUserCourses(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useEnrolledCourseIds(profileId) {
  return useQuery({
    queryKey: ['user_courses', 'ids', profileId],
    queryFn: () => api.getEnrolledCourseIds(profileId),
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useEnrollCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ profileId, courseId }) => api.enrollCourse(profileId, courseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_courses', variables.profileId] })
    },
  })
}

export function useUpdateCourseProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ profileId, courseId, progress }) => api.updateCourseProgress(profileId, courseId, progress),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_courses', variables.profileId] })
    },
  })
}
