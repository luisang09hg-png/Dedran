import { redirect } from 'next/navigation'
import { HeroSection } from '@/components/hero-section'
import { FeaturedCourses } from '@/components/featured-courses'
import { getFeaturedCourses, getSession } from '@/app/actions/home'
import { seedDemoCourses } from '@/app/actions/seed-courses'
import Link from 'next/link'

export default async function HomePage() {
  // Seed demo courses if needed
  await seedDemoCourses()

  const [session, courses] = await Promise.all([
    getSession(),
    getFeaturedCourses(),
  ])

  // If user is logged in, redirect to dashboard
  if (session?.id) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CareerConnect
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Courses */}
      <FeaturedCourses courses={courses} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of young professionals who are already succeeding on CareerConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 rounded-lg bg-primary-foreground text-primary font-semibold hover:shadow-lg transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/posts"
              className="px-8 py-3 rounded-lg border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">CareerConnect</h3>
              <p className="text-secondary text-sm">
                The modern platform for young professionals to build careers and find opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-secondary text-sm">
                <li><Link href="/courses" className="hover:text-primary">Courses</Link></li>
                <li><Link href="/posts" className="hover:text-primary">Community</Link></li>
                <li><Link href="/cv" className="hover:text-primary">CV Submission</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-secondary text-sm">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-secondary text-sm">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-secondary text-sm">
            <p>&copy; 2024 CareerConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
