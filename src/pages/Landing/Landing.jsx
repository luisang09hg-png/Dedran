import { Link } from 'react-router-dom';
import CosmicBackground from '../../components/ui/CosmicBackground';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { courses as allCourses } from '../../data/courses';

const StarField = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {Array.from({ length: 80 }).map((_, i) => {
      const s = Math.random() * 2 + 1;
      return (
        <div
          key={i}
          className="absolute rounded-full bg-star-glow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${s}px`,
            height: `${s}px`,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      );
    })}
  </div>
);

const features = [
  {
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    title: 'Precision Matching',
    desc: 'AI-driven algorithms align your unique skills with the right opportunities across the professional galaxy.',
  },
  {
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    title: 'Guided Trajectory',
    desc: 'Structured learning paths and mentorship from industry professionals who have navigated the terrain before you.',
  },
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: 'Constellation Network',
    desc: 'Connect with a thriving community of explorers, recruiters, and mentors across every sector.',
  },
];

const howItWorks = [
  { step: '01', title: 'Build Your Profile', desc: 'Calibrate your professional coordinates — add your skills, experience, and aspirations to attract the right systems.' },
  { step: '02', title: 'Learn & Connect', desc: 'Engage with curated courses and networks. Absorb knowledge from established constellations in your field.' },
  { step: '03', title: 'Land the Role', desc: 'Dock successfully into your new career trajectory with precision-guided applications and real-time market signals.' },
];

const featuredCourses = allCourses.slice(0, 3);

const stats = [
  { value: '12k+', label: 'Open Opportunities' },
  { value: '500+', label: 'Guided Courses' },
  { value: '92%', label: 'Land a Role' },
  { value: '50+', label: 'Countries' },
];

const testimonials = [
  { name: 'Elena R.', role: 'Data Analyst', text: 'Dedran provided the exact navigation I needed. The trajectory mapping tool helped me align my skills with open orbits perfectly.' },
  { name: 'Marcus T.', role: 'Systems Engineer', text: 'The constellation metaphor isnt just aesthetic; it actually helped me visualize how my previous experiences connected to land this senior role.' },
  { name: 'Priya K.', role: 'Product Designer', text: 'Within two weeks of joining Dedran, I had three interview requests from companies I would never have discovered on my own.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#07090E] text-on-surface antialiased relative overflow-x-hidden">
      <CosmicBackground />
      <StarField />

      <style>{`
        @keyframes twinkle { 0% { opacity: 0.2; transform: scale(0.8); } 100% { opacity: 0.8; transform: scale(1.2); } }
      `}</style>

      <div className="relative z-10">
        {/* Public Nav */}
        <header className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">Dedran</span>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">Features</a>
            <a href="#how-it-works" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">How It Works</a>
            <a href="#courses" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">Courses</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">Sign In</Link>
            <Link to="/register" className="bg-[#D9D9D6] text-[#07090E] px-5 py-2 rounded font-label-caps font-semibold hover:bg-white transition-colors">
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="pt-20 md:pt-28 pb-20 md:pb-28 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="inline-block px-4 py-1.5 rounded-sm bg-primary-container/40 border border-primary/30 text-primary font-label-caps text-label-caps mb-6">
            NEXT-GEN CAREER NAVIGATION
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6 leading-tight max-w-4xl">
            Launch your career <br className="hidden md:block" /> with <span className="text-primary">Dedran</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">
            Navigate the professional cosmos. Discover opportunities, build your trajectory, and connect with systems that propel your growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg">Create your free account</Button>
            </Link>
            <Link to="/star-systems">
              <Button variant="secondary" size="lg">Explore Opportunities</Button>
            </Link>
          </div>
          <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Why Dedran?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Three core principles that set your trajectory apart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {features.map((f) => (
              <GlassCard key={f.title} className="p-stack-lg text-center">
                <div className="w-14 h-14 rounded-full bg-primary-container/40 border border-nebula-stroke flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bcc6e7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{f.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">How It Works</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Three steps to your next career milestone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter relative">
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px bg-nebula-stroke -translate-y-1/2 z-0" />
            {howItWorks.map((item) => (
              <GlassCard key={item.step} className="p-stack-lg relative z-10">
                <span className="font-display-lg text-display-lg text-primary/30 font-bold block mb-2">{item.step}</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Featured Courses</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Start your learning journey with our most popular trajectories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {featuredCourses.map((c) => (
              <GlassCard key={c.title} className="overflow-hidden flex flex-col" hover={false}>
                <div className="h-40 bg-primary-container/20 border-b border-nebula-stroke flex items-center justify-center">
                  <span className="font-headline-md text-headline-md text-primary/40">{c.category}</span>
                </div>
                <div className="p-stack-md flex flex-col flex-1">
                  <span className="inline-block self-start px-2 py-0.5 rounded-sm bg-primary-container/40 text-primary font-label-caps text-label-caps mb-2">{c.category}</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{c.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">by {c.author}</p>
                  <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mb-3">
                    <span>★ {c.rating}</span>
                    <span>{c.duration}</span>
                    <span>{c.enrolled} enrolled</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                      <span>Progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/star-systems">
              <Button variant="secondary">View All Courses</Button>
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {stats.map((s) => (
              <GlassCard key={s.label} className="p-stack-md flex flex-col items-center justify-center min-h-[120px]">
                <p className="font-data-heavy text-data-heavy text-[#D9D9D6] mb-unit">{s.value}</p>
                <p className="font-label-caps text-label-caps text-charcoal-gray uppercase tracking-wider text-center">{s.label}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Signals Received</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Hear from explorers who have navigated their trajectory with Dedran.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {testimonials.map((t) => (
              <GlassCard key={t.name} className="p-stack-md">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-nebula-stroke">
                  <div className="w-11 h-11 rounded-full bg-primary-container/40 border border-nebula-stroke flex items-center justify-center shrink-0">
                    <span className="font-headline-sm text-headline-sm text-primary">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">{t.name}</p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">{t.role}</p>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">"{t.text}"</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto text-center">
          <GlassCard className="p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/20 to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Ready to Launch?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto mb-8">
                Join thousands of professionals who have already charted their course with Dedran.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="primary" size="lg">Create your free account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Footer */}
        <footer className="border-t border-nebula-stroke py-stack-md px-margin-mobile text-center">
          <p className="font-label-caps text-label-caps text-charcoal-gray">&copy; 2024 Dedran Systems. Navigating Careers.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;