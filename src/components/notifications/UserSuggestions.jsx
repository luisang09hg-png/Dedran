import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, UserCheck, Loader2, X } from 'lucide-react';
import FollowButton from './FollowButton';

const UserSuggestions = ({ 
  currentUserId, 
  limit = 5,
  excludeUserIds = [],
  title = 'Personas que podrías conocer',
  showTitle = true 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    fetchSuggestions();
  }, [currentUserId, limit, excludeUserIds.join(',')]);

  const fetchSuggestions = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      
      // Get current user's profile to match skills
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('skills, following:follows!follower_id(following_id)')
        .eq('id', currentUserId)
        .single();

      if (!currentProfile) return;

      const followingIds = currentProfile.following?.map(f => f.following_id) || [];
      const excludeIds = [...followingIds, currentUserId, ...excludeUserIds];

      // Get suggestions based on shared skills
      let query = supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline, skills, role')
        .eq('is_onboarding_complete', true)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(limit * 2);

      const { data, error } = await query;
      
      if (error) throw error;

      // Sort by shared skills count
      const userSkills = currentProfile.skills || [];
      const scored = (data || []).map(user => {
        const userSkills = user.skills || [];
        const sharedSkills = userSkills.filter(s => userSkills.includes(s)).length;
        return { ...user, sharedSkills };
      });

      scored.sort((a, b) => b.sharedSkills - a.sharedSkills);
      setSuggestions(scored.slice(0, limit));
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (userId) => {
    setDismissed(prev => new Set([...prev, userId]));
  };

  const handleFollow = (followed, newCount) => {
    // Update local state
    setSuggestions(prev => prev.map(u => 
      u.id === followed ? { ...u, followers_count: newCount } : u
    ));
  };

  const visibleSuggestions = suggestions.filter(u => !dismissed.has(u.id));

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-4">
        {showTitle && (
          <h3 className="text-label-lg font-label-lg text-on-surface mb-3">{title}</h3>
        )}
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-surface-variant" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-surface-variant rounded" />
                <div className="h-3 w-16 bg-surface-variant rounded mt-1" />
              </div>
              <div className="w-20 h-8 bg-surface-variant rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (visibleSuggestions.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4">
      {showTitle && (
        <h3 className="text-label-lg font-label-lg text-on-surface mb-3">{title}</h3>
      )}
      <div className="space-y-3">
        {visibleSuggestions.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center gap-3 group"
          >
            <button
              onClick={() => handleDismiss(user.id)}
              className="p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant/50 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
              aria-label="Ocultar sugerencia"
            >
              <X size={16} />
            </button>
            
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-label-md font-bold text-primary">
                      {user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-body-sm font-semibold text-on-surface truncate block">
                  {user.full_name || user.username}
                </span>
                <span className="text-label-sm text-on-surface-variant truncate block">
                  @{user.username}
                </span>
              </div>
              {user.headline && (
                <p className="text-label-sm text-on-surface-variant/80 truncate mt-0.5">
                  {user.headline}
                </p>
              )}
              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded-full bg-primary-container/30 text-primary text-[10px] font-label-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <FollowButton
              targetUserId={user.id}
              currentUserId={currentUserId}
              size="sm"
              showCount={false}
              onFollowChange={handleFollow}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSuggestions;