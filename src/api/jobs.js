import { supabase } from '../lib/supabase'

export function getActiveJobs() {
  return supabase
    .from('jobs')
    .select(`
      *,
      company:profiles!company_id (id, full_name, username, avatar_url, headline)
    `)
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function getJob(jobId) {
  return supabase
    .from('jobs')
    .select(`
      *,
      company:profiles!company_id (id, full_name, username, avatar_url, headline)
    `)
    .eq('id', jobId)
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function applyToJob(jobId, applicantId, data = {}) {
  return supabase
    .from('job_applications')
    .insert({ job_id: jobId, applicant_id: applicantId, ...data })
    .select()
    .single()
    .then(({ data: result, error }) => {
      if (error) throw error
      return result
    })
}

export function deleteApplication(jobId, applicantId) {
  return supabase
    .from('job_applications')
    .delete()
    .eq('job_id', jobId)
    .eq('applicant_id', applicantId)
    .eq('status', 'pending')
    .then(({ error }) => {
      if (error) throw error
    })
}

export function subscribeToJobs(onChange) {
  const channel = supabase
    .channel('jobs_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}