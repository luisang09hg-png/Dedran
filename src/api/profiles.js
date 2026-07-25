import { supabase } from '../lib/supabase'

export function getProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single().then(({ data, error }) => {
    if (error) throw error
    return data
  })
}

export function updateProfile(profileData) {
  return supabase.from('profiles').upsert(profileData).then(({ data, error }) => {
    if (error) throw error
    return data
  })
}

export function getProfileStats(userId) {
  return Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('applicant_id', userId),
  ]).then(([connectionsRes, applicationsRes]) => {
    if (connectionsRes.error) throw connectionsRes.error
    if (applicationsRes.error) throw applicationsRes.error
    return { connections: connectionsRes.count || 0, applications: applicationsRes.count || 0 }
  })
}

export function uploadAvatar(userId, file) {
  return supabase.storage.from('avatars').upload(`${userId}/avatar.jpg`, file, { upsert: true })
    .then(({ data, error }) => {
      if (error) throw error
      return supabase.storage.from('avatars').getPublicUrl(data.path).then(({ data }) => data.publicUrl)
    })
}