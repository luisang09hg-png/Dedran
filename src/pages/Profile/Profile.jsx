import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Edit, Save, X, Camera, MapPin, Link2, Globe, 
  Briefcase, Award, Star, Settings, Loader2, Plus, Trash2, FileText, Users, 
  LayoutGrid, MessageSquare, Heart, Share2, MoreHorizontal, ChevronDown, ExternalLink, User
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    headline: '',
    bio: '',
    location: '',
    website_url: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const skillsList = [
    'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Next.js',
    'Tailwind CSS', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS',
    'Git', 'CI/CD', 'Testing', 'Figma', 'UI/UX', 'REST APIs', 'Firebase',
    'Supabase', 'Prisma', 'Redis', 'Kubernetes', 'Go', 'Rust', 'Java', 'C#'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleSkillSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

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
      if (!user) throw new Error('No autenticado');

      let avatarUrl = profile?.avatar_url;
      if (avatarPreview && avatarPreview.startsWith('data:')) {
        const file = dataURLtoFile(avatarPreview, 'avatar.jpg');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/avatar.jpg`, file, { upsert: true });
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path);
        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...formData,
          avatar_url: avatarUrl,
          is_onboarding_complete: true,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...formData, avatar_url: avatarUrl }));
      setEditing(false);
      setAvatarPreview(avatarUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center starry-bg">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center starry-bg">
        <div className="text-center p-8">
          <h2 className="text-headline-lg font-headline-lg mb-4">Perfil no encontrado</h2>
          <button 
            onClick={() => navigate('/feed')}
            className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md"
          >
            Ir al Feed
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = true;

  return (
    <div className="min-h-screen bg-background text-on-background starry-bg">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-tertiary/5" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-primary/30 bg-surface-container">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt={formData.full_name || 'Avatar'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-variant">
                    <Users size={80} className="text-on-surface-variant/50" />
                  </div>
                )}
                
                {editing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <Camera size={20} className="text-on-primary" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              {editing ? (
                <div className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Nombre completo"
                      className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-headline-md font-headline-md"
                    />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="@usuario"
                      className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-label-lg"
                    />
                  </div>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    placeholder="Título profesional (ej: Junior Frontend Developer)"
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-lg"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-headline-lg md:text-headline-xl font-headline-lg font-bold text-on-surface">
                    {formData.full_name || profile.full_name || 'Sin nombre'}
                  </h1>
                  <p className="text-label-lg text-primary mt-1 font-label-lg">
                    @{formData.username || profile.username || 'usuario'}
                  </p>
                  {formData.headline || profile.headline ? (
                    <p className="text-body-md text-on-surface-variant mt-2 font-body-md">
                      {formData.headline || profile.headline}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-label-md text-on-surface-variant">
                    {formData.location || profile.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {formData.location || profile.location}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <Award size={14} />
                      {profile.role || 'junior'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      Miembro desde {formatDate(profile.created_at)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 md:ml-auto">
              {editing ? (
                <>
                  <button
                    onClick={() => { setFormData({...formData}); setEditing(false); setAvatarPreview(profile?.avatar_url || null); }}
                    className="px-6 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-label-md hover:bg-surface-variant transition-colors"
                  >
                    <X size={18} className="inline-block mr-1" /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md flex items-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Guardar
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md flex items-center gap-2 hover:scale-[0.98] transition-transform"
                >
                  <Edit size={18} />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          {/* Bio & Skills - Editable */}
          <div className="mt-6 pt-6 border-t border-outline-variant/30">
            {editing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface-variant">Biografía</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Cuéntanos sobre ti, tus intereses, objetivos..."
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none font-body-md"
                  />
                </div>
                
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface-variant">Habilidades</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm">
                        {skill}
                        <button 
                          type="button"
                          onClick={() => handleSkillRemove(skill)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skillsList
                      .filter(s => !formData.skills.includes(s))
                      .slice(0, 15)
                      .map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillSelect(skill)}
                          className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant text-label-sm hover:border-primary hover:text-primary transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                      placeholder="Agregar habilidad personalizada..."
                      className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-label-md"
                    />
                    <button
                      type="button"
                      onClick={handleSkillAdd}
                      disabled={!newSkill.trim()}
                      className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-md disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-md font-label-md mb-2 text-on-surface-variant">Ubicación</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Ciudad, País"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-label-md font-label-md mb-2 text-on-surface-variant">Web / Portfolio</label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="https://tupagina.com"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
<label className="block text-label-md font-label-md mb-2 text-on-surface-variant flex items-center gap-1">
                    <ExternalLink size={16} /> LinkedIn
                  </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/tuusuario"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
<label className="block text-label-md font-label-md mb-2 text-on-surface-variant flex items-center gap-1">
                    <ExternalLink size={16} /> GitHub
                  </label>
                    <input
                      type="url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      placeholder="https://github.com/tuusuario"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
<label className="block text-label-md font-label-md mb-2 text-on-surface-variant flex items-center gap-1">
                    <MessageSquare size={16} /> Twitter/X
                  </label>
                    <input
                      type="url"
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleInputChange}
                      placeholder="https://x.com/tuusuario"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {(formData.bio || profile.bio) && (
                  <div>
                    <h3 className="text-label-lg font-label-lg text-on-surface-variant mb-2">Sobre mí</h3>
                    <p className="text-body-md text-on-surface font-body-md whitespace-pre-wrap">
                      {formData.bio || profile.bio}
                    </p>
                  </div>
                )}

                {(formData.skills.length > 0 || (profile.skills && profile.skills.length > 0)) && (
                  <div>
                    <h3 className="text-label-lg font-label-lg text-on-surface-variant mb-2">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {(formData.skills.length > 0 ? formData.skills : profile.skills || []).map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm font-label-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-label-md text-on-surface-variant">
                  {(formData.location || profile.location) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {formData.location || profile.location}
                    </span>
                  )}
                  {(formData.website_url || profile.website_url) && (
                    <a 
                      href={formData.website_url || profile.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Globe size={14} />
                      Portfolio
                    </a>
                  )}
                  {(formData.linkedin_url || profile.linkedin_url) && (
                    <a 
                      href={formData.linkedin_url || profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <ExternalLink size={14} />
                      LinkedIn
                    </a>
                  )}
                  {(formData.github_url || profile.github_url) && (
                    <a 
                      href={formData.github_url || profile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <ExternalLink size={14} />
                      GitHub
                    </a>
                  )}
                  {(formData.twitter_url || profile.twitter_url) && (
                    <a 
                      href={formData.twitter_url || profile.twitter_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <MessageSquare size={14} />
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-label-md flex items-center justify-between animate-slide-in">
            {error}
            <button onClick={() => setError(null)} className="ml-4 p-1 hover:bg-error/20 rounded">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <nav className="flex border-b border-outline-variant/30" aria-label="Profile tabs">
            {[
              { id: 'posts', label: 'Publicaciones', icon: <Briefcase size={18} /> },
              { id: 'activity', label: 'Actividad', icon: <Award size={18} /> },
              { id: 'applications', label: 'Aplicaciones', icon: <Briefcase size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-label-md font-label-md transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="text-center py-12">
                <FileText className="text-on-surface-variant/50 mx-auto mb-4" size={64} />
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Sin publicaciones aún</h3>
                <p className="text-body-md text-on-surface-variant mb-6">Comparte tu primer proyecto, logro o artículo</p>
                <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md flex items-center gap-2 mx-auto hover:scale-[0.98] transition-transform">
                  <Plus size={18} />
                  Crear publicación
                </button>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="text-center py-12">
                <LayoutGrid className="text-on-surface-variant/50 mx-auto mb-4" size={64} />
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Actividad reciente</h3>
                <p className="text-body-md text-on-surface-variant">Tu actividad aparecerá aquí</p>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="text-center py-12">
                <Briefcase className="text-on-surface-variant/50 mx-auto mb-4" size={64} />
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2">Sin aplicaciones</h3>
                <p className="text-body-md text-on-surface-variant mb-6">Cuando apliques a ofertas, aparecerán aquí</p>
                <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md flex items-center gap-2 mx-auto hover:scale-[0.98] transition-transform">
                  <Briefcase size={18} />
                  Ver ofertas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;