import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, Briefcase, Users, TrendingUp, BookOpen, Clock, Award, Zap, Sparkles } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const as const } },
}

const stats = [
  { icon: Briefcase, label: 'Job Opportunities', value: '5,000+' },
  { icon: Users, label: 'Young Professionals', value: '50,000+' },
  { icon: TrendingUp, label: 'Success Rate', value: '92%' },
]

function AnimatedStat({ value, label, icon: Icon, idx }: { value: string; label: string; icon: React.ElementType; idx: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayed, setDisplayed] = useState('0')

  const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9,]/g, '')

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(numericValue / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numericValue) {
        setDisplayed(value)
        clearInterval(timer)
      } else {
        setDisplayed(start.toLocaleString() + suffix)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, numericValue, suffix, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.15 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-[#0D1A31] p-6 rounded-2xl border border-[#1E3354] hover:border-[#24476C]/60 hover:shadow-lg hover:shadow-[#24476C]/10 transition-all duration-300"
      style={{ animationDelay: `${idx * 0.5}s` }}
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-10 h-10 text-[#60A5FA] mb-4" />
      </motion.div>
      <motion.h3
        key={displayed}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="text-3xl font-extrabold text-[#E6E8E6] mb-1"
      >
        {displayed}
      </motion.h3>
      <p className="text-[#A8A9AD] text-sm font-medium">{label}</p>
    </motion.div>
  )
}

const features = [
  {
    title: 'Customizable Profiles',
    description: 'Showcase your unique skills, qualifications, and achievements with a professional portfolio that stands out to recruiters.',
    icon: Sparkles,
  },
  {
    title: 'Share Your Journey',
    description: 'Post your wins, insights, and daily learnings. Connect with like-minded professionals and grow your network.',
    icon: Users,
  },
  {
    title: 'Learn & Grow',
    description: 'Access curated courses across design, tech, business, and communication — built to boost real-world employability.',
    icon: BookOpen,
  },
  {
    title: 'Track Applications',
    description: 'Manage your CV submissions, schedule interviews, and monitor every stage of your application pipeline in real time.',
    icon: TrendingUp,
  },
]

const featuredCourses = [
  { title: 'UX Research Fundamentals', instructor: 'Priya Sharma', category: 'Design', level: 'Beginner', duration: '8h 30m', icon: BookOpen },
  { title: 'React for Designers', instructor: 'James Okafor', category: 'Tech', level: 'Intermediate', duration: '12h 45m', icon: Zap },
  { title: 'Negotiate Your Salary', instructor: 'Carlos Mendez', category: 'Business', level: 'Beginner', duration: '3h 20m', icon: Award },
]

export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-[#06091A]">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="sticky top-0 z-50 bg-[#06091A]/80 backdrop-blur-md border-b border-[#1E3354]"
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#24476C] bg-clip-text text-transparent tracking-tight"
          >
            Dedran
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('sign-in')}
              className="text-[#A8A9AD] hover:text-[#E6E8E6] transition-colors text-sm font-semibold"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('sign-up')}
              className="px-5 py-2 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white text-sm font-bold transition-all"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      <section className="relative min-h-screen overflow-hidden pt-20 pb-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#24476C]/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0A122A]/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#60A5FA]/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />

        <motion.div className="relative max-w-6xl mx-auto px-4" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24476C]/20 border border-[#24476C]/30 text-[#60A5FA] text-xs font-bold mb-6 uppercase tracking-wider"
            >
              <Sparkles size={13} />
              Your Career, Amplified
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#E6E8E6] mb-6 leading-tight">
              Launch Your{' '}
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#24476C] to-[#0A122A] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">
                Career Journey
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#A8A9AD] mb-8 max-w-3xl mx-auto leading-relaxed font-inter">
              Dedran empowers young professionals to build standout profiles, learn in-demand skills,
              connect with a thriving community, and track every job application — all in one place.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={() => onNavigate('sign-up')}
              className="group px-8 py-3.5 rounded-xl bg-[#24476C] hover:bg-[#2E5A8A] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#24476C]/20"
            >
              Get Started Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('sign-in')}
              className="px-8 py-3.5 rounded-xl border-2 border-[#24476C] text-[#E6E8E6] font-bold text-sm hover:bg-[#24476C]/10 transition-all"
            >
              Sign In
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-5 mb-16">
            {stats.map((stat, idx) => (
              <AnimatedStat key={idx} {...stat} idx={idx} />
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#E6E8E6] mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-[#A8A9AD] text-center mb-12 max-w-2xl mx-auto font-inter">
              From building your profile to landing your dream job — Dedran provides every tool you need, completely free.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
                {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  className="bg-[#0D1A31] p-6 rounded-2xl border border-[#1E3354] hover:border-[#60A5FA]/40 transition-all duration-300 cursor-default group"
                  whileHover={{ scale: 1.01, y: -6 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className="w-12 h-12 rounded-xl bg-[#24476C]/30 flex items-center justify-center shrink-0 group-hover:bg-[#24476C]/50 transition-colors duration-300"
                    >
                      <feat.icon size={20} className="text-[#60A5FA] group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-[#E6E8E6] mb-2 group-hover:text-[#60A5FA] transition-colors duration-300">{feat.title}</h3>
                      <p className="text-[#A8A9AD] text-sm leading-relaxed font-inter">{feat.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-[#0A122A] border-t border-[#1E3354]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#E6E8E6] mb-4">Popular Courses</h2>
            <p className="text-[#A8A9AD] font-inter">Boost your skills with top-rated courses from industry experts</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredCourses.map((course, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-[#06091A] rounded-2xl overflow-hidden border border-[#1E3354] hover:border-[#24476C]/60 transition-all duration-300 cursor-pointer group"
              >
                <div className="h-44 bg-gradient-to-br from-[#24476C]/30 to-[#0A122A] flex items-center justify-center">
                  <course.icon className="w-16 h-16 text-[#24476C]/50 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#24476C]/20 text-[#60A5FA] text-xs font-bold mb-3 uppercase tracking-wider">
                    {course.category}
                  </span>
                  <h3 className="text-lg font-bold text-[#E6E8E6] mb-2">{course.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#A8A9AD]">
                      <Award size={14} />
                      {course.instructor}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#A8A9AD]">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#1E3354]">
                    <span className="text-xs font-bold text-[#A8A9AD] uppercase tracking-wide">{course.level}</span>
                    <button className="text-[#60A5FA] font-bold text-sm hover:text-white transition-colors">
                      Enroll &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#0A122A] via-[#24476C] to-[#0A122A] relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(96,165,250,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(96,165,250,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(96,165,250,0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Transform Your Career?</h2>
            <p className="text-lg text-[#A8A9AD] mb-8 max-w-2xl mx-auto font-inter">
              Join thousands of young professionals already building their future on Dedran
            </p>
            <motion.button
              onClick={() => onNavigate('sign-up')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl bg-white text-[#0A122A] font-bold transition-all"
            >
              Create Free Account
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#0A122A] border-t border-[#1E3354] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-8 mb-8"
          >
            <motion.div variants={itemVariants}>
              <motion.h3
                whileHover={{ scale: 1.02 }}
                className="font-extrabold text-lg mb-4 text-white"
              >
                Dedran
              </motion.h3>
              <p className="text-[#A8A9AD] text-sm font-inter leading-relaxed">
                The modern platform for young professionals to build careers, learn skills, and find opportunities.
              </p>
            </motion.div>
            {[
              { title: 'Product', links: ['Courses', 'Community', 'CV Submission'] },
              { title: 'Company', links: ['About', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
            ].map(col => (
              <motion.div key={col.title} variants={itemVariants}>
                <h4 className="font-bold mb-4 text-[#E6E8E6]">{col.title}</h4>
                <ul className="space-y-2 text-sm text-[#A8A9AD]">
                  {col.links.map(link => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 3, color: '#60A5FA' }}
                        className="inline-block hover:text-[#60A5FA] transition-colors font-inter"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="border-t border-[#1E3354] pt-8 text-center text-sm text-[#A8A9AD]"
          >
            <p>&copy; 2024 Dedran. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
