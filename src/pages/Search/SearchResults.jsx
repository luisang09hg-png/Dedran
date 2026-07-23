import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, X, Loader2, User, Briefcase, Hash, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import PostCard from '../feed/PostCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState({ people: [], posts: [], jobs: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SEARCH_TYPES = [
    { value: 'all', label: 'Todo', icon: Search },
    { value: 'people', label: 'Personas', icon: User },
    { value: 'jobs', label: 'Empleos', icon: Briefcase },
    { value: 'posts', label: 'Publicaciones', icon: Hash },
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
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-8">
      {/* Search Header */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar personas, empleos, publicaciones..."
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-12 py-3 pr-12 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {SEARCH_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-label-md whitespace-nowrap transition-all ${
                  type === t.value
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {query && (
            <p className="text-label-sm text-on-surface-variant">
              {totalResults > 0 
                ? `Encontrados ${totalResults} resultado${totalResults !== 1 ? 's' : ''} para "${query}"`
                : `No se encontraron resultados para "${query}"`
              }
            </p>
          )}
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-6" aria-busy="true">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-variant" />
                <div className="flex-1">
                  <div className="h-4 w-3/12 rounded bg-surface-variant" />
                  <div className="h-3 w-2/12 rounded bg-surface-variant mt-1" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 w-full rounded bg-surface-variant" />
                <div className="h-6 w-5/6 rounded bg-surface-variant" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-error text-body-md">Error al buscar: {error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {type === 'all' || type === 'people' ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-headline-md font-headline-md text-on-surface">Personas ({results.people.length})</h2>
              </div>
              {results.people.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <User className="text-on-surface-variant/50 mx-auto mb-4" size={48} />
                  <p className="text-body-md text-on-surface-variant">No se encontraron personas</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.people.map(person => (
                    <div key={person.id} className="glass-card rounded-xl p-4 flex items-center gap-4 hover:bg-surface-container-highest/50 transition-colors">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30 flex-shrink-0">
                        {person.avatar_url ? (
                          <img src={person.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-label-md font-bold text-primary">
                              {person.full_name?.[0]?.toUpperCase() || person.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md font-semibold text-on-surface truncate">
                          {person.full_name || person.username}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          @{person.username}
                        </p>
                        {person.headline && (
                          <p className="text-label-sm text-on-surface-variant/70 truncate mt-0.5">
                            {person.headline}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {type === 'all' || type === 'posts' ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-headline-md font-headline-md text-on-surface">Publicaciones ({results.posts.length})</h2>
              </div>
              {results.posts.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Hash className="text-on-surface-variant/50 mx-auto mb-4" size={48} />
                  <p className="text-body-md text-on-surface-variant">No se encontraron publicaciones</p>
                </div>
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
                        if (diff < 60) return 'Ahora';
                        if (diff < 3600) return `Hace ${Math.floor(diff/60)}m`;
                        if (diff < 86400) return `Hace ${Math.floor(diff/3600)}h`;
                        if (diff < 604800) return `Hace ${Math.floor(diff/86400)}d`;
                        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {type === 'all' || type === 'jobs' ? (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-headline-md font-headline-md text-on-surface">Empleos ({results.jobs.length})</h2>
              </div>
              {results.jobs.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Briefcase className="text-on-surface-variant/50 mx-auto mb-4" size={48} />
                  <p className="text-body-md text-on-surface-variant">No se encontraron ofertas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.jobs.map(job => (
                    <div key={job.id} className="glass-card rounded-xl p-5 border border-outline-variant/30 hover:border-primary/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
                          <Briefcase size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-body-lg font-bold text-on-surface truncate">{job.title}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-primary-container/30 text-primary text-[10px] font-label-sm">
                              {job.experience_level}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-[10px] font-label-sm">
                              {job.contract_type}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary text-[10px] font-label-sm">
                              {job.remote_type}
                            </span>
                          </div>
                          <p className="text-body-sm text-on-surface-variant truncate mb-2">{job.description.slice(0, 150)}...</p>
                          <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
                            <span className="flex items-center gap-1">
                              {job.company?.full_name || 'Empresa'}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1">{job.location}</span>
                            )}
                            {job.salary_min && job.salary_max && (
                              <span className="flex items-center gap-1 text-primary font-label-md">
                                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}/{job.currency || 'USD'}
                              </span>
                            )}
                          </div>
                          {job.skills_required?.length && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {job.skills_required.slice(0, 5).map(skill => (
                                <span key={skill} className="px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/30 text-label-sm text-on-surface-variant">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchResults;