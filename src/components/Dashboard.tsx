import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, User, BookOpen, Briefcase, Bell, Search, Settings,
  Heart, MessageCircle, Share2, Bookmark, Clock, Star,
  MapPin, Calendar, Video, Mail, CheckCircle, X,
  Edit3, ChevronRight, Play, Users, Eye, TrendingUp,
  Trash2, Send, Award, Zap,
  AlignLeft, Image as ImageIcon, Timer,
  Building2, Upload, MoreHorizontal, LogOut,
  Flame, LogOut as SignOut
} from 'lucide-react'
import { signOut, getSession } from '@/lib/auth'

type Nav = 'feed' | 'profile' | 'courses' | 'applications'
type ProfileTab = 'about' | 'experience' | 'skills' | 'posts'
type CourseFilter = 'All' | 'Design' | 'Tech' | 'Business' | 'Communication'

interface Post {
  id: string
  type: 'regular' | 'temporary'
  authorName: string
  authorTitle: string
  authorAvatar: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timeAgo: string
  expiresMinutes?: number
  liked: boolean
  saved: boolean
  isOwn?: boolean
}

interface Course {
  id: string
  title: string
  instructor: string
  category: CourseFilter
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  enrolledCount: number
  rating: number
  reviews: number
  thumbnail: string
  isEnrolled: boolean
  progress: number
  price: string
  tags: string[]
}

interface Application {
  id: string
  company: string
  initials: string
  color: string
  role: string
  location: string
  type: string
  salary: string
  appliedDate: string
  status: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offer Received' | 'Rejected'
  recruiter?: string
  nextAction?: string
}

const ME = {
  name: getSession()?.name || 'Alex Rivera',
  title: 'Junior UX Designer',
  location: 'Barcelona, Spain',
  bio: 'Passionate about crafting human-centred digital experiences. Currently seeking opportunities in product design and UX research.',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
  banner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=300&fit=crop&auto=format',
  connections: 342,
  profileViews: 1248,
  applicationsCount: 12,
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1', type: 'temporary', authorName: ME.name, authorTitle: ME.title, authorAvatar: ME.avatar,
    content: '🔴 Live portfolio review happening NOW on Google Meet! Joining for the next 3 hours as I walk through my healthcare app redesign case study. Feedback welcome from everyone — designers, devs, PMs. Link in comments!',
    likes: 47, comments: 12, shares: 8, timeAgo: '45m ago', expiresMinutes: 183, liked: false, saved: false, isOwn: true,
  },
  {
    id: '2', type: 'regular', authorName: 'Maya Chen', authorTitle: 'Product Designer at Figma',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format',
    content: 'Just published my guide on building scalable design systems from scratch. After 2 years of iteration at Figma, here are the 10 principles we swear by — a thread for all junior designers trying to figure out tokens, components, and documentation.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=420&fit=crop&auto=format',
    likes: 234, comments: 56, shares: 89, timeAgo: '2h ago', liked: true, saved: true,
  },
  {
    id: '3', type: 'temporary', authorName: 'James Okafor', authorTitle: 'Senior Frontend Dev at Stripe',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format',
    content: "⏰ Quick tip of the day: Stop using lorem ipsum in your prototypes. Real content reveals real problems. I've caught 6 critical layout bugs this week just by switching to actual copy. This post self-destructs in a few hours — share it while you can!",
    likes: 89, comments: 23, shares: 41, timeAgo: '1h ago', expiresMinutes: 342, liked: false, saved: false,
  },
  {
    id: '4', type: 'regular', authorName: ME.name, authorTitle: ME.title, authorAvatar: ME.avatar,
    content: 'Excited to share my latest case study — a full redesign of a healthcare appointment scheduling app. Challenge: improve accessibility for elderly users while keeping the interface intuitive for all ages. WCAG 2.1 AA compliant, tested with 40 real users. Result: 67% reduction in task completion time.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=420&fit=crop&auto=format',
    likes: 118, comments: 34, shares: 22, timeAgo: '3h ago', liked: false, saved: true, isOwn: true,
  },
  {
    id: '5', type: 'regular', authorName: 'Priya Sharma', authorTitle: 'UX Researcher at Booking.com',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format',
    content: "We just wrapped a 3-month longitudinal study on checkout flows. Biggest finding? The 'guest checkout' placement matters more than field count. Full paper drops next week — follow for the link.",
    likes: 312, comments: 78, shares: 145, timeAgo: '5h ago', liked: false, saved: false,
  },
]

const COURSES: Course[] = [
  { id: 'c1', title: 'UX Research Fundamentals', instructor: 'Priya Sharma', category: 'Design', level: 'Beginner', duration: '8h 30m', enrolledCount: 4821, rating: 4.8, reviews: 892, thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop&auto=format', isEnrolled: true, progress: 65, price: 'Free', tags: ['Research', 'Interviews', 'Surveys'] },
  { id: 'c2', title: 'Figma Advanced: Design Systems at Scale', instructor: 'Maya Chen', category: 'Design', level: 'Intermediate', duration: '6h 15m', enrolledCount: 3201, rating: 4.9, reviews: 641, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop&auto=format', isEnrolled: true, progress: 20, price: 'Free', tags: ['Figma', 'Tokens', 'Components'] },
  { id: 'c3', title: 'React for Designers', instructor: 'James Okafor', category: 'Tech', level: 'Intermediate', duration: '12h 45m', enrolledCount: 2890, rating: 4.6, reviews: 513, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop&auto=format', isEnrolled: false, progress: 0, price: '€49', tags: ['React', 'JavaScript', 'Hooks'] },
  { id: 'c4', title: 'Negotiate Your First Salary', instructor: 'Carlos Mendez', category: 'Business', level: 'Beginner', duration: '3h 20m', enrolledCount: 6102, rating: 4.7, reviews: 1204, thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=340&fit=crop&auto=format', isEnrolled: false, progress: 0, price: 'Free', tags: ['Negotiation', 'Career', 'Offers'] },
  { id: 'c5', title: 'Public Speaking for Tech', instructor: 'Amara Diallo', category: 'Communication', level: 'Beginner', duration: '5h 10m', enrolledCount: 3890, rating: 4.5, reviews: 728, thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=340&fit=crop&auto=format', isEnrolled: false, progress: 0, price: '€29', tags: ['Presentations', 'Confidence', 'Storytelling'] },
  { id: 'c6', title: 'Python for Non-Programmers', instructor: 'Lisa Zhang', category: 'Tech', level: 'Beginner', duration: '15h 00m', enrolledCount: 8201, rating: 4.4, reviews: 1890, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop&auto=format', isEnrolled: false, progress: 0, price: '€59', tags: ['Python', 'Data', 'Automation'] },
]

const INITIAL_APPS: Application[] = [
  { id: 'a1', company: 'Google', initials: 'G', color: '#4285F4', role: 'Junior UX Designer', location: 'London, UK (Hybrid)', type: 'Full-time', salary: '£55k – £70k', appliedDate: 'Nov 15, 2024', status: 'Interview Scheduled', recruiter: 'Sarah Miller', nextAction: 'Portfolio presentation — Nov 22 at 14:00 GMT' },
  { id: 'a2', company: 'Airbnb', initials: 'Ab', color: '#FF5A5F', role: 'Product Design Intern', location: 'Remote (EU)', type: 'Internship', salary: '$3,500 / month', appliedDate: 'Nov 10, 2024', status: 'Under Review', recruiter: 'Tom Park', nextAction: 'Awaiting initial screening response' },
  { id: 'a3', company: 'Spotify', initials: 'Sp', color: '#1DB954', role: 'Design Systems Intern', location: 'Stockholm, Sweden', type: 'Internship', salary: 'SEK 28,000 / month', appliedDate: 'Nov 8, 2024', status: 'Applied', nextAction: 'Application under initial review' },
  { id: 'a4', company: 'Bloom Studio', initials: 'Bl', color: '#F59E0B', role: 'UI/UX Designer', location: 'Barcelona, Spain', type: 'Full-time', salary: '€32k – €38k', appliedDate: 'Nov 5, 2024', status: 'Offer Received', recruiter: 'Elena Gomez', nextAction: 'Offer expires Dec 1 — decide by Nov 28' },
  { id: 'a5', company: 'Microsoft', initials: 'Ms', color: '#737373', role: 'UX Researcher', location: 'Amsterdam, Netherlands', type: 'Full-time', salary: '€65,000', appliedDate: 'Oct 28, 2024', status: 'Rejected', nextAction: 'Application closed' },
]

function formatExpiry(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const cfg: Record<string, { bg: string; text: string; dot: string }> = {
    'Applied': { bg: 'bg-blue-900/40', text: 'text-blue-300', dot: 'bg-blue-400' },
    'Under Review': { bg: 'bg-amber-900/40', text: 'text-amber-300', dot: 'bg-amber-400' },
    'Interview Scheduled': { bg: 'bg-violet-900/40', text: 'text-violet-300', dot: 'bg-violet-400' },
    'Offer Received': { bg: 'bg-emerald-900/40', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    'Rejected': { bg: 'bg-red-900/40', text: 'text-red-400', dot: 'bg-red-400' },
  }
  const c = cfg[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{status}
    </span>
  )
}

function LevelBadge({ level }: { level: Course['level'] }) {
  const cfg = { Beginner: 'bg-emerald-900/50 text-emerald-300', Intermediate: 'bg-amber-900/50 text-amber-300', Advanced: 'bg-red-900/50 text-red-300' }
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cfg[level]}`}>{level}</span>
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-[#24476C]'} />
      ))}
    </span>
  )
}

function Avatar({ src, name, size = 40 }: { src: string; name: string; size?: number }) {
  return <img src={src} alt={name} width={size} height={size} className="rounded-full object-cover ring-2 ring-[#24476C]/30" style={{ width: size, height: size, minWidth: size }} />
}

function PostCard({ post, onLike, onSave, onDelete }: { post: Post; onLike: (id: string) => void; onSave: (id: string) => void; onDelete?: (id: string) => void }) {
  const [expiry, setExpiry] = useState(post.expiresMinutes ?? 0)
  const [likeAnim, setLikeAnim] = useState(false)
  const [saveAnim, setSaveAnim] = useState(false)

  useEffect(() => {
    if (post.type !== 'temporary') return
    const t = setInterval(() => setExpiry(e => Math.max(0, e - 1)), 60000)
    return () => clearInterval(t)
  }, [post.type])

  const handleLike = () => {
    setLikeAnim(true)
    setTimeout(() => setLikeAnim(false), 600)
    onLike(post.id)
  }

  const handleSave = () => {
    setSaveAnim(true)
    setTimeout(() => setSaveAnim(false), 600)
    onSave(post.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`rounded-2xl border transition-all duration-200 hover:border-[#2E5A8A]/60 hover:shadow-lg hover:shadow-[#24476C]/5 ${post.type === 'temporary' ? 'bg-[#0D1A31] border-dashed border-[#24476C]/60' : 'bg-[#0D1A31] border-[#1E3354]'}`}
    >
      {post.type === 'temporary' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 border-b border-dashed border-[#24476C]/30 bg-[#24476C]/10 rounded-t-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Timer size={13} className="text-amber-400" />
          </motion.div>
          <span className="text-xs font-semibold text-amber-400">Temporary post · expires in {formatExpiry(expiry)}</span>
          <Flame size={13} className="text-amber-400 ml-auto animate-pulse-glow" />
        </motion.div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar src={post.authorAvatar} name={post.authorName} size={42} />
            <div>
              <p className="font-semibold text-[#E6E8E6] text-sm leading-tight">{post.authorName}</p>
              <p className="text-[#A8A9AD] text-xs mt-0.5">{post.authorTitle} · {post.timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isOwn && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete?.(post.id)}
                className="p-1.5 rounded-lg text-[#A8A9AD] hover:text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={14} />
              </motion.button>
            )}
            <button className="p-1.5 rounded-lg text-[#A8A9AD] hover:text-[#E6E8E6] hover:bg-[#24476C]/30 transition-colors"><MoreHorizontal size={16} /></button>
          </div>
        </div>
        <p className="text-[#D0D3DC] text-sm leading-relaxed mb-3 font-inter">{post.content}</p>
        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden mb-3 bg-[#0A122A]"
          >
            <img src={post.image} alt="Post visual" className="w-full object-cover max-h-64 hover:scale-105 transition-transform duration-500" />
          </motion.div>
        )}
        <div className="flex items-center gap-1 pt-2 border-t border-[#1E3354]">
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${post.liked ? 'text-red-400 bg-red-900/20' : 'text-[#A8A9AD] hover:text-red-400 hover:bg-red-900/20'}`}
          >
            <motion.div
              animate={likeAnim ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Heart size={14} className={post.liked ? 'fill-red-400' : ''} />
            </motion.div>
            {post.likes}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A8A9AD] hover:text-[#60A5FA] hover:bg-blue-900/20 transition-all"
          >
            <MessageCircle size={14} />{post.comments}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A8A9AD] hover:text-[#34D399] hover:bg-emerald-900/20 transition-all"
          >
            <Share2 size={14} />{post.shares}
          </motion.button>
          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={handleSave}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${post.saved ? 'text-[#60A5FA] bg-blue-900/20' : 'text-[#A8A9AD] hover:text-[#60A5FA] hover:bg-blue-900/20'}`}
          >
            <motion.div
              animate={saveAnim ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Bookmark size={14} className={post.saved ? 'fill-[#60A5FA]' : ''} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

const feedContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const feedItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function FeedSection() {
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [showCompose, setShowCompose] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<'regular' | 'temporary'>('regular')

  const handleLike = (id: string) => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  const handleSave = (id: string) => setPosts(ps => ps.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  const handleDelete = (id: string) => setPosts(ps => ps.filter(p => p.id !== id))

  const handlePost = () => {
    if (!newContent.trim()) return
    const post: Post = {
      id: Date.now().toString(), type: newType, authorName: ME.name, authorTitle: ME.title, authorAvatar: ME.avatar,
      content: newContent, likes: 0, comments: 0, shares: 0, timeAgo: 'just now',
      expiresMinutes: newType === 'temporary' ? 360 : undefined, liked: false, saved: false, isOwn: true,
    }
    setPosts(ps => [post, ...ps])
    setNewContent('')
    setShowCompose(false)
  }

  const tempPosts = posts.filter(p => p.type === 'temporary')

  return (
    <motion.div
      variants={feedContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto px-4 py-6 space-y-5"
    >
      <motion.div variants={feedItemVariants} className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={ME.avatar} name={ME.name} size={40} />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowCompose(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-xl bg-[#0A122A] border border-[#1E3354] text-[#A8A9AD] text-sm hover:border-[#24476C] hover:text-[#E6E8E6] transition-all"
          >
            Share an achievement, tip, or update…
          </motion.button>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setNewType('regular'); setShowCompose(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A8A9AD] hover:text-[#E6E8E6] hover:bg-[#24476C]/20 transition-all border border-transparent hover:border-[#24476C]/30"
          >
            <AlignLeft size={13} />Regular post
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setNewType('temporary'); setShowCompose(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A8A9AD] hover:text-[#E6E8E6] hover:bg-[#24476C]/20 transition-all border border-transparent hover:border-[#24476C]/30"
          >
            <Timer size={13} />Temporary
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[#0D1A31] rounded-2xl border border-[#24476C]/40 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3354]">
                <h3 className="font-bold text-[#E6E8E6]">Create Post</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowCompose(false)}
                  className="p-1.5 rounded-lg hover:bg-[#24476C]/30 text-[#A8A9AD]"
                >
                  <X size={18} />
                </motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-2">
                  {(['regular', 'temporary'] as const).map(t => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewType(t)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${newType === t ? 'bg-[#24476C] text-white' : 'bg-[#0A122A] text-[#A8A9AD] hover:text-[#E6E8E6]'}`}
                    >
                      {t === 'temporary' ? <Timer size={14} /> : <AlignLeft size={14} />}
                      {t === 'regular' ? 'Permanent post' : 'Temporary (6h)'}
                    </motion.button>
                  ))}
                </div>
                <AnimatePresence>
                  {newType === 'temporary' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-start gap-2 p-3 bg-amber-900/20 rounded-xl border border-amber-900/40 overflow-hidden"
                    >
                      <Timer size={14} className="text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-300 font-inter">This post will automatically disappear after 6 hours.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-start gap-3">
                  <Avatar src={ME.avatar} name={ME.name} size={38} />
                  <textarea autoFocus value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="What's on your mind?" rows={4} className="flex-1 bg-[#0A122A] rounded-xl border border-[#1E3354] p-3 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] resize-none focus:outline-none focus:border-[#24476C] transition-all font-inter" />
                </div>
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 rounded-xl text-sm text-[#A8A9AD] hover:text-[#E6E8E6] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={newContent.trim() ? { scale: 1.02 } : {}}
                    whileTap={newContent.trim() ? { scale: 0.98 } : {}}
                    onClick={handlePost}
                    disabled={!newContent.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-semibold disabled:opacity-40 transition-all"
                  >
                    <Send size={14} />Publish
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tempPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame size={15} className="text-amber-400 animate-pulse-glow" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Expiring Soon</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {tempPosts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="shrink-0 w-48 bg-gradient-to-br from-[#24476C]/30 to-[#0A122A] rounded-2xl border border-dashed border-[#24476C]/50 p-3 cursor-pointer hover:border-[#24476C] transition-all"
                >
                  <Avatar src={p.authorAvatar} name={p.authorName} size={36} />
                  <p className="text-xs font-semibold text-[#E6E8E6] mt-2 line-clamp-3 leading-relaxed font-inter">{p.content.substring(0, 80)}…</p>
                  <div className="flex items-center gap-1 mt-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Timer size={10} className="text-amber-400" />
                    </motion.div>
                    <span className="text-[10px] text-amber-400 font-semibold">{formatExpiry(p.expiresMinutes ?? 0)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={feedContainerVariants} className="space-y-4">
        <AnimatePresence>
          {posts.map(post => (
            <motion.div
              key={post.id}
              variants={feedItemVariants}
              layout
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            >
              <PostCard post={post} onLike={handleLike} onSave={handleSave} onDelete={handleDelete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

const profileContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const profileItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const tabContentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.15 } },
}

function ProfileSection() {
  const [tab, setTab] = useState<ProfileTab>('about')
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(ME.bio)

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'about', label: 'About' }, { key: 'experience', label: 'Experience' }, { key: 'skills', label: 'Skills' }, { key: 'posts', label: 'My Posts' },
  ]

  const myPosts = INITIAL_POSTS.filter(p => p.isOwn)

  return (
    <motion.div
      variants={profileContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 py-6"
    >
      <motion.div variants={profileItemVariants} className="relative rounded-2xl overflow-hidden bg-[#0A122A] mb-0">
        <img src={ME.banner} alt="Profile banner" className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A122A]/80 to-transparent" />
      </motion.div>

      <motion.div
        variants={profileItemVariants}
        className="bg-[#0D1A31] border border-[#1E3354] rounded-2xl px-6 pt-0 pb-5 -mt-1 rounded-t-none border-t-0"
      >
        <div className="flex items-end justify-between mb-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative -mt-10"
          >
            <img src={ME.avatar} alt={ME.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-[#0D1A31] border-2 border-[#24476C]" />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#24476C] text-[#E6E8E6] text-sm font-semibold hover:bg-[#24476C]/20 transition-all"
          >
            <Edit3 size={14} />{editing ? 'Save Profile' : 'Edit Profile'}
          </motion.button>
        </div>

        <h1 className="text-2xl font-bold text-[#E6E8E6]">{ME.name}</h1>
        <p className="text-[#A8A9AD] text-sm mt-0.5">{ME.title}</p>
        <div className="flex items-center gap-1.5 mt-1.5 text-[#A8A9AD] text-xs"><MapPin size={12} />{ME.location}</div>

        {editing ? (
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full mt-3 bg-[#0A122A] border border-[#24476C] rounded-xl p-3 text-sm text-[#E6E8E6] resize-none focus:outline-none font-inter" />
        ) : (
          <p className="text-[#C0C4CE] text-sm mt-3 leading-relaxed font-inter">{bio}</p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#1E3354]">
          {[
            { icon: Users, label: 'Connections', value: ME.connections },
            { icon: Eye, label: 'Profile views', value: ME.profileViews.toLocaleString() },
            { icon: Briefcase, label: 'Applications', value: ME.applicationsCount },
          ].map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1, duration: 0.3 }}
              className="text-center"
            >
              <p className="text-xl font-bold text-[#E6E8E6]">{s.value}</p>
              <p className="text-[#A8A9AD] text-xs mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={profileItemVariants} className="flex gap-1 mt-4 bg-[#0D1A31] rounded-xl p-1 border border-[#1E3354]">
        {tabs.map(t => (
          <motion.button
            key={t.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-[#24476C] text-white shadow-sm' : 'text-[#A8A9AD] hover:text-[#E6E8E6]'}`}
          >
            {t.label}
          </motion.button>
        ))}
      </motion.div>

      <div className="mt-4 space-y-3">
        <AnimatePresence mode="wait">
          {tab === 'about' && (
            <motion.div
              key="about"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-5 space-y-4"
            >
              <h3 className="font-bold text-[#E6E8E6] text-sm uppercase tracking-wider text-[#A8A9AD]">Education</h3>
              {[
                { school: 'Universidad de Barcelona', degree: 'BA Visual Communication', period: '2019 – 2023' },
                { school: 'Google UX Design Certificate', degree: 'Professional Certificate', period: '2022' },
              ].map((e, idx) => (
                <motion.div
                  key={e.school}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#24476C]/30 flex items-center justify-center shrink-0"><Award size={16} className="text-[#60A5FA]" /></div>
                  <div><p className="text-sm font-semibold text-[#E6E8E6]">{e.school}</p><p className="text-xs text-[#A8A9AD]">{e.degree} · {e.period}</p></div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'experience' && (
            <motion.div
              key="experience"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-3"
            >
              {[
                { company: 'Freelance', role: 'UX Design Consultant', period: 'Jun 2023 – Present', description: 'Designed interfaces for 8+ clients across e-commerce, fintech, and healthcare.' },
                { company: 'CreativeHub Agency', role: 'Junior Designer (Intern)', period: 'Jan 2023 – May 2023', description: 'Produced wireframes, prototypes, and visual assets for B2B SaaS products.' },
              ].map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#24476C] to-[#0A122A] flex items-center justify-center shrink-0"><Building2 size={16} className="text-[#60A5FA]" /></div>
                    <div><p className="font-bold text-[#E6E8E6]">{exp.role}</p><p className="text-sm text-[#A8A9AD]">{exp.company} · {exp.period}</p><p className="text-sm text-[#C0C4CE] mt-2 leading-relaxed font-inter">{exp.description}</p></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'skills' && (
            <motion.div
              key="skills"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-5 space-y-4"
            >
              {[
                { name: 'Figma', level: 92 }, { name: 'User Research', level: 85 }, { name: 'Prototyping', level: 88 },
                { name: 'Accessibility (WCAG)', level: 80 }, { name: 'Adobe XD', level: 78 }, { name: 'Design Systems', level: 72 },
                { name: 'React (basics)', level: 65 }, { name: 'SQL (basics)', level: 45 },
              ].map((s, idx) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                >
                  <div className="flex justify-between mb-1.5"><span className="text-sm font-medium text-[#E6E8E6]">{s.name}</span><span className="text-xs text-[#A8A9AD]">{s.level}%</span></div>
                  <div className="h-1.5 bg-[#1E3354] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#24476C] to-[#60A5FA]"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'posts' && (
            <motion.div
              key="posts"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {myPosts.map(post => <PostCard key={post.id} post={post} onLike={() => {}} onSave={() => {}} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const courseCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' } }),
}

function CoursesSection() {
  const [filter, setFilter] = useState<CourseFilter>('All')
  const [courses, setCourses] = useState(COURSES)
  const filters: CourseFilter[] = ['All', 'Design', 'Tech', 'Business', 'Communication']
  const displayed = filter === 'All' ? courses : courses.filter(c => c.category === filter)
  const enrolled = courses.filter(c => c.isEnrolled)
  const enroll = (id: string) => setCourses(cs => cs.map(c => c.id === id ? { ...c, isEnrolled: !c.isEnrolled, progress: 0 } : c))

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-[#0A122A] to-[#24476C]"
      >
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=280&fit=crop&auto=format" alt="Learning platform" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative px-8 py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#60A5FA]/20 border border-[#60A5FA]/30 text-[#60A5FA] text-xs font-bold mb-3 uppercase tracking-wider"
          >
            <Zap size={11} />Skill Up & Get Hired
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">Courses built for<br />your career goals</h2>
          <p className="text-[#A8A9AD] text-sm max-w-md font-inter">Curated by industry professionals. Learn skills that employers actually want.</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6 mt-5"
          >
            {[
              { label: 'Courses', value: '48' },
              { label: 'Enrolled', value: '12K+' },
              { label: 'Avg rating', value: '4.7★' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="text-center"
              >
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-[#A8A9AD]">{stat.label}</p>
                {idx < 2 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-[#24476C]" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {enrolled.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <h3 className="text-sm font-bold text-[#A8A9AD] uppercase tracking-wider mb-3">Continue Learning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enrolled.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-4 flex gap-4 hover:border-[#24476C]/60 transition-all"
                >
                  <img src={c.thumbnail} alt={c.title} className="w-20 h-16 rounded-xl object-cover shrink-0 bg-[#0A122A]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#E6E8E6] line-clamp-1">{c.title}</p>
                    <p className="text-xs text-[#A8A9AD] mt-0.5">{c.instructor}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1"><span className="text-[#A8A9AD]">Progress</span><span className="text-[#60A5FA] font-semibold">{c.progress}%</span></div>
                      <div className="h-1.5 bg-[#1E3354] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-[#24476C] to-[#60A5FA] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="shrink-0 w-9 h-9 rounded-xl bg-[#24476C] flex items-center justify-center hover:bg-[#2E5A8A] transition-colors self-center"
                  >
                    <Play size={14} className="text-white ml-0.5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-5 overflow-x-auto pb-1"
      >
        {filters.map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-[#24476C] text-white shadow-sm' : 'bg-[#0D1A31] text-[#A8A9AD] border border-[#1E3354] hover:text-[#E6E8E6] hover:border-[#24476C]/40'}`}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {displayed.map((c, idx) => (
          <motion.div
            key={c.id}
            custom={idx}
            variants={courseCardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] overflow-hidden hover:border-[#24476C]/60 transition-colors duration-200"
          >
            <div className="relative">
              <img src={c.thumbnail} alt={c.title} className="w-full h-40 object-cover bg-[#0A122A] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A31]/60 to-transparent" />
              <div className="absolute top-2.5 left-2.5"><LevelBadge level={c.level} /></div>
              {c.isEnrolled && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#24476C] text-white text-xs font-bold"
                >
                  Enrolled
                </motion.div>
              )}
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] mb-1">{c.category}</p>
              <h4 className="font-bold text-[#E6E8E6] text-sm leading-snug line-clamp-2 mb-1.5">{c.title}</h4>
              <p className="text-xs text-[#A8A9AD] mb-2">{c.instructor}</p>
              <div className="flex items-center gap-1.5 mb-3">
                <Stars rating={c.rating} /><span className="text-xs font-bold text-amber-400">{c.rating}</span><span className="text-xs text-[#A8A9AD]">({c.reviews.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#A8A9AD] mb-3">
                <span className="flex items-center gap-1"><Clock size={11} />{c.duration}</span>
                <span className="flex items-center gap-1"><Users size={11} />{c.enrolledCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#1E3354]">
                <span className={`font-bold text-sm ${c.price === 'Free' ? 'text-emerald-400' : 'text-[#E6E8E6]'}`}>{c.price}</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => enroll(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${c.isEnrolled ? 'bg-[#1E3354] text-[#A8A9AD] hover:bg-red-900/30 hover:text-red-400' : 'bg-[#24476C] hover:bg-[#2E5A8A] text-white'}`}
                >
                  {c.isEnrolled ? 'Unenroll' : 'Enrol Free'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function ApplicationsSection() {
  const [apps] = useState(INITIAL_APPS)
  const [showCallModal, setShowCallModal] = useState<string | null>(null)
  const [showContactModal, setShowContactModal] = useState<string | null>(null)
  const [showNewApp, setShowNewApp] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [contactMsg, setContactMsg] = useState('')

  const statusOrder = ['Applied', 'Under Review', 'Interview Scheduled', 'Offer Received', 'Rejected'] as const
  const counts = statusOrder.reduce<Record<string, number>>((acc, s) => { acc[s] = apps.filter(a => a.status === s).length; return acc }, {})
  const callApp = apps.find(a => a.id === showCallModal)
  const contactApp = apps.find(a => a.id === showContactModal)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-extrabold text-[#E6E8E6]">Applications</h2><p className="text-xs text-[#A8A9AD] mt-0.5">{apps.length} active applications</p></div>
        <button onClick={() => setShowNewApp(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#24476C] hover:bg-[#2E5A8A] rounded-xl text-sm font-bold text-white transition-all"><Upload size={14} />Submit CV</button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {statusOrder.map(s => {
          const cfg: Record<string, string> = { 'Applied': 'border-blue-500/30 bg-blue-900/10', 'Under Review': 'border-amber-500/30 bg-amber-900/10', 'Interview Scheduled': 'border-violet-500/30 bg-violet-900/10', 'Offer Received': 'border-emerald-500/30 bg-emerald-900/10', 'Rejected': 'border-red-500/30 bg-red-900/10' }
          const textCfg: Record<string, string> = { 'Applied': 'text-blue-400', 'Under Review': 'text-amber-400', 'Interview Scheduled': 'text-violet-400', 'Offer Received': 'text-emerald-400', 'Rejected': 'text-red-400' }
          return (
            <div key={s} className={`rounded-xl border p-3 text-center ${cfg[s]}`}>
              <p className={`text-xl font-extrabold ${textCfg[s]}`}>{counts[s] || 0}</p>
              <p className="text-[10px] text-[#A8A9AD] leading-tight mt-0.5 font-medium">{s}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        {apps.map(app => (
          <div key={app.id} className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-5 hover:border-[#24476C]/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-lg" style={{ backgroundColor: app.color }}>{app.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div><h3 className="font-bold text-[#E6E8E6]">{app.role}</h3><p className="text-sm text-[#A8A9AD]">{app.company} · {app.location}</p></div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#A8A9AD]">
                  <span className="flex items-center gap-1"><Briefcase size={11} />{app.type}</span>
                  <span className="flex items-center gap-1"><TrendingUp size={11} />{app.salary}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />Applied {app.appliedDate}</span>
                  {app.recruiter && <span className="flex items-center gap-1"><User size={11} />Recruiter: {app.recruiter}</span>}
                </div>
                {app.nextAction && (
                  <div className="mt-2.5 flex items-start gap-1.5 p-2.5 bg-[#0A122A] rounded-xl border border-[#1E3354]">
                    <ChevronRight size={12} className="text-[#60A5FA] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#C0C4CE] font-inter">{app.nextAction}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  {app.status !== 'Rejected' && (
                    <>
                      <button onClick={() => setShowCallModal(app.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#24476C]/30 border border-[#24476C]/40 text-[#60A5FA] text-xs font-semibold hover:bg-[#24476C]/50 transition-all"><Video size={12} />Schedule Call</button>
                      <button onClick={() => setShowContactModal(app.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A122A] border border-[#1E3354] text-[#A8A9AD] text-xs font-semibold hover:text-[#E6E8E6] hover:border-[#24476C]/40 transition-all"><Mail size={12} />Contact</button>
                    </>
                  )}
                  {app.status === 'Offer Received' && <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/30 border border-emerald-900/50 text-emerald-400 text-xs font-semibold hover:bg-emerald-900/50 transition-all"><CheckCircle size={12} />Accept Offer</button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCallModal && callApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0D1A31] rounded-2xl border border-[#24476C]/40 w-full max-w-md shadow-2xl animate-scalePop">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3354]">
              <div className="flex items-center gap-2"><Video size={16} className="text-[#60A5FA]" /><h3 className="font-bold text-[#E6E8E6]">Schedule Video Interview</h3></div>
              <button onClick={() => setShowCallModal(null)} className="p-1.5 rounded-lg hover:bg-[#24476C]/30 text-[#A8A9AD]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#0A122A] rounded-xl">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white" style={{ backgroundColor: callApp.color }}>{callApp.initials}</div>
                <div><p className="font-semibold text-[#E6E8E6] text-sm">{callApp.company}</p><p className="text-xs text-[#A8A9AD]">{callApp.role}</p></div>
              </div>
              <div><label className="text-xs font-semibold text-[#A8A9AD] uppercase tracking-wider">Preferred Date</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1.5 w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-3 py-2.5 text-sm text-[#E6E8E6] focus:outline-none focus:border-[#24476C]" /></div>
              <div><label className="text-xs font-semibold text-[#A8A9AD] uppercase tracking-wider">Preferred Time</label><div className="grid grid-cols-3 gap-2 mt-1.5">{['09:00','10:30','12:00','14:00','15:30','17:00'].map(t => (<button key={t} onClick={() => setSelectedTime(t)} className={`py-2 rounded-xl text-sm font-semibold transition-all ${selectedTime === t ? 'bg-[#24476C] text-white' : 'bg-[#0A122A] text-[#A8A9AD] border border-[#1E3354] hover:border-[#24476C]/40 hover:text-[#E6E8E6]'}`}>{t}</button>))}</div></div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowCallModal(null)} className="flex-1 py-2.5 rounded-xl text-sm text-[#A8A9AD] border border-[#1E3354] hover:text-[#E6E8E6] transition-colors">Cancel</button>
                <button onClick={() => setShowCallModal(null)} disabled={!selectedDate || !selectedTime} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold disabled:opacity-40 transition-all"><Send size={14} />Request Call</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContactModal && contactApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0D1A31] rounded-2xl border border-[#24476C]/40 w-full max-w-md shadow-2xl animate-scalePop">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3354]">
              <div className="flex items-center gap-2"><Mail size={16} className="text-[#60A5FA]" /><h3 className="font-bold text-[#E6E8E6]">Contact Employer</h3></div>
              <button onClick={() => setShowContactModal(null)} className="p-1.5 rounded-lg hover:bg-[#24476C]/30 text-[#A8A9AD]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#0A122A] rounded-xl">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white" style={{ backgroundColor: contactApp.color }}>{contactApp.initials}</div>
                <div><p className="font-semibold text-[#E6E8E6] text-sm">{contactApp.company}</p><p className="text-xs text-[#A8A9AD]">{contactApp.role}</p></div>
              </div>
              <div><label className="text-xs font-semibold text-[#A8A9AD] uppercase tracking-wider">Message</label><textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} rows={4} className="mt-1.5 w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-3 py-2.5 text-sm text-[#E6E8E6] resize-none focus:outline-none focus:border-[#24476C] font-inter" placeholder="Write a brief message…" /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowContactModal(null)} className="flex-1 py-2.5 rounded-xl text-sm text-[#A8A9AD] border border-[#1E3354] hover:text-[#E6E8E6] transition-colors">Cancel</button>
                <button onClick={() => setShowContactModal(null)} disabled={!contactMsg.trim()} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold disabled:opacity-40 transition-all"><Send size={14} />Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0D1A31] rounded-2xl border border-[#24476C]/40 w-full max-w-lg shadow-2xl animate-scalePop">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E3354]">
              <div className="flex items-center gap-2"><Upload size={16} className="text-[#60A5FA]" /><h3 className="font-bold text-[#E6E8E6]">Submit New Application</h3></div>
              <button onClick={() => setShowNewApp(false)} className="p-1.5 rounded-lg hover:bg-[#24476C]/30 text-[#A8A9AD]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-xs font-semibold text-[#A8A9AD] uppercase tracking-wider">Company</label><input className="mt-1.5 w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-3 py-2.5 text-sm text-[#E6E8E6] focus:outline-none focus:border-[#24476C]" placeholder="Company name" /></div>
              <div><label className="text-xs font-semibold text-[#A8A9AD] uppercase tracking-wider">Role</label><input className="mt-1.5 w-full bg-[#0A122A] border border-[#1E3354] rounded-xl px-3 py-2.5 text-sm text-[#E6E8E6] focus:outline-none focus:border-[#24476C]" placeholder="Job title" /></div>
              <div><label className="text-xs font-semibold text-[#A8A9AD] uppercase tracking-wider">CV / Resume</label><div className="mt-1.5 border-2 border-dashed border-[#1E3354] rounded-xl p-6 text-center hover:border-[#24476C] transition-colors cursor-pointer"><Upload size={20} className="text-[#A8A9AD] mx-auto mb-2" /><p className="text-xs text-[#A8A9AD] font-inter">Drop your file here or click to browse</p></div></div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowNewApp(false)} className="flex-1 py-2.5 rounded-xl text-sm text-[#A8A9AD] border border-[#1E3354] hover:text-[#E6E8E6] transition-colors">Cancel</button>
                <button className="flex-1 py-2.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold transition-all"><Upload size={14} />Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { motion } from 'framer-motion'

interface DashboardProps {
  onSignOut: () => void
}

export default function Dashboard({ onSignOut }: DashboardProps) {
  const [activeNav, setActiveNav] = useState<Nav>('feed')

  const navItems: { key: Nav; icon: React.ElementType; label: string }[] = [
    { key: 'feed', icon: Home, label: 'Feed' },
    { key: 'profile', icon: User, label: 'Profile' },
    { key: 'courses', icon: BookOpen, label: 'Courses' },
    { key: 'applications', icon: Briefcase, label: 'Applications' },
  ]

  const handleSignOut = () => {
    signOut()
    onSignOut()
  }

  const sectionVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  return (
    <div className="min-h-screen bg-[#06091A] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0A122A] border-r border-[#1E3354] fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent">Dedran</h1>
          <p className="text-xs text-[#A8A9AD] mt-0.5 font-inter">Career Launch Platform</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeNav === item.key
                  ? 'bg-[#24476C] text-white shadow-sm'
                  : 'text-[#A8A9AD] hover:text-[#E6E8E6] hover:bg-[#24476C]/20'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#1E3354]">
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar src={ME.avatar} name={ME.name} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#E6E8E6] truncate">{ME.name}</p>
              <p className="text-xs text-[#A8A9AD] truncate font-inter">{ME.title}</p>
            </div>
            <button onClick={handleSignOut} className="p-2 rounded-lg text-[#A8A9AD] hover:text-red-400 hover:bg-red-900/20 transition-all" title="Sign out">
              <SignOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[#06091A]/80 backdrop-blur-md border-b border-[#1E3354]">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="lg:hidden">
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent">Dedran</h1>
            </div>
            <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A9AD]" />
                <input className="w-full bg-[#0A122A] border border-[#1E3354] rounded-xl pl-9 pr-4 py-2 text-sm text-[#E6E8E6] placeholder-[#A8A9AD] focus:outline-none focus:border-[#24476C] transition-colors font-inter" placeholder="Search courses, posts, people..." />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-[#A8A9AD] hover:text-[#E6E8E6] hover:bg-[#24476C]/20 transition-all relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-xl text-[#A8A9AD] hover:text-[#E6E8E6] hover:bg-[#24476C]/20 transition-all">
                <Settings size={18} />
              </button>
              <div className="lg:hidden">
                <Avatar src={ME.avatar} name={ME.name} size={32} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <motion.div key={activeNav} variants={sectionVariants} initial="initial" animate="animate">
          {activeNav === 'feed' && <FeedSection />}
          {activeNav === 'profile' && <ProfileSection />}
          {activeNav === 'courses' && <CoursesSection />}
          {activeNav === 'applications' && <ApplicationsSection />}
        </motion.div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A122A] border-t border-[#1E3354] z-50">
        <div className="flex">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold transition-all ${
                activeNav === item.key ? 'text-[#60A5FA]' : 'text-[#A8A9AD]'
              }`}
            >
              <item.icon size={18} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
