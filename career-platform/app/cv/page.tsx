import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardNav } from '@/components/dashboard-nav'
import { CVUploadSection } from '@/components/cv-upload-section'
import { ApplicationsList } from '@/components/applications-list'
import { getCVSubmissions, getJobApplications } from '@/app/actions/cv'

export default async function CVPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const [cvSubmissions, applications] = await Promise.all([
    getCVSubmissions(),
    getJobApplications(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">CV & Applications</h1>
          <p className="text-secondary">Manage your CVs and track your job applications in real-time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CVUploadSection cvSubmissions={cvSubmissions} />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <ApplicationsList applications={applications} />
          </div>
        </div>
      </div>
    </div>
  )
}
