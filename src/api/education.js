import { supabase } from '../lib/supabase'

export function getEducation(profileId) {
  return supabase
    .from('education')
    .select('*')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function createEducation(data) {
  return supabase
    .from('education')
    .insert(data)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function updateEducation(id, data) {
  return supabase
    .from('education')
    .update(data)
    .eq('id', id)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function deleteEducation(id) {
  return supabase
    .from('education')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) throw error
    })
}

export const api = { getEducation, createEducation, updateEducation, deleteEducation }
