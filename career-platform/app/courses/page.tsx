import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardNav } from '@/components/dashboard-nav'
import { CoursesGrid } from '@/components/courses-grid'
import { getAllCourses, getUserEnrollments, initializeCourses } from '@/app/actions/courses'

export default async function CoursesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  // Initialize courses if not already done
  await initializeCourses()

  const [allCourses, enrollments] = await Promise.all([
    getAllCourses(),
    getUserEnrollments(),
  ])

  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId))

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={session.user} />
      
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Recommended Courses</h1>
          <p className="text-secondary">Enhance your skills with our carefully curated learning paths</p>
        </div>

        <CoursesGrid courses={allCourses} enrolledCourseIds={enrolledCourseIds} />
      </div>
    </div>
  )
}
