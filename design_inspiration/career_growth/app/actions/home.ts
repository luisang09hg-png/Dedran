'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { courses, posts } from '@/lib/db/schema'
import { desc, limit, isNull, gt } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function getFeaturedCourses() {
  try {
    return await db
      .select()
      .from(courses)
      .orderBy(desc(courses.createdAt))
      .limit(6)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export async function getRecentPosts() {
  try {
    const now = new Date()
    return await db
      .select()
      .from(posts)
      .where(gt(posts.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
      .orderBy(desc(posts.createdAt))
      .limit(5)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user || null
}
