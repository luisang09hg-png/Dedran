import { supabase } from '../lib/supabase'

export function getUserConversations(userId) {
  return supabase.rpc('get_user_conversations', { user_uuid: userId }).then(({ data, error }) => {
    if (error) throw error
    return data || []
  })
}

export function getConversationMessages(convId, limit = 50, offset = 0) {
  return supabase.rpc('get_conversation_messages', {
    conv_uuid: convId,
    limit_count: limit,
    offset_count: offset,
  }).then(({ data, error }) => {
    if (error) throw error
    return data || []
  })
}

export function markConversationRead(convId, userId) {
  return supabase.rpc('mark_conversation_read', { conv_uuid: convId, user_uuid: userId }).then(({ error }) => {
    if (error) throw error
  })
}

export function getOrCreateDirectConversation(user1Id, user2Id) {
  return supabase.rpc('get_or_create_direct_conversation', {
    user1_id: user1Id,
    user2_id: user2Id,
  }).then(({ data, error }) => {
    if (error) throw error
    return data
  })
}

export function sendMessage(conversationId, senderId, content) {
  return supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select(`
      *,
      sender:profiles!sender_id(id, full_name, username, avatar_url)
    `)
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function subscribeToMessages(userId, onChange) {
  const channel = supabase
    .channel(`messages:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `sender_id=neq.${userId}`,
    }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export function subscribeToConversationParticipants(userId, onChange) {
  const channel = supabase
    .channel(`conversation_participants:${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'conversation_participants',
      filter: `user_id=eq.${userId}`,
    }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}