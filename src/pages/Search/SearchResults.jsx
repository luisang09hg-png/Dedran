import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, X, Loader2, User, Briefcase, Hash, Filter, Sparkles, TrendingUp, MapPin, DollarSign } from 'lucide-react';
import PostCard from '../../components/feed/PostCard';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState({ people: [], posts: [], jobs: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SEARCH_TYPES = [
    { value: 'all', label: 'All', icon: Search },
    { value: 'people', label: 'People', icon: User },
    { value: 'jobs', label: 'Jobs', icon: Briefcase },
    { value: 'posts', label: 'Posts', icon: Hash },
  ];

  const search = useCallback(async (q, t) => {
    if (!q.trim()) {
      setResults({ people: [], posts: [], jobs: [] });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = { people: [], posts: [], jobs: [] };

      if (t === 'all' || t === 'people') {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, headline, skills, role')
          .or(`full_name.ilike.%${q}%,username.ilike.%${q}%,headline.ilike.%${q}%`)
          .eq('is_onboarding_complete', true)
          .limit(20);
        results.people = data || [];
      }

      if (t === 'all' || t === 'posts') {
        const { data } = await supabase
          .from('posts')
          .select(`
            *,
            author:profiles!author_id(id, full_name, username, avatar_url, headline)
          `)
          .eq('is_published', true)
          .ilike('content', `%${q}%`)
          .order('published_at', { ascending: false })
          .limit(20);
        results.posts = data || [];
      }

      if (t === 'all' || t === 'jobs') {
        const { data } = await supabase
          .from('jobs')
          .select(`
            *,
            company:profiles!company_id(id, full_name, username, avatar_url)
          `)
          .eq('is_active', true)
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .order('created_at', { ascending: false })
          .limit(20);
        results.jobs = data || [];
      }

      setResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const t = searchParams.get('type') || 'all';
    setQuery(q);
    setType(t);
    search(q, t);
  }, [searchParams, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (query.trim()) newParams.set('q', query.trim());
    if (type !== 'all') newParams.set('type', type);
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setQuery('');
    setType('all');
    setSearchParams({});
    setResults({ people: [], posts: [], jobs: [] });
  };

  const totalResults = results.people.length + results.posts.length + results.jobs.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2 flex items-center gap-3">
          <Sparkles size={28} className="text-primary" />
          Search
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Discover people, jobs, and content across the platform
        </p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, jobs, posts..."
              className="pl-12 pr-12"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-smooth"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={18} className="text-on-surface-variant shrink-0" />
            {SEARCH_TYPES.map(t => (
              <Badge
                key={t.value}
                variant={type === t.value ? 'default' : 'outline'}
                className="cursor-pointer hover:border-primary/50 transition-smooth shrink-0"
                onClick={() => setType(t.value)}
              >
                <t.icon size={14} />
                {t.label}
              </Badge>
            ))}
          </div>

          {query && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {totalResults > 0 
                ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}
        </form>
      </GlassCard>

      {/* Results */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <GlassCard key={i} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton variant="avatar" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="title" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center">
          <p className="text-error font-body-md text-body-md">Search error: {error}</p>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {type === 'all' || type === 'people' ? (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <User size={20} className="text-primary" />
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  People ({results.people.length})
                </h2>
              </div>
              {results.people.length === 0 ? (
                <EmptyState
                  icon={User}
                  title="No people found"
                  description="Try adjusting your search terms or filters"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.people.map(person => (
                    <GlassCard key={person.id} className="p-4 flex items-center gap-4 hover:border-primary/30 transition-smooth group">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30 flex-shrink-0">
                        {person.avatar_url ? (
                          <img src={person.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-container/20">
                            <span className="font-label-md font-bold text-primary">
                              {person.full_name?.[0]?.toUpperCase() || person.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body-md font-semibold text-on-surface truncate group-hover:text-primary transition-smooth">
                          {person.full_name || person.username}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                          @{person.username}
                        </p>
                        {person.headline && (
                          <p className="font-label-sm text-label-sm text-on-surface-variant/70 truncate mt-1 line-clamp-1">
                            {person.headline}
                          </p>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {type === 'all' || type === 'jobs' ? (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase size={20} className="text-primary" />
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Jobs ({results.jobs.length})
                </h2>
              </div>
              {results.jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs found"
                  description="Try different keywords or check back later for new opportunities"
                />
              ) : (
                <div className="space-y-4">
                  {results.jobs.map(job => (
                    <GlassCard key={job.id} className="p-5 hover:border-primary/30 transition-smooth">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center flex-shrink-0">
                          <Briefcase size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-body-lg font-bold text-on-surface">{job.title}</h3>
                            <Badge variant="outline" className="text-xs">{job.experience_level}</Badge>
                            <Badge variant="secondary" className="text-xs">{job.contract_type}</Badge>
                            <Badge variant="tertiary" className="text-xs">{job.remote_type}</Badge>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-2">{job.description}</p>
                          <div className="flex items-center gap-4 font-label-sm text-label-sm text-on-surface-variant mb-3">
                            <span className="flex items-center gap-1">
                              {job.company?.full_name || 'Company'}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {job.location}
                              </span>
                            )}
                            {job.salary_min && job.salary_max && (
                              <span className="flex items-center gap-1 text-primary font-label-md">
                                <DollarSign size={14} />
                                {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}/{job.currency || 'USD'}
                              </span>
                            )}
                          </div>
                          {job.skills_required?.length && (
                            <div className="flex flex-wrap gap-2">
                              {job.skills_required.slice(0, 5).map(skill => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {type === 'all' || type === 'posts' ? (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Hash size={20} className="text-primary" />
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Posts ({results.posts.length})
                </h2>
              </div>
              {results.posts.length === 0 ? (
                <EmptyState
                  icon={Hash}
                  title="No posts found"
                  description="Try searching for different keywords or browse the feed"
                />
              ) : (
                <div className="space-y-4">
                  {results.posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={null}
                      onLike={() => {}}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      formatTime={(date) => {
                        if (!date) return '';
                        const d = new Date(date);
                        const now = new Date();
                        const diff = Math.floor((now - d) / 1000);
                        if (diff < 60) return 'Just now';
                        if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
                        if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
                        if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
                        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {!loading && totalResults === 0 && query && (
            <EmptyState
              icon={Search}
              title="No results found"
              description={`We couldn't find anything matching "${query}". Try different keywords or browse our categories.`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;