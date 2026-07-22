import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getProfile, getSkills, getQualifications, getExperience } from '@/app/actions/profile'
import { initializeDemoProfile } from '@/app/actions/demo'
import { DashboardNav } from '@/components/dashboard-nav'
import { ProfileCard } from '@/components/profile-card'
import { SkillsSection } from '@/components/skills-section'
import { QualificationsSection } from '@/components/qualifications-section'
import { ExperienceSection } from '@/components/experience-section'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  // Initialize demo profile data for new users
  await initializeDemoProfile(session.user.id)

  const [profile, skills, qualifications, experience] = await Promise.all([
    getProfile(),
    getSkills(),
    getQualifications(),
    getExperience(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-secondary">Manage your profile, skills, and career journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href="/dashboard/profile"
                className="p-4 rounded-lg border-2 border-border hover:border-primary bg-card transition-colors text-center"
              >
                <div className="text-2xl font-bold text-primary mb-2">👤</div>
                <h3 className="font-semibold text-foreground">Edit Profile</h3>
                <p className="text-sm text-secondary">Update your information</p>
              </Link>
              <Link
                href="/posts"
                className="p-4 rounded-lg border-2 border-border hover:border-primary bg-card transition-colors text-center"
              >
                <div className="text-2xl font-bold text-primary mb-2">📝</div>
                <h3 className="font-semibold text-foreground">Create Post</h3>
                <p className="text-sm text-secondary">Share your achievements</p>
              </Link>
              <Link
                href="/cv"
                className="p-4 rounded-lg border-2 border-border hover:border-primary bg-card transition-colors text-center"
              >
                <div className="text-2xl font-bold text-primary mb-2">📄</div>
                <h3 className="font-semibold text-foreground">CV Tracker</h3>
                <p className="text-sm text-secondary">Manage applications</p>
              </Link>
            </div>

            {/* Skills */}
            <SkillsSection skills={skills} />

            {/* Qualifications */}
            <QualificationsSection qualifications={qualifications} />

            {/* Experience */}
            <ExperienceSection experience={experience} />
          </div>

          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard profile={profile} user={session.user} />
          </div>
        </div>
      </div>
    </div>
  )
}
