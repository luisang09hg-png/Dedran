import { supabase } from '../lib/supabase'

export function getComments(postId) {
  return supabase
    .from('comments')
    .select(`
      *,
      author:profiles!author_id (
        id, full_name, username, avatar_url, headline
      )
    `)
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function createComment(postId, userId, content) {
  return supabase
    .from('comments')
    .insert({ post_id: postId, author_id: userId, content })
    .select(`
      *,
      author:profiles!author_id (
        id, full_name, username, avatar_url, headline
      )
    `)
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function deleteComment(commentId) {
  return supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .then(({ error }) => {
      if (error) throw error
    })
}

export const api = { getComments, createComment, deleteComment }
