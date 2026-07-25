import { supabase } from '../lib/supabase'

export function getFeed(userId, page = 0, limit = 10) {
  return supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id (
        id, full_name, username, avatar_url, headline
      )
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
    .then(({ data, error }) => {
      if (error) throw error
      return data || []
    })
}

export function hasUserLiked(postId, userId) {
  return supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()
    .then(({ data, error }) => {
      if (error && error.code !== 'PGRST116') throw error
      return !!data
    })
}

export function likePost(postId, userId) {
  return supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId })
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function unlikePost(postId, userId) {
  return supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function toggleLike(postId, userId, currentlyLiked) {
  if (currentlyLiked) {
    return unlikePost(postId, userId)
  }
  return likePost(postId, userId)
}

export function createPost(postData) {
  return supabase
    .from('posts')
    .insert(postData)
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

export function deletePost(postId) {
  return supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .then(({ error }) => {
      if (error) throw error
    })
}

export function uploadPostMedia(userId, file) {
  const fileName = `${userId}/${Date.now()}_${file.name}`
  return supabase.storage.from('posts').upload(fileName, file, { upsert: false })
    .then(({ data, error }) => {
      if (error) throw error
      return supabase.storage.from('posts').getPublicUrl(data.path).then(({ data }) => data.publicUrl)
    })
}

export function subscribeToNewPosts(onChange) {
  const channel = supabase
    .channel('new_posts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export function subscribeToPostLikes(postId, onChange) {
  const channel = supabase
    .channel(`post_likes_${postId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes', filter: `post_id=eq.${postId}` }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}