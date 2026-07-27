import { supabase } from '../lib/supabase'

export function getUserCourses(profileId) {
  return supabase
    .from('user_courses')
    .select('*')
    .eq('profile_id', profileId)
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function enrollCourse(profileId, courseId) {
  return supabase
    .from('user_courses')
    .insert({ profile_id: profileId, course_id: String(courseId), status: 'enrolled', progress: 0 })
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function updateCourseProgress(profileId, courseId, progress) {
  const status = progress >= 100 ? 'completed' : 'in_progress'
  const payload = { progress, status }
  if (status === 'completed') payload.completed_at = new Date().toISOString()
  return supabase
    .from('user_courses')
    .update(payload)
    .eq('profile_id', profileId)
    .eq('course_id', String(courseId))
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function getEnrolledCourseIds(profileId) {
  return supabase
    .from('user_courses')
    .select('course_id')
    .eq('profile_id', profileId)
    .then(({ data, error }) => {
      if (error) throw error
      return new Set((data || []).map(r => r.course_id))
    })
}

export const api = { getUserCourses, enrollCourse, updateCourseProgress, getEnrolledCourseIds }
