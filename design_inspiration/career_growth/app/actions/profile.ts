'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles, qualifications, skills, experience, posts } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Profile operations
export async function getProfile() {
  const userId = await getUserId()
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
  return profile[0] || null
}

export async function updateProfile(data: {
  fullName?: string
  bio?: string
  headline?: string
  location?: string
  profilePictureUrl?: string
  backgroundImageUrl?: string
}) {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))

  if (existing.length > 0) {
    await db
      .update(profiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
  } else {
    const id = Math.random().toString(36).substring(2, 15)
    await db.insert(profiles).values({
      id,
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

// Skills operations
export async function getSkills() {
  const userId = await getUserId()
  return db
    .select()
    .from(skills)
    .where(eq(skills.userId, userId))
}

export async function addSkill(name: string, level: string = 'beginner') {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  await db.insert(skills).values({
    id,
    userId,
    name,
    level,
    createdAt: new Date(),
  })
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function deleteSkill(id: string) {
  const userId = await getUserId()
  await db
    .delete(skills)
    .where(and(eq(skills.id, id), eq(skills.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

// Qualifications operations
export async function getQualifications() {
  const userId = await getUserId()
  return db
    .select()
    .from(qualifications)
    .where(eq(qualifications.userId, userId))
    .orderBy(desc(qualifications.dateObtained))
}

export async function addQualification(data: {
  title: string
  issuer: string
  dateObtained?: Date
  description?: string
}) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  await db.insert(qualifications).values({
    id,
    userId,
    ...data,
    createdAt: new Date(),
  })
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function deleteQualification(id: string) {
  const userId = await getUserId()
  await db
    .delete(qualifications)
    .where(and(eq(qualifications.id, id), eq(qualifications.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

// Experience operations
export async function getExperience() {
  const userId = await getUserId()
  return db
    .select()
    .from(experience)
    .where(eq(experience.userId, userId))
    .orderBy(desc(experience.startDate))
}

export async function addExperience(data: {
  company: string
  position: string
  startDate?: Date
  endDate?: Date
  description?: string
  currentlyWorking?: boolean
}) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  await db.insert(experience).values({
    id,
    userId,
    ...data,
    createdAt: new Date(),
  })
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

export async function deleteExperience(id: string) {
  const userId = await getUserId()
  await db
    .delete(experience)
    .where(and(eq(experience.id, id), eq(experience.userId, userId)))
  revalidatePath('/dashboard')
  revalidatePath('/profile')
}

// User posts
export async function getUserPosts() {
  const userId = await getUserId()
  return db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
}
