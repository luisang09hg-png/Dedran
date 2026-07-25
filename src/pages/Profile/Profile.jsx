import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Edit, Save, X, Camera, MapPin, Star, Loader2, Briefcase, Users, Eye } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import MetricCard from '../../components/ui/MetricCard';

const SKILL_SUGGESTIONS = [
  'React', 'TypeScript', 'Python', 'Node.js', 'Tailwind CSS',
  'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Figma', 'REST APIs',
  'Supabase', 'UI/UX', 'Go', 'Rust',
];

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const [form, setForm] = useState({
    full_name: '', username: '', headline: '', bio: '',
    location: '', website_url: '', linkedin_url: '', github_url: '', twitter_url: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [stats, setStats] = useState({ connections: 0, views: 0, applications: 0 });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setForm({
          full_name: data.full_name || '',
          username: data.username || '',
          headline: data.headline || '',
          bio: data.bio || '',
          location: data.location || '',
          website_url: data.website_url || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          twitter_url: data.twitter_url || '',
          skills: data.skills || [],
        });
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
      }

      const { count: connections } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id);
      const { count: applications } = await supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('applicant_id', user.id);
      setStats({ connections: connections || 0, views: 0, applications: applications || 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSkillAdd = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skill) => setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let avatarUrl = profile?.avatar_url;
      if (avatarPreview && avatarPreview.startsWith('data:')) {
        const blob = await fetch(avatarPreview).then(r => r.blob());
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars').upload(`${user.id}/avatar.jpg`, blob, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
        avatarUrl = publicUrl;
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user.id, ...form, avatar_url: avatarUrl, updated_at: new Date().toISOString(),
      });
      if (error) throw error;

      setProfile({ ...profile, ...form, avatar_url: avatarUrl });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="pb-stack-lg">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-56 w-full rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary-container/40 via-surface-container to-surface"
        style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(188,198,231,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(32,42,68,0.4) 0%, transparent 50%)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative z-10 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-5 mb-stack-lg px-2">
        <div className="relative p-1 bg-surface rounded-full">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-surface-container">
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                <Users size={48} className="text-on-surface-variant/50" />
              </div>
            )}
            {editing && (
              <label className="absolute bottom-1 right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform z-10">
                <Camera size={16} className="text-on-primary" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </label>
            )}
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          {editing ? (
            <div className="space-y-2">
              <input name="full_name" value={form.full_name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface text-headline-md focus:border-[#D9D9D6] outline-none" />
              <input name="username" value={form.username} onChange={handleInputChange} placeholder="@username" className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface text-body-sm focus:border-[#D9D9D6] outline-none" />
              <input name="headline" value={form.headline} onChange={handleInputChange} placeholder="e.g. Lead Astrodynamics Researcher" className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface text-body-sm focus:border-[#D9D9D6] outline-none" />
            </div>
          ) : (
            <>
              <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface">{form.full_name || profile?.full_name || 'User'}</h1>
              <p className="font-headline-sm text-primary mt-1">{form.headline || profile?.headline}</p>
              {(form.location || profile?.location) && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center justify-center md:justify-start gap-1">
                  <MapPin size={14} /> {form.location || profile?.location}
                </p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                {(form.skills.length > 0 ? form.skills : profile?.skills || []).slice(0, 5).map((skill) => (
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
              <Button variant="ghost" onClick={() => { setEditing(false); setAvatarPreview(profile?.avatar_url || null); }}>
                <X size={16} /> Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving</> : <><Save size={16} /> Save</>}
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setEditing(true)}><Edit size={16} /> Edit Profile</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded mb-6 font-body-sm text-body-sm">{error}</div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <MetricCard value={stats.connections.toLocaleString()} label="Connections" icon={Users} />
        <MetricCard value={stats.views.toLocaleString()} label="Profile Views" icon={Eye} />
        <MetricCard value={stats.applications.toLocaleString()} label="Applications" icon={Briefcase} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column — Tabs */}
        <div className="md:col-span-8 space-y-gutter">
          {/* Tab Bar */}
          <div className="border-b border-nebula-stroke flex gap-6">
            {['about', 'experience', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 font-headline-sm text-headline-sm transition-colors capitalize ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* About */}
          {activeTab === 'about' && (
            <GlassCard className="p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Mission Statement</h3>
              {editing ? (
                <textarea name="bio" value={form.bio} onChange={handleInputChange} rows={4} placeholder="Tell us about yourself..."
                  className="w-full bg-[#07090E] border border-charcoal-gray rounded px-4 py-3 text-on-surface focus:border-[#D9D9D6] outline-none resize-none font-body-md text-body-md mb-4" />
              ) : (
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
                  {(form.bio || profile?.bio) || 'No bio yet.'}
                </p>
              )}
              <div className="border-t border-nebula-stroke pt-6">
                <h4 className="font-label-caps text-label-caps text-charcoal-gray mb-3">Current Coordinates</h4>
                {editing ? (
                  <input name="location" value={form.location} onChange={handleInputChange} placeholder="City, Country"
                    className="w-full bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] outline-none" />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="font-body-md text-body-md text-on-surface">{form.location || profile?.location || 'Not set'}</span>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <GlassCard className="p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Experience</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {editing ? 'Experience entries can be added in a future update.' : 'No experience entries yet.'}
              </p>
            </GlassCard>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <GlassCard className="p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Skills</h3>
              {editing && (
                <div className="space-y-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {(form.skills.length > 0 ? form.skills : []).map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-primary-container/40 text-primary font-label-caps text-label-caps">
                        {skill}
                        <button onClick={() => handleSkillRemove(skill)} className="hover:bg-primary/20 rounded-full p-0.5"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 10).map((skill) => (
                      <button key={skill} onClick={() => setForm({ ...form, skills: [...form.skills, skill] })}
                        className="px-3 py-1 rounded-sm bg-surface-container border border-charcoal-gray text-on-surface-variant font-label-caps text-label-caps hover:border-primary hover:text-primary transition-colors">
                        + {skill}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())} placeholder="Add custom skill..."
                      className="flex-1 bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] outline-none text-body-sm" />
                    <Button variant="primary" size="sm" onClick={handleSkillAdd} disabled={!newSkill.trim()}>Add</Button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {(form.skills.length > 0 ? form.skills : profile?.skills || []).map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-sm bg-primary-container/40 border border-nebula-stroke text-primary font-label-caps text-label-caps">
                    {skill}
                  </span>
                ))}
                {(!profile?.skills || profile.skills.length === 0) && !editing && (
                  <p className="font-body-md text-body-md text-on-surface-variant">No skills added yet.</p>
                )}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column — Sidebar Panels */}
        <div className="md:col-span-4 space-y-gutter">
          {/* Proficiencies */}
          <GlassCard className="p-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 pb-2 border-b border-nebula-stroke">Core Proficiencies</h3>
            <div className="space-y-5">
              {['Telemetry Analysis', 'Quantum Comm', 'Astro-Navigation'].map((skill) => (
                <div key={skill}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body-md text-body-md text-on-surface">{skill}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className={star <= 4 ? 'text-primary fill-primary' : 'text-charcoal-gray'} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Logs */}
          <GlassCard className="p-stack-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Recent Logs</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Briefcase size={16} className="text-charcoal-gray shrink-0 mt-0.5" />
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface">Profile updated</p>
                  <p className="font-label-caps text-label-caps text-primary mt-0.5">Today</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Users size={16} className="text-charcoal-gray shrink-0 mt-0.5" />
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