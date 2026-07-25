import { useState, useEffect } from 'react';
import { Plus, X, Calendar, MapPin, ArrowLeft, ArrowRight, MoreHorizontal, Trash2, Building } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { storage } from '../../lib/localStorage';

const COLUMNS = [
  { key: 'applied', label: 'Applied', color: 'border-l-primary' },
  { key: 'reviewing', label: 'Under Review', color: 'border-l-on-primary-container' },
  { key: 'interview', label: 'Interview Scheduled', color: 'border-l-tertiary-fixed' },
  { key: 'offer', label: 'Offer Received', color: 'border-l-star-glow' },
  { key: 'rejected', label: 'Trajectory Lost', color: 'border-l-error/50' },
];

const NEXT_STAGE = { applied: 'reviewing', reviewing: 'interview', interview: 'offer', offer: null, rejected: null };
const PREV_STAGE = { rejected: 'interview', offer: 'interview', interview: 'reviewing', reviewing: 'applied', applied: null };

const STORAGE_KEY = 'applications';

const loadApps = () => storage.get(STORAGE_KEY) || [];
const saveApps = (apps) => storage.set(STORAGE_KEY, apps);

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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
          <h2 className="font-headline-md text-headline-md text-on-surface">New Application Log</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Company</label>
              <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Stellar Dynamics" className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Role</label>
              <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Data Scientist" className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. San Francisco, CA" className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant" />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Date Applied</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm" />
            </div>
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any additional details..." className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Log Application</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

const ApplicationCard = ({ app, onMove, onDelete }) => {
  const initials = app.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const dateStr = app.date ? new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="bg-primary-container/40 backdrop-blur-[12px] border border-charcoal-gray/30 rounded-lg p-stack-md relative group transition-all duration-300 hover:border-[#D9D9D6]/50 hover:shadow-[0_0_10px_rgba(217,217,214,0.1)]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center border border-charcoal-gray/30 text-sm font-bold text-on-surface-variant shrink-0">
            {initials}
          </div>
          <div>
            <h4 className="font-body-md text-body-md font-bold text-on-surface">{app.role}</h4>
            <p className="font-body-sm text-body-sm text-charcoal-gray">{app.company}</p>
          </div>
        </div>
        <button onClick={() => onDelete(app.id)} className="opacity-0 group-hover:opacity-100 text-charcoal-gray hover:text-error transition-all p-1"><Trash2 size={16} /></button>
      </div>
      <div className="border-t border-nebula-stroke/50 pt-3 flex flex-col gap-1.5">
        {app.location && (
          <div className="flex items-center gap-1.5 text-charcoal-gray">
            <MapPin size={12} />
            <span className="font-label-caps text-[10px]">{app.location}</span>
          </div>
        )}
        {dateStr && (
          <div className="flex items-center gap-1.5 text-charcoal-gray">
            <Calendar size={12} />
            <span className="font-label-caps text-[10px]">{dateStr}</span>
          </div>
        )}
        {app.notes && (
          <p className="font-label-caps text-[10px] text-on-surface-variant mt-1 line-clamp-2">{app.notes}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-nebula-stroke/50">
        {PREV_STAGE[app.status] ? (
          <button onClick={() => onMove(app.id, PREV_STAGE[app.status])} className="text-charcoal-gray hover:text-on-surface transition-colors p-1"><ArrowLeft size={14} /></button>
        ) : <div />}
        <span className="font-label-caps text-[10px] text-primary">{COLUMNS.find(c => c.key === app.status)?.label.toUpperCase()}</span>
        {NEXT_STAGE[app.status] ? (
          <button onClick={() => onMove(app.id, NEXT_STAGE[app.status])} className="text-charcoal-gray hover:text-on-surface transition-colors p-1"><ArrowRight size={14} /></button>
        ) : <div />}
      </div>
    </div>
  );
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  const handleMove = (id, newStatus) => {
    persist(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleDelete = (id) => {
    persist(applications.filter(a => a.id !== id));
  };

  const grouped = Object.fromEntries(COLUMNS.map(col => [col.key, applications.filter(a => a.status === col.key)]));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-stack-lg">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-2">Application Trajectory</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Monitoring active deployment sequences across target constellations. {applications.length} active vectors detected.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowModal(true)}>
          <Plus size={16} /> NEW LOG
        </Button>
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-col xl:flex-row gap-gutter overflow-x-auto pb-8 items-start snap-x">
        {COLUMNS.map((col) => {
          const items = grouped[col.key] || [];
          return (
            <div key={col.key} className="w-full xl:w-[280px] shrink-0 snap-start">
              <div className={`bg-primary-container/60 backdrop-blur-[12px] border border-nebula-stroke rounded-xl p-4 mb-4 flex items-center justify-between border-l-4 ${col.color.replace('border-l-', 'border-l-')}`}>
                <h3 className="font-label-caps text-label-caps text-on-surface">{col.label.toUpperCase()}</h3>
                <span className="bg-primary-container/40 text-primary px-2 py-0.5 rounded-sm font-label-caps text-[10px]">{items.length}</span>
              </div>
              <div className="flex flex-col gap-4 min-h-[200px]">
                {items.map((app) => (
                  <ApplicationCard key={app.id} app={app} onMove={handleMove} onDelete={handleDelete} />
                ))}
                {items.length === 0 && (
                  <div className="flex items-center justify-center h-24 border border-dashed border-charcoal-gray/30 rounded-lg">
                    <p className="font-label-caps text-label-caps text-charcoal-gray">No entries</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <NewApplicationModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  );
};

export default Applications;