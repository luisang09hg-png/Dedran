'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { courses, courseEnrollments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getAllCourses() {
  return db
    .select()
    .from(courses)
    .orderBy(desc(courses.createdAt))
}

export async function getUserEnrollments() {
  const userId = await getUserId()
  return db
    .select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.userId, userId))
}

export async function enrollCourse(courseId: string) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)

  // Check if already enrolled
  const existing = await db
    .select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.courseId, courseId))

  if (!existing.some(e => e.userId === userId)) {
    await db.insert(courseEnrollments).values({
      id,
      userId,
      courseId,
      progressPercentage: 0,
      enrolledAt: new Date(),
    })
  }

  revalidatePath('/courses')
}

export async function updateProgress(courseId: string, progressPercentage: number) {
  const userId = await getUserId()
  const enrollment = await db
    .select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.courseId, courseId))

  const userEnrollment = enrollment.find(e => e.userId === userId)
  if (userEnrollment) {
    await db
      .update(courseEnrollments)
      .set({
        progressPercentage,
        completedAt: progressPercentage === 100 ? new Date() : null,
      })
      .where(eq(courseEnrollments.courseId, courseId))
  }

  revalidatePath('/courses')
}

export async function unenrollCourse(courseId: string) {
  const userId = await getUserId()
  const enrollments = await db
    .select()
    .from(courseEnrollments)
    .where(eq(courseEnrollments.courseId, courseId))

  const toDelete = enrollments.find(e => e.userId === userId)
  if (toDelete) {
    await db.delete(courseEnrollments).where(eq(courseEnrollments.id, toDelete.id))
  }

  revalidatePath('/courses')
}

// Seed initial courses
export async function initializeCourses() {
  const existing = await db.select().from(courses)
  
  if (existing.length === 0) {
    const initialCourses = [
      {
        id: '1',
        title: 'Advanced React Patterns',
        description: 'Master advanced React patterns including hooks, context, and performance optimization',
        category: 'Web Development',
        level: 'Advanced',
        durationHours: 20,
        instructor: 'Sarah Chen',
        imageUrl: null,
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Professional Communication Skills',
        description: 'Develop essential communication skills for the workplace including presentations and networking',
        category: 'Soft Skills',
        level: 'Beginner',
        durationHours: 8,
        instructor: 'James Miller',
        imageUrl: null,
        createdAt: new Date(),
      },
      {
        id: '3',
        title: 'Data Science Fundamentals',
        description: 'Learn data science basics with Python, including data analysis and visualization',
        category: 'Data Science',
        level: 'Intermediate',
        durationHours: 30,
        instructor: 'Dr. Priya Sharma',
        imageUrl: null,
        createdAt: new Date(),
      },
      {
        id: '4',
        title: 'Career Development Strategy',
        description: 'Plan your career path and develop a strategy for professional growth and advancement',
        category: 'Career',
        level: 'Beginner',
        durationHours: 5,
        instructor: 'Michael Johnson',
        imageUrl: null,
        createdAt: new Date(),
      },
      {
        id: '5',
        title: 'Full-Stack Web Development',
        description: 'Build complete web applications with Node.js and React from frontend to backend',
        category: 'Web Development',
        level: 'Intermediate',
        durationHours: 40,
        instructor: 'Emma Rodriguez',
        imageUrl: null,
        createdAt: new Date(),
      },
      {
        id: '6',
        title: 'Interview Preparation Masterclass',
        description: 'Ace your interviews with proven techniques and real-world practice scenarios',
        category: 'Career',
        level: 'Beginner',
        durationHours: 10,
        instructor: 'David Lee',
        imageUrl: null,
        createdAt: new Date(),
      },
    ]

    for (const course of initialCourses) {
      await db.insert(courses).values(course)
    }
  }
}
