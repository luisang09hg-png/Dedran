import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, UserCheck, UserX, Loader2 } from 'lucide-react';

const FollowButton = ({ 
  targetUserId, 
  currentUserId, 
  initialFollowersCount = 0,
  initialFollowing = false,
  size = 'md',
  showCount = true,
  onFollowChange 
}) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUserId && targetUserId && currentUserId !== targetUserId) {
      checkFollowStatus();
    }
  }, [currentUserId, targetUserId]);

  const checkFollowStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setFollowing(!!data);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId || loading) return;
    
    setLoading(true);
    setError(null);

    try {
      if (following) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);

        if (error) throw error;

        setFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        
        // Create notification for unfollow? Usually not needed
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: targetUserId,
          });

        if (error) throw error;

        setFollowing(true);
        setFollowersCount(prev => prev + 1);

        // Create notification for the followed user
        await supabase
          .from('notifications')
          .insert({
            user_id: targetUserId,
            actor_id: currentUserId,
            type: 'follow',
            reference_id: currentUserId,
            reference_type: 'profile',
            message: 'empezó a seguirte',
          });
      }

      if (onFollowChange) onFollowChange(!following, followersCount + (following ? -1 : 1));
    } catch (err) {
      setError(err.message);
      console.error('Error following/unfollowing:', err);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-label-sm gap-1.5',
    md: 'px-4 py-2 text-label-md gap-2',
    lg: 'px-6 py-3 text-label-lg gap-2.5',
  };

  const iconSize = { sm: 14, md: 16, lg: 20 }[size];

  if (currentUserId === targetUserId) {
    return null; // Don't show follow button on own profile
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-xl font-label-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${
        following
          ? 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-error/10 hover:border-error hover:text-error'
          : 'bg-primary-container text-on-primary-container hover:scale-[0.98]'
      }`}
      aria-pressed={following}
      aria-label={following ? 'Dejar de seguir' : 'Seguir'}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : following ? (
        <>
          <UserX size={iconSize} />
          <span>Dejar de seguir</span>
        </>
      ) : (
        <>
          <UserPlus size={iconSize} />
          <span>Seguir</span>
        </>
      )}
      
      {showCount && followersCount > 0 && (
        <span className="ml-1 font-semibold">{followersCount >= 1000 ? `${(followersCount/1000).toFixed(1)}k` : followersCount}</span>
      )}
    </button>
  );
};

export default FollowButton;