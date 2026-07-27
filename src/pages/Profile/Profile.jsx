import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfileForm, useProfileStats } from '../../hooks/useProfiles';
import { useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from '../../hooks/useExperience';
import { useEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from '../../hooks/useEducation';
import { useCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification } from '../../hooks/useCertifications';
import { usePublications, useCreatePublication, useUpdatePublication, useDeletePublication } from '../../hooks/usePublications';
import {
  Edit, Save, X, Camera, MapPin, Star, Loader2, Briefcase, Users, Eye,
  Plus, Trash2, GraduationCap, Award, BookOpen, ExternalLink, Calendar
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import MetricCard from '../../components/ui/MetricCard';
import EventHorizon from '../../components/ui/EventHorizon';

const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'Python', 'Node.js', 'Tailwind CSS',
  'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Figma', 'REST APIs',
  'Supabase', 'UI/UX', 'Go', 'Rust',
];

/* ─── Inline Form Components ─── */

const InputField = ({ label, name, value, onChange, placeholder, type = 'text', required = false }) => (
  <div>
    {label && <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">{label}</label>}
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
      className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none transition-all"
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    {label && <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">{label}</label>}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-background border border-outline-variant rounded px-4 py-3 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none resize-none font-body-md text-body-md transition-all"
    />
  </div>
);

/* ─── CRUD Section Components ─── */

const emptyExperience = { title: '', company: '', start_date: '', end_date: '', description: '' };
const emptyEducation = { institution: '', degree: '', field: '', start_date: '', end_date: '' };
const emptyCertification = { title: '', issuer: '', issue_date: '', credential_url: '' };
const emptyPublication = { title: '', summary: '', url: '', tags: '' };

function CrudForm({ fields, data, onChange, onSave, onCancel, saving }) {
  return (
    <GlassCard className="p-stack-md mb-4 border-primary/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? 'md:col-span-2' : ''}>
            <InputField
              label={f.label}
              name={f.name}
              value={data[f.name] || ''}
              onChange={onChange}
              placeholder={f.placeholder}
              type={f.type || 'text'}
              required={f.required}
            />
          </div>
        ))}
      </div>
      {fields.find(f => f.name === 'description' || f.name === 'summary') && (
        <div className="mt-3">
          <TextareaField
            label={fields.find(f => f.name === 'description' || f.name === 'summary').label}
            name={fields.find(f => f.name === 'description' || f.name === 'summary').name}
            value={data[fields.find(f => f.name === 'description' || f.name === 'summary').name] || ''}
            onChange={onChange}
            placeholder={fields.find(f => f.name === 'description' || f.name === 'summary').placeholder}
          />
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <Button variant="primary" size="sm" onClick={onSave} disabled={saving}>
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving</> : <><Save size={14} /> Save</>}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}><X size={14} /> Cancel</Button>
      </div>
    </GlassCard>
  );
}

function CrudItem({ item, fields, icon: Icon, onEdit, onDelete, deleting }) {
  return (
    <div className="flex gap-4 py-4 border-b border-nebula-stroke last:border-0 group">
      <div className="mt-1 w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.title || item.institution || item.degree}</h4>
        <p className="font-body-sm text-body-sm text-primary mt-0.5">
          {item.company || item.issuer || item.field || ''}
        </p>
        {(item.start_date || item.issue_date) && (
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 flex items-center gap-1">
            <Calendar size={12} />
            {item.start_date || item.issue_date}
            {item.end_date ? ` — ${item.end_date}` : item.start_date ? ' — Present' : ''}
          </p>
        )}
        {item.description && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">{item.description}</p>
        )}
        {item.credential_url && (
          <a href={item.credential_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors">
            <ExternalLink size={12} /> View Credential
          </a>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 rounded hover:bg-primary-container/30 text-on-surface-variant hover:text-primary transition-colors">
          <Edit size={14} />
        </button>
        <button onClick={onDelete} disabled={deleting} className="p-1.5 rounded hover:bg-error-container/30 text-on-surface-variant hover:text-error transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Profile Component ─── */

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id || null;

  const {
    form, handleSubmit: onProfileSubmit, profile, isLoading, isError,
    isUpdating, isUploadingAvatar, isUploadingBanner, addSkill, removeSkill, uploadAvatar, uploadBanner
  } = useProfileForm(userId);

  const statsQuery = useProfileStats(userId);
  const stats = statsQuery.data || { connections: 0, applications: 0 };

  // Section data queries
  const experienceQuery = useExperience(userId);
  const educationQuery = useEducation(userId);
  const certificationsQuery = useCertifications(userId);
  const publicationsQuery = usePublications(userId);

  // Mutations
  const createExp = useCreateExperience();
  const updateExp = useUpdateExperience();
  const deleteExp = useDeleteExperience();
  const createEdu = useCreateEducation();
  const updateEdu = useUpdateEducation();
  const deleteEdu = useDeleteEducation();
  const createCert = useCreateCertification();
  const updateCert = useUpdateCertification();
  const deleteCert = useDeleteCertification();
  const createPub = useCreatePublication();
  const updatePub = useUpdatePublication();
  const deletePub = useDeletePublication();

  // Local UI state
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [newSkill, setNewSkill] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [error, setError] = useState(null);

  // Inline form state for CRUD sections
  const [addingExp, setAddingExp] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [expForm, setExpForm] = useState({ ...emptyExperience });

  const [addingEdu, setAddingEdu] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduForm, setEduForm] = useState({ ...emptyEducation });

  const [addingCert, setAddingCert] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({ ...emptyCertification });

  const [addingPub, setAddingPub] = useState(false);
  const [editingPub, setEditingPub] = useState(null);
  const [pubForm, setPubForm] = useState({ ...emptyPublication });

  // Set avatar/banner preview from profile data
  useEffect(() => {
    if (profile?.avatar_url) setAvatarPreview(profile.avatar_url);
    if (profile?.banner_url) setBannerPreview(profile.banner_url);
  }, [profile?.avatar_url, profile?.banner_url]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  const handleInputChange = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Avatar must be an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Banner must be an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Banner must be less than 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setError(null);

      // Upload avatar if changed
      if (avatarPreview && avatarPreview.startsWith('data:') && userId) {
        const blob = await fetch(avatarPreview).then(r => r.blob());
        const avatarUrl = await uploadAvatar(blob);
        form.setValue('avatar_url', avatarUrl);
      }

      // Upload banner if changed
      if (bannerPreview && bannerPreview.startsWith('data:') && userId) {
        const blob = await fetch(bannerPreview).then(r => r.blob());
        const bannerUrl = await uploadBanner(blob);
        form.setValue('banner_url', bannerUrl);
      }

      // Submit profile form via RHF
      await form.handleSubmit(onProfileSubmit)();
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  // CRUD handlers — Experience
  const saveExperience = async () => {
    try {
      const data = { ...expForm, profile_id: userId };
      if (editingExp) {
        await updateExp.mutateAsync({ id: editingExp, ...data });
      } else {
        await createExp.mutateAsync(data);
      }
      setExpForm({ ...emptyExperience });
      setAddingExp(false);
      setEditingExp(null);
    } catch (err) { setError(err.message); }
  };

  const startEditExp = (item) => {
    setExpForm({ title: item.title, company: item.company, start_date: item.start_date, end_date: item.end_date || '', description: item.description || '' });
    setEditingExp(item.id);
    setAddingExp(true);
  };

  // CRUD handlers — Education
  const saveEducation = async () => {
    try {
      const data = { ...eduForm, profile_id: userId };
      if (editingEdu) {
        await updateEdu.mutateAsync({ id: editingEdu, ...data });
      } else {
        await createEdu.mutateAsync(data);
      }
      setEduForm({ ...emptyEducation });
      setAddingEdu(false);
      setEditingEdu(null);
    } catch (err) { setError(err.message); }
  };

  const startEditEdu = (item) => {
    setEduForm({ institution: item.institution, degree: item.degree, field: item.field || '', start_date: item.start_date, end_date: item.end_date || '' });
    setEditingEdu(item.id);
    setAddingEdu(true);
  };

  // CRUD handlers — Certifications
  const saveCertification = async () => {
    try {
      const data = { ...certForm, profile_id: userId };
      if (editingCert) {
        await updateCert.mutateAsync({ id: editingCert, ...data });
      } else {
        await createCert.mutateAsync(data);
      }
      setCertForm({ ...emptyCertification });
      setAddingCert(false);
      setEditingCert(null);
    } catch (err) { setError(err.message); }
  };

  const startEditCert = (item) => {
    setCertForm({ title: item.title, issuer: item.issuer, issue_date: item.issue_date, credential_url: item.credential_url || '' });
    setEditingCert(item.id);
    setAddingCert(true);
  };

  // CRUD handlers — Publications
  const savePublication = async () => {
    try {
      const tagsArray = typeof pubForm.tags === 'string'
        ? pubForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : pubForm.tags || [];
      const data = { ...pubForm, tags: tagsArray, profile_id: userId, published_at: new Date().toISOString() };
      if (editingPub) {
        await updatePub.mutateAsync({ id: editingPub, ...data });
      } else {
        await createPub.mutateAsync(data);
      }
      setPubForm({ ...emptyPublication });
      setAddingPub(false);
      setEditingPub(null);
    } catch (err) { setError(err.message); }
  };

  const startEditPub = (item) => {
    setPubForm({ title: item.title, summary: item.summary || '', url: item.url || '', tags: (item.tags || []).join(', ') });
    setEditingPub(item.id);
    setAddingPub(true);
  };

  // Field configs for forms
  const expFields = [
    { name: 'title', label: 'Job Title', placeholder: 'e.g. Frontend Developer', required: true },
    { name: 'company', label: 'Company', placeholder: 'e.g. Google', required: true },
    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
    { name: 'end_date', label: 'End Date', type: 'date' },
  ];
  const eduFields = [
    { name: 'institution', label: 'Institution', placeholder: 'e.g. MIT', required: true },
    { name: 'degree', label: 'Degree', placeholder: 'e.g. B.Sc. Computer Science', required: true },
    { name: 'field', label: 'Field of Study', placeholder: 'e.g. Artificial Intelligence' },
    { name: 'start_date', label: 'Start Date', type: 'date', required: true },
    { name: 'end_date', label: 'End Date', type: 'date' },
  ];
  const certFields = [
    { name: 'title', label: 'Certification', placeholder: 'e.g. AWS Solutions Architect', required: true },
    { name: 'issuer', label: 'Issuer', placeholder: 'e.g. Amazon Web Services', required: true },
    { name: 'issue_date', label: 'Issue Date', type: 'date', required: true },
    { name: 'credential_url', label: 'Credential URL', placeholder: 'https://...', full: true },
  ];
  const pubFields = [
    { name: 'title', label: 'Title', placeholder: 'Article or project title', required: true, full: true },
    { name: 'url', label: 'URL', placeholder: 'https://...', full: true },
    { name: 'tags', label: 'Tags (comma separated)', placeholder: 'react, typescript, ux', full: true },
  ];

  // Loading
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EventHorizon variant="spinner" size={48} />
      </div>
    );
  }

  const formValues = form.getValues();

  return (
    <div className="pb-stack-lg">
      {/* Hero Banner with Event Horizon */}
      <div className="relative h-48 md:h-56 w-full rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary-container/40 via-surface-container to-surface">
        {bannerPreview ? (
          <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
            <EventHorizon variant="hero" size={280} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {editing && (
          <label className="absolute bottom-3 right-3 w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform z-10">
            <Camera size={16} className="text-on-primary" />
            <input type="file" accept="image/*" onChange={handleBannerChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </label>
        )}
        {isUploadingBanner && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20">
            <EventHorizon variant="spinner" size={40} />
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative z-10 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-5 mb-stack-lg px-2">
        {/* Avatar with Event Horizon frame */}
        <div className="relative">
          <EventHorizon variant="avatar" size={136}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-surface-variant flex items-center justify-center rounded-full">
                <Users size={48} className="text-on-surface-variant/50" />
              </div>
            )}
          </EventHorizon>
          {editing && (
            <label className="absolute bottom-1 right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform z-10">
              <Camera size={16} className="text-on-primary" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          )}
        </div>

        <div className="text-center md:text-left flex-1">
          {editing ? (
            <div className="space-y-2">
              <input name="full_name" {...form.register('full_name')} placeholder="Full Name"
                className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-headline-md focus:border-primary outline-none transition-all" />
              {form.formState.errors.full_name && <p className="text-error text-body-sm">{form.formState.errors.full_name.message}</p>}
              <input name="username" {...form.register('username')} placeholder="@username"
                className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary outline-none transition-all" />
              {form.formState.errors.username && <p className="text-error text-body-sm">{form.formState.errors.username.message}</p>}
              <input name="headline" {...form.register('headline')} placeholder="e.g. Lead Astrodynamics Researcher"
                className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary outline-none transition-all" />
            </div>
          ) : (
            <>
              <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface">{formValues.full_name || profile?.full_name || 'User'}</h1>
              <p className="font-headline-sm text-primary mt-1">{formValues.headline || profile?.headline}</p>
              {(formValues.location || profile?.location) && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center justify-center md:justify-start gap-1">
                  <MapPin size={14} /> {formValues.location || profile?.location}
                </p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                {(formValues.skills?.length > 0 ? formValues.skills : profile?.skills || []).slice(0, 5).map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary-container/40 border border-nebula-stroke rounded-sm font-label-caps text-label-caps text-secondary-fixed">
                    {skill.toUpperCase()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          {editing ? (
            <>
              <Button variant="ghost" onClick={() => { setEditing(false); setAvatarPreview(profile?.avatar_url || null); form.reset(); }}>
                <X size={16} /> Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isUpdating || isUploadingAvatar}>
                {isUpdating || isUploadingAvatar ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <><Save size={16} /> Save</>}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setEditing(true)}><Edit size={16} /> Edit Profile</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded mb-6 font-body-sm text-body-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-2 hover:opacity-70"><X size={16} /></button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <MetricCard value={(stats.connections || 0).toLocaleString()} label="Connections" icon={Users} />
        <MetricCard value={(certificationsQuery.data?.length || 0).toLocaleString()} label="Certifications" icon={Award} />
        <MetricCard value={(stats.applications || 0).toLocaleString()} label="Applications" icon={Briefcase} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column — Tabs */}
        <div className="md:col-span-8 space-y-gutter">
          {/* Tab Bar */}
          <div className="border-b border-nebula-stroke flex gap-6 overflow-x-auto">
            {['about', 'experience', 'publications', 'skills'].map((tab) => (
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

          {/* ═══ About Tab ═══ */}
          {activeTab === 'about' && (
            <GlassCard className="p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Mission Statement</h3>
              {editing ? (
                <>
                  <textarea {...form.register('bio')} rows={4} placeholder="Tell us about yourself..."
                    className="w-full bg-background border border-outline-variant rounded px-4 py-3 text-on-surface focus:border-primary outline-none resize-none font-body-md text-body-md mb-4 transition-all" />
                  {form.formState.errors.bio && <p className="text-error text-body-sm mb-2">{form.formState.errors.bio.message}</p>}
                </>
              ) : (
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
                  {formValues.bio || profile?.bio || 'No bio yet.'}
                </p>
              )}
              <div className="border-t border-nebula-stroke pt-6">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Current Coordinates</h4>
                {editing ? (
                  <>
                    <input {...form.register('location')} placeholder="City, Country"
                      className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface focus:border-primary outline-none transition-all" />
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-body-md text-body-md text-on-surface">{formValues.location || profile?.location || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Links section */}
              {editing && (
                <div className="border-t border-nebula-stroke pt-6 mt-6 space-y-3">
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3">External Links</h4>
                  <input {...form.register('website_url')} placeholder="Website URL"
                    className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary outline-none transition-all" />
                  <input {...form.register('linkedin_url')} placeholder="LinkedIn URL"
                    className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary outline-none transition-all" />
                  <input {...form.register('github_url')} placeholder="GitHub URL"
                    className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary outline-none transition-all" />
                  <input {...form.register('twitter_url')} placeholder="Twitter / X URL"
                    className="w-full bg-background border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:border-primary outline-none transition-all" />
                </div>
              )}
            </GlassCard>
          )}

          {/* ═══ Experience Tab ═══ */}
          {activeTab === 'experience' && (
            <div className="space-y-gutter">
              {/* Experience Section */}
              <GlassCard className="p-stack-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" /> Experience
                  </h3>
                  {!addingExp && (
                    <Button variant="ghost" size="sm" onClick={() => { setExpForm({ ...emptyExperience }); setEditingExp(null); setAddingExp(true); }}>
                      <Plus size={14} /> Add
                    </Button>
                  )}
                </div>

                {addingExp && (
                  <CrudForm
                    fields={expFields}
                    data={expForm}
                    onChange={handleInputChange(setExpForm)}
                    onSave={saveExperience}
                    onCancel={() => { setAddingExp(false); setEditingExp(null); }}
                    saving={createExp.isPending || updateExp.isPending}
                  />
                )}

                {experienceQuery.isLoading ? (
                  <div className="flex justify-center py-6"><EventHorizon variant="spinner" size={32} /></div>
                ) : (experienceQuery.data || []).length === 0 ? (
                  <p className="font-body-md text-body-md text-on-surface-variant py-4">No experience entries yet.</p>
                ) : (
                  (experienceQuery.data || []).map(item => (
                    <CrudItem key={item.id} item={item} icon={Briefcase} fields={expFields}
                      onEdit={() => startEditExp(item)}
                      onDelete={() => deleteExp.mutate({ id: item.id, profileId: userId })}
                      deleting={deleteExp.isPending}
                    />
                  ))
                )}
              </GlassCard>

              {/* Education Section */}
              <GlassCard className="p-stack-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" /> Education
                  </h3>
                  {!addingEdu && (
                    <Button variant="ghost" size="sm" onClick={() => { setEduForm({ ...emptyEducation }); setEditingEdu(null); setAddingEdu(true); }}>
                      <Plus size={14} /> Add
                    </Button>
                  )}
                </div>

                {addingEdu && (
                  <CrudForm
                    fields={eduFields}
                    data={eduForm}
                    onChange={handleInputChange(setEduForm)}
                    onSave={saveEducation}
                    onCancel={() => { setAddingEdu(false); setEditingEdu(null); }}
                    saving={createEdu.isPending || updateEdu.isPending}
                  />
                )}

                {educationQuery.isLoading ? (
                  <div className="flex justify-center py-6"><EventHorizon variant="spinner" size={32} /></div>
                ) : (educationQuery.data || []).length === 0 ? (
                  <p className="font-body-md text-body-md text-on-surface-variant py-4">No education entries yet.</p>
                ) : (
                  (educationQuery.data || []).map(item => (
                    <CrudItem key={item.id} item={{ ...item, title: item.degree, company: item.institution }} icon={GraduationCap} fields={eduFields}
                      onEdit={() => startEditEdu(item)}
                      onDelete={() => deleteEdu.mutate({ id: item.id, profileId: userId })}
                      deleting={deleteEdu.isPending}
                    />
                  ))
                )}
              </GlassCard>

              {/* Certifications Section */}
              <GlassCard className="p-stack-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                    <Award size={20} className="text-primary" /> Certifications
                  </h3>
                  {!addingCert && (
                    <Button variant="ghost" size="sm" onClick={() => { setCertForm({ ...emptyCertification }); setEditingCert(null); setAddingCert(true); }}>
                      <Plus size={14} /> Add
                    </Button>
                  )}
                </div>

                {addingCert && (
                  <CrudForm
                    fields={certFields}
                    data={certForm}
                    onChange={handleInputChange(setCertForm)}
                    onSave={saveCertification}
                    onCancel={() => { setAddingCert(false); setEditingCert(null); }}
                    saving={createCert.isPending || updateCert.isPending}
                  />
                )}

                {certificationsQuery.isLoading ? (
                  <div className="flex justify-center py-6"><EventHorizon variant="spinner" size={32} /></div>
                ) : (certificationsQuery.data || []).length === 0 ? (
                  <p className="font-body-md text-body-md text-on-surface-variant py-4">No certifications yet.</p>
                ) : (
                  (certificationsQuery.data || []).map(item => (
                    <CrudItem key={item.id} item={item} icon={Award} fields={certFields}
                      onEdit={() => startEditCert(item)}
                      onDelete={() => deleteCert.mutate({ id: item.id, profileId: userId })}
                      deleting={deleteCert.isPending}
                    />
                  ))
                )}
              </GlassCard>
            </div>
          )}

          {/* ═══ Publications Tab ═══ */}
          {activeTab === 'publications' && (
            <GlassCard className="p-stack-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <BookOpen size={20} className="text-primary" /> Publications
                </h3>
                {!addingPub && (
                  <Button variant="ghost" size="sm" onClick={() => { setPubForm({ ...emptyPublication }); setEditingPub(null); setAddingPub(true); }}>
                    <Plus size={14} /> Add
                  </Button>
                )}
              </div>

              {addingPub && (
                <CrudForm
                  fields={pubFields}
                  data={pubForm}
                  onChange={handleInputChange(setPubForm)}
                  onSave={savePublication}
                  onCancel={() => { setAddingPub(false); setEditingPub(null); }}
                  saving={createPub.isPending || updatePub.isPending}
                />
              )}

              {publicationsQuery.isLoading ? (
                <div className="flex justify-center py-6"><EventHorizon variant="spinner" size={32} /></div>
              ) : (publicationsQuery.data || []).length === 0 ? (
                <p className="font-body-md text-body-md text-on-surface-variant py-4">No publications yet. Share your articles, projects, and research.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {(publicationsQuery.data || []).map(pub => (
                    <div key={pub.id} className="bg-surface-container/60 rounded-lg border border-nebula-stroke p-4 group hover:border-primary/30 transition-all">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">{pub.title}</h4>
                      {pub.summary && <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-2">{pub.summary}</p>}
                      {pub.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {pub.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-sm bg-primary-container/40 text-primary font-label-caps text-[10px]">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        {pub.url && (
                          <a href={pub.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors">
                            <ExternalLink size={12} /> View
                          </a>
                        )}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                          <button onClick={() => startEditPub(pub)} className="p-1.5 rounded hover:bg-primary-container/30 text-on-surface-variant hover:text-primary transition-colors">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => deletePub.mutate({ id: pub.id, profileId: userId })} className="p-1.5 rounded hover:bg-error-container/30 text-on-surface-variant hover:text-error transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}

          {/* ═══ Skills Tab ═══ */}
          {activeTab === 'skills' && (
            <GlassCard className="p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Skills</h3>
              {editing && (
                <div className="space-y-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {(formValues.skills || []).map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-primary-container/40 text-primary font-label-caps text-label-caps">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:bg-primary/20 rounded-full p-0.5"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.filter(s => !(formValues.skills || []).includes(s)).slice(0, 10).map((skill) => (
                      <button key={skill} onClick={() => addSkill(skill)}
                        className="px-3 py-1 rounded-sm bg-surface-container border border-outline-variant text-on-surface-variant font-label-caps text-label-caps hover:border-primary hover:text-primary transition-colors">
                        + {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                      placeholder="Add custom skill..."
                      className="flex-1 bg-background border border-outline-variant rounded px-3 py-2 text-on-surface focus:border-primary outline-none text-body-sm transition-all" />
                    <Button variant="primary" size="sm" onClick={handleSkillAdd} disabled={!newSkill.trim()}>Add</Button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {(formValues.skills?.length > 0 ? formValues.skills : profile?.skills || []).map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-sm bg-primary-container/40 border border-nebula-stroke text-primary font-label-caps text-label-caps">
                    {skill}
                  </span>
                ))}
                {(!profile?.skills || profile.skills.length === 0) && !(formValues.skills?.length > 0) && !editing && (
                  <p className="font-body-md text-body-md text-on-surface-variant">No skills added yet.</p>
                )}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column — Sidebar Panels */}
        <div className="md:col-span-4 space-y-gutter">
          {/* Certifications Summary */}
          <GlassCard className="p-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 pb-2 border-b border-nebula-stroke flex items-center gap-2">
              <Award size={18} className="text-primary" /> Certifications
            </h3>
            {certificationsQuery.isLoading ? (
              <div className="flex justify-center py-4"><EventHorizon variant="spinner" size={24} /></div>
            ) : (certificationsQuery.data || []).length === 0 ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">No certifications yet.</p>
            ) : (
              <div className="space-y-3">
                {(certificationsQuery.data || []).slice(0, 4).map(cert => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <Award size={14} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface">{cert.title}</p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="p-stack-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Recent Activity</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Briefcase size={16} className="text-on-surface-variant shrink-0 mt-0.5" />
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface">Profile updated</p>
                  <p className="font-label-caps text-label-caps text-primary mt-0.5">Today</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Users size={16} className="text-on-surface-variant shrink-0 mt-0.5" />
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface">Application submitted</p>
                  <p className="font-label-caps text-label-caps text-primary mt-0.5">3 days ago</p>
                </div>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;