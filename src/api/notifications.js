import { supabase } from '../lib/supabase'

export function getNotifications(userId, page = 0, limit = 20) {
  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
    .then(({ data, error }) => {
      if (error) throw error
      return { notifications: data || [], hasMore: (data?.length || 0) === limit }
    })
}

export function getUnreadCount(userId) {
  return supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .then(({ count, error }) => {
      if (error) throw error
      return count || 0
    })
}

export function markAsRead(notificationId) {
  return supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .then(({ error }) => {
      if (error) throw error
    })
}

export function markAllAsRead(userId) {
  return supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .then(({ error }) => {
      if (error) throw error
    })
}

export function insertNotification(notification) {
  return supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function subscribeToNotifications(userId, onChange) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}