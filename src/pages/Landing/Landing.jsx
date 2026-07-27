import { Link } from 'react-router-dom';
import { Sparkles, Rocket, Users, Target, Zap, ArrowRight, Star, CheckCircle } from 'lucide-react';
import CosmicBackground from '../../components/ui/CosmicBackground';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import EventHorizon from '../../components/ui/EventHorizon';
import Badge from '../../components/ui/Badge';
import { courses as allCourses } from '../../data/courses';

const benefits = [
  {
    icon: Target,
    title: 'Smart Job Matching',
    desc: 'AI-powered algorithms connect your skills with opportunities that fit your trajectory perfectly.',
  },
  {
    icon: Zap,
    title: 'Accelerated Learning',
    desc: 'Curated courses and certifications to upskill fast and stay competitive in your field.',
  },
  {
    icon: Users,
    title: 'Professional Network',
    desc: 'Connect with mentors, peers, and recruiters who can open doors to your next opportunity.',
  },
];

const featuredCourses = allCourses.slice(0, 3);

const stats = [
  { value: '15K+', label: 'Active Users' },
  { value: '2.5K+', label: 'Jobs Posted' },
  { value: '500+', label: 'Courses' },
  { value: '94%', label: 'Success Rate' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface antialiased relative overflow-x-hidden">
      <CosmicBackground />

      <div className="relative z-10">
        {/* Public Nav */}
        <header className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <Star size={28} className="text-primary animate-float" />
              <Sparkles size={12} className="text-cosmic-accent absolute -top-1 -right-1" />
            </div>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">Dedran</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-smooth">Benefits</a>
            <a href="#courses" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-smooth">Courses</a>
            <a href="#how-it-works" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-smooth">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-smooth px-4 py-2">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started Free</Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          {/* Cosmic backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
            <EventHorizon variant="hero" size={700} />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge variant="tertiary" className="inline-flex items-center gap-2">
                <Sparkles size={14} />
                <span>Next-Gen Career Platform</span>
              </Badge>
              
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
                Launch your career into the <span className="text-primary relative">
                  cosmos
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                The premium platform for young professionals. Build your profile, learn new skills, and land your dream job with AI-powered matching.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex-1">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto justify-center">
                    <Rocket size={18} />
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/star-systems" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                    Explore Courses
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-primary-container/40 border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-on-surface">15,000+ professionals</p>
                  <p className="text-on-surface-variant">already launched their careers</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block animate-scale-in">
              <div className="relative glass-panel p-8 rounded-2xl">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-cosmic-accent/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-tertiary/20 rounded-full blur-3xl" />
                
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant">Profile Strength</p>
                      <p className="font-headline-md text-headline-md text-primary">85%</p>
                    </div>
                    <div className="h-16 w-16">
                      <EventHorizon variant="avatar" size={64}>
                        <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
                          <Users size={24} className="text-primary" />
                        </div>
                      </EventHorizon>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container/50">
                      <CheckCircle size={20} className="text-primary" />
                      <span className="text-sm text-on-surface">Skills optimized for 12 job matches</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container/50">
                      <CheckCircle size={20} className="text-primary" />
                      <span className="text-sm text-on-surface">3 courses in progress</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container/50">
                      <CheckCircle size={20} className="text-primary" />
                      <span className="text-sm text-on-surface">Profile views increased by 340%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 border-y border-nebula-stroke bg-surface-container/30">
          <div className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-data-heavy text-data-heavy text-primary mb-1">{s.value}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Why Choose Dedran</Badge>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Everything you need to succeed</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              A complete ecosystem designed for young professionals ready to make their mark.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {benefits.map((b) => (
              <GlassCard key={b.title} className="p-stack-lg group hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary-container/40 border border-nebula-stroke flex items-center justify-center mb-5 group-hover:scale-110 transition-smooth">
                  <b.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{b.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{b.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section id="courses" className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Learning Paths</Badge>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Featured Courses</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Start your learning journey with our most popular trajectories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {featuredCourses.map((c) => (
              <GlassCard key={c.title} className="overflow-hidden flex flex-col group hover:border-primary/30">
                <div className="h-40 cosmic-gradient flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 stardust-overlay opacity-30" />
                  <span className="font-headline-sm text-headline-sm text-primary/60 relative z-10">{c.category}</span>
                </div>
                <div className="p-stack-md flex flex-col flex-1">
                  <Badge variant="outline" className="self-start mb-3">{c.category}</Badge>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 line-clamp-2">{c.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">by {c.author}</p>
                  <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm mb-4">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-primary fill-primary" />
                      {c.rating}
                    </span>
                    <span>•</span>
                    <span>{c.duration}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-nebula-stroke">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                      <span>Progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/star-systems">
              <Button variant="secondary" size="lg">
                View All Courses
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <GlassCard className="p-12 md:p-20 relative overflow-hidden cosmic-gradient">
            <div className="absolute inset-0 stardust-overlay opacity-20" />
            <div className="relative text-center">
              <Badge variant="default" className="mb-6 inline-flex items-center gap-2">
                <Sparkles size={14} />
                <span>Join Today</span>
              </Badge>
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                Ready to launch your career?
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
                Join thousands of young professionals who are already building their future with Dedran. Your journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    <Rocket size={18} />
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Footer */}
        <footer className="border-t border-nebula-stroke py-12 px-margin-mobile">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star size={20} className="text-primary" />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Dedran</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              © 2024 Dedran. Navigating careers across the cosmos.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
