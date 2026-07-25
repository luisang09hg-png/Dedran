import { supabase } from '../lib/supabase'

export function createConversation(type, createdBy, options = {}) {
  return supabase
    .from('conversations')
    .insert({ type, created_by: createdBy, ...options })
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function addParticipant(conversationId, userId, role = 'member') {
  return supabase
    .from('conversation_participants')
    .insert({ conversation_id: conversationId, user_id: userId, role })
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function removeParticipant(conversationId, userId) {
  return supabase
    .from('conversation_participants')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .then(({ error }) => {
      if (error) throw error
    })
}

export function updateConversation(conversationId, updates) {
  return supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function deleteConversation(conversationId) {
  return supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .then(({ error }) => {
      if (error) throw error
    })
}

export function subscribeToConversation(conversationId, onChange) {
  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'conversations',
      filter: `id=eq.${conversationId}`,
    }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export function subscribeToParticipants(conversationId, onChange) {
  const channel = supabase
    .channel(`conversation_participants:${conversationId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'conversation_participants',
      filter: `conversation_id=eq.${conversationId}`,
    }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}