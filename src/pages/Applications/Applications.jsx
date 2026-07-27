import { useState, useEffect } from 'react';
import { Plus, X, Calendar, MapPin, ArrowRight, Trash2, Building, Sparkles, Heart, TrendingUp, DollarSign, Clock, Search, Filter, Star } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { storage } from '../../lib/localStorage';

const STORAGE_KEY = 'applications';

const loadApps = () => storage.get(STORAGE_KEY) || [];
const saveApps = (apps) => storage.set(STORAGE_KEY, apps);

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const sampleJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Stellar Dynamics',
    location: 'Remote',
    salary: '$120,000 - $160,000',
    type: 'Full-time',
    level: 'Senior',
    posted: '2 days ago',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    match: 95,
    description: 'Join our team building the next generation of cosmic interfaces...',
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Nebula Labs',
    location: 'San Francisco, CA',
    salary: '$100,000 - $140,000',
    type: 'Full-time',
    level: 'Mid-level',
    posted: '1 week ago',
    skills: ['Figma', 'UI/UX', 'Design Systems'],
    match: 88,
    description: 'Design beautiful and intuitive experiences for millions of users...',
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'Quantum Systems',
    location: 'New York, NY',
    salary: '$130,000 - $180,000',
    type: 'Full-time',
    level: 'Senior',
    posted: '3 days ago',
    skills: ['Node.js', 'PostgreSQL', 'GraphQL'],
    match: 82,
    description: 'Build scalable backend systems for enterprise clients...',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Cosmos Analytics',
    location: 'Remote',
    salary: '$110,000 - $150,000',
    type: 'Full-time',
    level: 'Mid-level',
    posted: '5 days ago',
    skills: ['Python', 'Machine Learning', 'SQL'],
    match: 75,
    description: 'Extract insights from complex datasets and drive business decisions...',
  },
];

const NewApplicationModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ company: '', role: '', location: '', date: new Date().toISOString().slice(0, 10), notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave({
      id: genId(),
      ...form,
      status: 'applied',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">Log Application</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 transition-smooth"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Company</label>
              <Input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Stellar Dynamics"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Role</label>
              <Input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Data Scientist"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Location</label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Date Applied</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-background border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(168,180,216,0.15)] outline-none transition-smooth font-body-sm"
              />
            </div>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Any additional details..."
              className="w-full bg-background border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(168,180,216,0.15)] outline-none transition-smooth font-body-sm text-body-sm placeholder:text-on-surface-variant resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Application</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

const JobCard = ({ job, onApply, onFavorite, isFavorite }) => {
  const initials = job.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <GlassCard className="overflow-hidden hover:border-primary/30 transition-smooth group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center border border-outline-variant/30">
              <span className="font-label-md font-bold text-primary">{initials}</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-smooth">{job.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{job.company}</p>
            </div>
          </div>
          <button
            onClick={() => onFavorite(job.id)}
            className={`p-2 rounded-lg transition-smooth ${isFavorite ? 'text-primary bg-primary-container/30' : 'text-on-surface-variant hover:text-primary hover:bg-primary-container/20'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
            <MapPin size={14} />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
            <DollarSign size={14} />
            {job.salary}
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
            <Clock size={14} />
            {job.posted}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge variant="outline" className="text-xs">{job.type}</Badge>
          <Badge variant="secondary" className="text-xs">{job.level}</Badge>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-nebula-stroke">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="font-body-sm text-body-sm text-primary font-semibold">{job.match}% Match</span>
          </div>
          <Button variant="primary" size="sm" onClick={() => onApply(job)}>
            Apply Now
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [view, setView] = useState('jobs'); // 'jobs' or 'applications'
  const [search, setSearch] = useState('');

  useEffect(() => {
    setApplications(loadApps());
  }, []);

  const persist = (apps) => {
    setApplications(apps);
    saveApps(apps);
  };

  const handleAdd = (app) => {
    persist([app, ...applications]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    persist(applications.filter(a => a.id !== id));
  };

  const handleFavorite = (jobId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(jobId)) {
      newFavorites.delete(jobId);
    } else {
      newFavorites.add(jobId);
    }
    setFavorites(newFavorites);
  };

  const handleApply = (job) => {
    setShowModal(true);
  };

  const filteredJobs = sampleJobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2 flex items-center gap-3">
          <Sparkles size={28} className="text-primary" />
          {view === 'jobs' ? 'Jobs & Opportunities' : 'My Applications'}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {view === 'jobs' 
            ? 'Discover opportunities that match your skills and career goals'
            : 'Track your job applications and career trajectory'
          }
        </p>
      </div>

      {/* View Toggle and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <Badge
            variant={view === 'jobs' ? 'default' : 'outline'}
            className="cursor-pointer hover:border-primary/50 transition-smooth"
            onClick={() => setView('jobs')}
          >
            <Search size={14} />
            Browse Jobs
          </Badge>
          <Badge
            variant={view === 'applications' ? 'default' : 'outline'}
            className="cursor-pointer hover:border-primary/50 transition-smooth"
            onClick={() => setView('applications')}
          >
            <TrendingUp size={14} />
            My Applications ({applications.length})
          </Badge>
        </div>
        {view === 'jobs' && (
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="pl-10"
            />
          </div>
        )}
      </div>

      {view === 'jobs' ? (
        <>
          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No jobs found"
              description="Try adjusting your search or browse all opportunities"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.has(job.id)}
                />
              ))}
            </div>
          )}

          {/* Favorites Section */}
          {favorites.size > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <Heart size={20} className="text-primary fill-primary" />
                <h2 className="font-headline-md text-headline-md text-on-surface">Saved Jobs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleJobs.filter(job => favorites.has(job.id)).map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                    onFavorite={handleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Applications List */}
          {applications.length === 0 ? (
            <EmptyState
              icon={Building}
              title="No applications yet"
              description="Start tracking your job applications to stay organized"
              action={
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  <Plus size={16} />
                  Log First Application
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {applications.map(app => {
                const initials = app.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                const dateStr = app.date ? new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

                return (
                  <GlassCard key={app.id} className="p-5 hover:border-primary/30 transition-smooth">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center border border-outline-variant/30 shrink-0">
                          <span className="font-label-md font-bold text-primary">{initials}</span>
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{app.role}</h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{app.company}</p>
                          <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
                            {app.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {app.location}
                              </div>
                            )}
                            {dateStr && (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                Applied {dateStr}
                              </div>
                            )}
                          </div>
                          {app.notes && (
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 line-clamp-2">{app.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Applied</Badge>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-smooth"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Log New Application
            </Button>
          </div>
        </>
      )}

      {showModal && <NewApplicationModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  );
};

export default Applications;