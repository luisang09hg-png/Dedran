import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  X, FileText, BookOpen, Code2, Trophy, Briefcase,
  Send, Loader2, Paperclip, Hash, Link2, Image
} from 'lucide-react';

const POST_TYPES = [
  { value: 'post', label: 'Post', icon: FileText },
  { value: 'article', label: 'Article', icon: BookOpen },
  { value: 'project', label: 'Project', icon: Code2 },
  { value: 'achievement', label: 'Achievement', icon: Trophy },
  { value: 'job', label: 'Job Offer', icon: Briefcase },
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
      if (!user) throw new Error('Not authenticated');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface-container rounded-xl border border-nebula-stroke overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nebula-stroke">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-primary-container/40 transition-colors text-on-surface-variant"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="font-headline-md text-headline-md text-on-surface">Create Post</h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#07090E] border border-charcoal-gray rounded px-3 py-2 text-on-surface focus:border-[#D9D9D6] outline-none font-body-sm text-body-sm"
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
              className="px-5 py-2 rounded bg-[#D9D9D6] text-[#07090E] font-label-caps text-label-caps flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-nebula-stroke bg-surface-container/50">
          {[
            { id: 'write', label: 'Write', icon: FileText },
            { id: 'media', label: 'Media', icon: Image },
            { id: 'tags', label: 'Tags', icon: Hash },
            { id: 'link', label: 'Link', icon: Link2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-label-caps text-label-caps transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-surface-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-primary-container/20'
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
            <div className="bg-error-container text-on-error-container p-3 rounded font-body-sm text-body-sm flex items-center justify-between">
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
                placeholder={`What's on your mind? ${currentType.label}...`}
                rows={6}
                className="w-full bg-[#07090E] border border-charcoal-gray rounded-lg px-4 py-3 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all resize-none font-body-md text-body-md placeholder:text-on-surface-variant"
                style={{ minHeight: '120px' }}
              />
              <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mt-2">
                <span>{content.length}/3000 characters</span>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-surface-container">
                    {media.type.startsWith('video/') ? (
                      <video src={media.preview} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={media.preview} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 w-7 h-7 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors"
                      aria-label="Remove file"
                    >
                      <X size={16} className="text-on-background" />
                    </button>
                  </div>
                ))}
                {mediaFiles.length < 4 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-charcoal-gray flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary-container/20 transition-colors group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Paperclip size={28} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    <span className="font-label-caps text-label-caps text-on-surface-variant mt-2 text-center px-2">Add file</span>
                  </label>
                )}
              </div>
              <p className="font-label-caps text-label-caps text-on-surface-variant text-center mt-2">
                {mediaFiles.length}/4 files &middot; Images & videos &middot; Max 10MB each
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
                  placeholder="Add tag (e.g. react, junior, portfolio)"
                  className="flex-1 bg-[#07090E] border border-charcoal-gray rounded-lg px-4 py-2 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant"
                />
                <button
                  onClick={handleTagAdd}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 rounded bg-primary-container text-on-primary-container font-label-caps text-label-caps disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-primary-container/40 text-primary font-label-caps text-label-caps border border-nebula-stroke">
                    #{tag}
                    <button onClick={() => handleTagRemove(tag)} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-center text-on-surface-variant py-4 font-body-sm text-body-sm">Tags help others discover your content</p>
              )}
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div>
              <div className="space-y-3">
                <div>
                  <label className="block font-label-caps text-label-caps mb-2 text-on-surface-variant">Link (optional)</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://github.com/youruser/yourproject"
                    className="w-full bg-[#07090E] border border-charcoal-gray rounded-lg px-4 py-3 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-sm text-body-sm placeholder:text-on-surface-variant"
                  />
                </div>
                <p className="font-label-caps text-label-caps text-on-surface-variant">
                  For job offers or projects, add the direct link. It will appear as a "View contract/mission" button.
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