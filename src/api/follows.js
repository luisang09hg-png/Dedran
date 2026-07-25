import { supabase } from '../lib/supabase'

export function getFollowStatus(followerId, followingId) {
  return supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error && error.code !== 'PGRST116') throw error
      return !!data
    })
}

export function follow(followerId, followingId) {
  return supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function unfollow(followerId, followingId) {
  return supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .then(({ data, error }) => {
      if (error) throw error
      return data
    })
}

export function toggleFollow(followerId, followingId, currentlyFollowing) {
  if (currentlyFollowing) {
    return unfollow(followerId, followingId)
  }
  return follow(followerId, followingId)
}