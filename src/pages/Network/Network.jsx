import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Users, UserPlus, UserMinus, Search, Loader2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import EventHorizon from '../../components/ui/EventHorizon';

const Network = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchConnections = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      const followedIds = (follows || []).map(f => f.following_id);
      setFollowing(new Set(followedIds));

      const { data: followers } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', user.id);
      const followerIds = (followers || []).map(f => f.follower_id);
      const allIds = [...new Set([...followedIds, ...followerIds, user.id])];

      if (allIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, headline, skills, role')
          .in('id', allIds);
        setConnections(profiles || []);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline, skills, role')
        .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,headline.ilike.%${searchQuery}%`)
        .limit(20);
      setSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (targetId, currentlyFollowing) => {
    if (!user) return;
    try {
      if (currentlyFollowing) {
        await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetId);
      } else {
        await supabase.from('follows').insert({ follower_id: user.id, following_id: targetId });
      }
      setFollowing(prev => {
        const next = new Set(prev);
        currentlyFollowing ? next.delete(targetId) : next.add(targetId);
        return next;
      });
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const renderUserCard = (profile) => {
    const isFollowing = following.has(profile.id);
    const isSelf = profile.id === user?.id;

    return (
      <GlassCard key={profile.id} className="p-4 flex items-center gap-4 transition-all hover:bg-primary-container/30" hover={false}>
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-nebula-stroke shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users size={20} className="text-on-surface-variant/50" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body-md text-body-md font-semibold text-on-surface truncate">
            {profile.full_name || profile.username}
          </p>
          <p className="font-label-caps text-label-caps text-on-surface-variant truncate">
            @{profile.username}
          </p>
          {profile.headline && (
            <p className="font-body-sm text-body-sm text-on-surface-variant/70 truncate mt-0.5">
              {profile.headline}
            </p>
          )}
        </div>
        {!isSelf && (
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => handleFollow(profile.id, isFollowing)}
          >
            {isFollowing ? <UserMinus size={14} /> : <UserPlus size={14} />}
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </GlassCard>
    );
  };

  return (
    <div className="space-y-stack-lg pb-stack-lg">
      <div>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-stack-sm">Network</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Discover and connect with professionals across the galaxy.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, skill, or interest..."
          className="w-full bg-background border border-outline-variant rounded-lg pl-9 pr-4 py-2.5 text-on-surface text-body-sm focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none transition-all placeholder:text-on-surface-variant"
        />
        <button type="submit" className="hidden">Search</button>
      </form>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Search Results</h2>
          {searching ? (
            <div className="flex justify-center py-8"><EventHorizon variant="spinner" size={32} /></div>
          ) : searchResults.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Users size={48} className="mx-auto text-on-surface-variant/30 mb-3" />
              <p className="font-body-md text-body-md text-on-surface-variant">No users found matching "{searchQuery}"</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.filter(p => p.id !== user?.id).map(renderUserCard)}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-nebula-stroke flex gap-6 overflow-x-auto">
        {['connections', 'discover'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 border-b-2 font-headline-sm text-headline-sm transition-colors capitalize whitespace-nowrap ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'connections' && (
        <>
          {loading ? (
            <div className="flex justify-center py-12"><EventHorizon variant="spinner" size={40} /></div>
          ) : connections.length === 0 ? (
            <GlassCard className="p-8 md:p-12 text-center">
              <Users size={64} className="mx-auto text-on-surface-variant/20 mb-4" />
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">No connections yet</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Use the search above to discover and connect with other professionals.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {connections.filter(p => p.id !== user?.id).map(renderUserCard)}
            </div>
          )}
        </>
      )}

      {activeTab === 'discover' && (
        <GlassCard className="p-8 md:p-12 text-center">
          <Users size={64} className="mx-auto text-on-surface-variant/20 mb-4" />
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Discover People</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            Search for professionals by name, skills, or interests above to expand your network.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Pro tip: Try searching by skills like "React", "Python", or "Design".
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default Network;
