import { supabase } from '../lib/supabase'

export function getCertifications(profileId) {
  return supabase
    .from('certifications')
    .select('*')
    .eq('profile_id', profileId)
    .order('issue_date', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function createCertification(data) {
  return supabase
    .from('certifications')
    .insert(data)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function updateCertification(id, data) {
  return supabase
    .from('certifications')
    .update(data)
    .eq('id', id)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function deleteCertification(id) {
  return supabase
    .from('certifications')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) throw error
    })
}

export const api = { getCertifications, createCertification, updateCertification, deleteCertification }
