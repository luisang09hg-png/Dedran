import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, X, Loader2, User, Briefcase, Hash, Filter, ChevronDown } from 'lucide-react';

const SEARCH_TYPES = [
  { value: 'all', label: 'Todo', icon: Search },
  { value: 'people', label: 'Personas', icon: User },
  { value: 'jobs', label: 'Empleos', icon: Briefcase },
  { value: 'posts', label: 'Publicaciones', icon: Hash },
];

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Buscar personas, empleos, publicaciones...',
  showFilters = true,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline')
        .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
        .eq('is_onboarding_complete', true)
        .limit(5);

      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, company:profiles!jobs_company_id_fkey(full_name)')
        .eq('is_active', true)
        .ilike('title', `%${searchQuery}%`)
        .limit(3);

      const { data: posts } = await supabase
        .from('posts')
        .select('id, content, author:profiles!author_id(username)')
        .eq('is_published', true)
        .ilike('content', `%${searchQuery}%`)
        .limit(3);

      setSuggestions({
        people: profiles || [],
        jobs: jobs || [],
        posts: posts || [],
      });
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), activeType);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item, type) => {
    let searchQuery = '';
    if (type === 'people') searchQuery = `@${item.username}`;
    else if (type === 'jobs') searchQuery = item.title;
    else if (type === 'posts') searchQuery = item.content.slice(0, 50);
    
    setQuery(searchQuery);
    onSearch(searchQuery, type === 'people' ? 'people' : type === 'jobs' ? 'jobs' : 'posts');
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch('', 'all');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-12 py-3 pr-12 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-on-surface-variant/50"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
            {SEARCH_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setActiveType(type.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-label-md whitespace-nowrap transition-all ${
                  activeType === type.value
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <type.icon size={14} />
                {type.label}
              </button>
            ))}
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.people?.length || suggestions.jobs?.length || suggestions.posts?.length) && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 animate-slide-down">
            {suggestions.people?.length > 0 && (
              <div className="p-3 border-b border-outline-variant/30">
                <p className="text-label-sm font-label-md text-on-surface-variant mb-2">Personas</p>
                <div className="space-y-2">
                  {suggestions.people.map(person => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => handleSuggestionClick(person, 'people')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-variant transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                        {person.avatar_url ? (
                          <img src={person.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-label-sm font-bold text-primary">
                              {person.full_name?.[0]?.toUpperCase() || person.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-on-surface truncate">
                          {person.full_name || person.username}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          @{person.username}
                        </p>
                        {person.headline && (
                          <p className="text-[11px] text-on-surface-variant/70 truncate mt-0.5">
                            {person.headline}
                          </p>
                        )}
                      </div>
                      <User size={16} className="text-on-surface-variant/50" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {suggestions.jobs?.length > 0 && (
              <div className="p-3 border-b border-outline-variant/30">
                <p className="text-label-sm font-label-md text-on-surface-variant mb-2">Empleos</p>
                <div className="space-y-2">
                  {suggestions.jobs.map(job => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => handleSuggestionClick(job, 'jobs')}
                      className="w-full p-2 rounded-xl hover:bg-surface-variant transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-semibold text-on-surface truncate">
                            {job.title}
                          </p>
                          <p className="text-label-sm text-on-surface-variant truncate">
                            {job.company?.full_name || 'Empresa'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {suggestions.posts?.length > 0 && (
              <div className="p-3">
                <p className="text-label-sm font-label-md text-on-surface-variant mb-2">Publicaciones</p>
                <div className="space-y-2">
                  {suggestions.posts.map(post => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => handleSuggestionClick(post, 'posts')}
                      className="w-full p-2 rounded-xl hover:bg-surface-variant transition-colors text-left"
                    >
                      <div className="flex items-start gap-2">
                        <Hash size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-label-sm text-on-surface-variant truncate">
                            @{post.author?.username}
                          </p>
                          <p className="text-body-sm text-on-surface line-clamp-2 mt-0.5">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loadingSuggestions && (
              <div className="p-4 flex justify-center">
                <Loader2 size={20} className="text-primary animate-spin" />
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;