import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  X, Image, FileText, Code2, Trophy, Briefcase, BookOpen,
  Send, Loader2, Smile, Paperclip, Hash, Globe, Link2
} from 'lucide-react';

const POST_TYPES = [
  { value: 'post', label: 'Publicación', icon: FileText, color: 'primary' },
  { value: 'article', label: 'Artículo', icon: BookOpen, color: 'tertiary' },
  { value: 'project', label: 'Proyecto', icon: Code2, color: 'secondary' },
  { value: 'achievement', label: 'Logro', icon: Trophy, color: 'warning' },
  { value: 'job', label: 'Oferta de empleo', icon: Briefcase, color: 'success' },
];

const CreatePost = ({ onClose, onPostCreated, defaultType = 'post' }) => {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState(defaultType);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('write');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentType = POST_TYPES.find(t => t.value === selectedType) || POST_TYPES[0];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    const remainingSlots = 4 - mediaFiles.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);
    
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles(prev => [...prev, { file, preview: reader.result, type: file.type }]);
      };
      reader.readAsDataURL(file);
    });
    
    if (e.target) e.target.value = '';
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags(prev => [...prev, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleTagRemove = (tag) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      let mediaUrls = [];
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map(async (media, index) => {
          const fileName = `${user.id}/${Date.now()}_${index}.${media.file.name.split('.').pop()}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('posts')
            .upload(fileName, media.file, { upsert: false });
          
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(uploadData.path);
          return publicUrl;
        });
        mediaUrls = await Promise.all(uploadPromises);
      }

      const postData = {
        author_id: user.id,
        content: content.trim(),
        type: selectedType,
        media_urls: mediaUrls,
        tags: tags,
        is_published: true,
      };

      if (linkUrl.trim()) {
        postData.media_urls = [linkUrl.trim(), ...mediaUrls];
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select(`
          *,
          author:profiles!posts_author_id_fkey(*)
        `)
        .single();

      if (error) throw error;

      if (onPostCreated) onPostCreated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm starry-bg">
      <div className="w-full max-w-2xl bg-surface-container rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-variant transition-colors text-on-surface-variant"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            <h2 className="text-headline-md font-headline-md text-on-surface">Crear publicación</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-label-md appearance-none pr-8"
            >
              {POST_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && mediaFiles.length === 0)}
              className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-md flex items-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Publicar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container/50">
          {[
            { id: 'write', label: 'Escribir', icon: FileText },
            { id: 'media', label: 'Multimedia', icon: Image },
            { id: 'tags', label: 'Etiquetas', icon: Hash },
            { id: 'link', label: 'Enlace', icon: Link2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-label-md font-label-md transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-surface-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panels */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl text-label-md flex items-center justify-between animate-slide-in">
              {error}
              <button onClick={() => setError(null)} className="ml-3 p-1 hover:bg-error/20 rounded">✕</button>
            </div>
          )}

          {/* Write Tab */}
          {activeTab === 'write' && (
            <div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`¿Qué estás pensando? ${currentType.label}...`}
                rows={6}
                className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none font-body-md text-body-md"
                style={{ minHeight: '120px' }}
              />
              <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                <span>{content.length}/3000 caracteres</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl hover:bg-surface-variant transition-colors text-on-surface-variant" aria-label="Añadir emoji">
                    <Smile size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                    {media.type.startsWith('video/') ? (
                      <video src={media.preview} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={media.preview} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 w-7 h-7 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
                      aria-label="Eliminar archivo"
                    >
                      <X size={16} className="text-on-background" />
                    </button>
                  </div>
                ))}
                {mediaFiles.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-surface-variant transition-colors group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Paperclip size={28} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    <span className="text-label-sm text-on-surface-variant mt-2 text-center px-2">Añadir archivo</span>
                  </label>
                )}
              </div>
              <p className="text-label-sm text-on-surface-variant text-center">
                {mediaFiles.length}/4 archivos · Imágenes y videos · Máx. 10MB cada uno
              </p>
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  placeholder="Añadir etiqueta (ej: react, junior, portfolio)"
                  className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none text-label-md"
                />
                <button
                  onClick={handleTagAdd}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-md disabled:opacity-50"
                >
                  Añadir
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm">
                    #{tag}
                    <button onClick={() => handleTagRemove(tag)} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-center text-on-surface-variant py-4 text-label-md">Las etiquetas ayudan a que otros encuentren tu contenido</p>
              )}
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div>
              <div className="space-y-3">
                <div>
                  <label className="block text-label-md font-label-md mb-2 text-on-surface-variant">Enlace (opcional)</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://github.com/tuusuario/tuproyecto"
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <p className="text-label-sm text-on-surface-variant">
                  Para ofertas de empleo o proyectos, añade el enlace directo. Se mostrará como botón "Ver proyecto/oferta".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;