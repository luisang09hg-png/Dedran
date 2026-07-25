import { useState, useEffect } from 'react';
import { Search, Star, Clock, Users } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { courses } from '../../data/courses';
import { storage } from '../../lib/localStorage';

const CATEGORIES = ['All', 'Design', 'Tech', 'Business', 'Communication'];
const ENR_KEY = 'enrollments';

const levelStyles = {
  Beginner: 'bg-green-500/10 text-green-400',
  Intermediate: 'bg-primary/10 text-primary',
  Advanced: 'bg-purple-400/10 text-purple-400',
};

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [enrollments, setEnrollments] = useState({});

  useEffect(() => {
    setEnrollments(storage.get(ENR_KEY) || {});
  }, []);

  const saveEnrollments = (updated) => {
    setEnrollments(updated);
    storage.set(ENR_KEY, updated);
  };

  const handleEnrol = (courseId) => {
    saveEnrollments({ ...enrollments, [courseId]: { enrolled: true, progress: 0 } });
  };

  const handleContinue = (courseId) => {
    const current = enrollments[courseId] || { enrolled: true, progress: 0 };
    const newProgress = Math.min((current.progress || 0) + 10, 100);
    saveEnrollments({ ...enrollments, [courseId]: { enrolled: true, progress: newProgress } });
  };

  const filtered = courses.filter((c) => {
    const matchCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      <div className="mb-stack-lg">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-stack-sm">Guided Courses</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Navigate the technical cosmos with curated learning paths.</p>
      </div>

      <div className="relative mb-stack-md max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full bg-[#07090E] border border-charcoal-gray rounded pl-9 pr-4 py-2 text-on-surface text-body-sm focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all placeholder:text-on-surface-variant"
        />
      </div>

      <div className="flex flex-wrap gap-stack-sm mb-stack-lg">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-stack-md py-unit rounded-sm font-label-caps text-label-caps transition-colors ${
              activeCategory === cat
                ? 'bg-primary-container/40 border border-primary text-primary'
                : 'bg-surface-container border border-charcoal-gray text-on-surface-variant hover:border-[#D9D9D6] hover:text-on-surface'
            }`}
          >
            {cat === 'All' ? 'ALL MISSIONS' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-body-md text-body-md text-on-surface-variant">No courses match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {filtered.map((c) => {
            const enr = enrollments[c.id];
            const progress = enr?.progress ?? c.progress;
            const isEnrolled = enr?.enrolled ?? false;

            return (
              <GlassCard key={c.id} className="overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300" hover={false}>
                <div className="h-40 bg-primary-container/20 border-b border-nebula-stroke flex items-center justify-center relative">
                  <span className="font-headline-md text-headline-md text-primary/30">{c.category}</span>
                  <span className="absolute top-3 right-3 bg-surface-container-high/80 backdrop-blur-sm px-2 py-0.5 rounded border border-nebula-stroke text-primary font-label-caps text-label-caps">
                    {c.price}
                  </span>
                  <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-sm font-label-caps text-[10px] ${levelStyles[c.level]}`}>
                    {c.level.toUpperCase()}
                  </span>
                </div>

                <div className="p-stack-md flex flex-col flex-1">
                  <span className="inline-block self-start px-2 py-0.5 rounded-sm bg-primary-container/60 border border-primary/30 text-primary font-label-caps text-label-caps mb-2">
                    {c.category}
                  </span>

                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{c.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">by {c.author}</p>

                  <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm mb-4">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-primary" /> {c.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {c.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {c.enrolled}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>Trajectory</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          background: progress > 0
                            ? 'linear-gradient(90deg, #bcc6e7 0%, rgba(188,198,231,0.2) 100%)'
                            : 'transparent',
                          boxShadow: progress > 0 ? '0 0 10px rgba(188, 198, 231, 0.8)' : 'none',
                        }}
                      />
                    </div>

                    {isEnrolled ? (
                      <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => handleContinue(c.id)}>
                        Continue
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" className="w-full justify-center" onClick={() => handleEnrol(c.id)}>
                        Enrol
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;