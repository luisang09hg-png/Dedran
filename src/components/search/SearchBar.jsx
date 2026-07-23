import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Search, X, User, Hash, Briefcase, FileText, Code2, Trophy, Loader2 } from 'lucide-react';

const SEARCH_TYPES = [
  { value: 'all', label: 'Todo', icon: Search },
  { value: 'people', label: 'Personas', icon: User },
  { value: 'posts', label: 'Publicaciones', icon: Hash },
  { value: 'jobs', label: 'Empleos', icon: Briefcase },
];

const SearchBar = ({ 
  placeholder = 'Buscar personas, empleos, publicaciones...',
  showFilters = true,
  className = '',
  onSearch 
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (q) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      setLoading(true);
      const { data: people } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline')
        .or(`full_name.ilike.%${q}%,username.ilike.%${q}%`)
        .limit(5);

      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, company:profiles!company_id(full_name)')
        .eq('is_active', true)
        .ilike('title', `%${q}%`)
        .limit(3);

      setSuggestions([
        ...(people || []).map(p => ({ ...p, type: 'people' })),
        ...(jobs || []).map(j => ({ ...j, type: 'jobs' }))
      ]);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (query.trim()) newParams.set('q', query.trim());
    if (type !== 'all') newParams.set('type', type);
    setSearchParams(newParams);
    setShowSuggestions(false);
    if (onSearch) onSearch(query, type);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'people') {
      navigate(`/profile/${suggestion.username}`);
    } else if (suggestion.type === 'jobs') {
      navigate(`/jobs/${suggestion.id}`);
    }
    setQuery('');
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setType('all');
    setSearchParams({});
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
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
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-12 py-3 pr-12 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md transition-colors"
            autoComplete="off"
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

        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 animate-slide-down"
          >
            <div className="p-2">
              <p className="text-label-sm text-on-surface-variant px-3 py-2">Sugerencias</p>
              {suggestions.map((s, i) => (
                <button
                  key={`${s.type}-${s.id}-${i}`}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-variant transition-colors text-left"
                >
                  {s.type === 'people' ? (
                    <>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30 flex-shrink-0">
                        {s.avatar_url ? (
                          <img src={s.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-label-md font-bold text-primary">
                              {s.full_name?.[0]?.toUpperCase() || s.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-on-surface truncate">
                          {s.full_name || s.username}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          @{s.username}
                        </p>
                      </div>
                      <User size={16} className="text-on-surface-variant/50" />
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
                        <Briefcase size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-on-surface truncate">{s.title}</p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          {s.company?.full_name || 'Empresa'}
                        </p>
                      </div>
                      <Briefcase size={16} className="text-on-surface-variant/50" />
                    </>
                  )}
                ))}
            </div>
          </div>
        )}

        {showFilters && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
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
        )}
      </form>
    </div>
  );
};

export default SearchBar;