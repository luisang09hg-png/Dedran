'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cvSubmissions, jobApplications, interviewSchedules } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// CV Submissions
export async function getCVSubmissions() {
  const userId = await getUserId()
  return db
    .select()
    .from(cvSubmissions)
    .where(eq(cvSubmissions.userId, userId))
    .orderBy(desc(cvSubmissions.createdAt))
}

export async function uploadCV(data: {
  fileUrl: string
  headline?: string
  skillsSummary?: string
}) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)

  await db.insert(cvSubmissions).values({
    id,
    userId,
    fileUrl: data.fileUrl,
    headline: data.headline,
    skillsSummary: data.skillsSummary,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  revalidatePath('/cv')
}

export async function deleteCV(id: string) {
  const userId = await getUserId()
  await db
    .delete(cvSubmissions)
    .where(eq(cvSubmissions.userId, userId))
}

// Job Applications
export async function getJobApplications() {
  const userId = await getUserId()
  return db
    .select()
    .from(jobApplications)
    .where(eq(jobApplications.userId, userId))
    .orderBy(desc(jobApplications.appliedDate))
}

export async function submitApplication(data: {
  companyName: string
  position: string
  cvSubmissionId?: string
}) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)

  await db.insert(jobApplications).values({
    id,
    userId,
    companyName: data.companyName,
    position: data.position,
    cvSubmissionId: data.cvSubmissionId,
    status: 'applied',
    appliedDate: new Date(),
    lastUpdated: new Date(),
  })

  revalidatePath('/cv')
}

export async function updateApplicationStatus(id: string, status: string) {
  const userId = await getUserId()
  await db
    .update(jobApplications)
    .set({ status, lastUpdated: new Date() })
    .where(eq(jobApplications.id, id))
  
  revalidatePath('/cv')
}

export async function deleteApplication(id: string) {
  const userId = await getUserId()
  await db
    .delete(jobApplications)
    .where(eq(jobApplications.id, id))
  
  revalidatePath('/cv')
}

// Interview Scheduling
export async function scheduleInterview(data: {
  applicationId: string
  scheduledDate: Date
  durationMinutes?: number
}) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  const jitsiRoomId = `careerconnect-${id}`

  await db.insert(interviewSchedules).values({
    id,
    applicationId: data.applicationId,
    scheduledDate: data.scheduledDate,
    durationMinutes: data.durationMinutes || 30,
    jitsiRoomId,
    status: 'scheduled',
    createdAt: new Date(),
  })

  revalidatePath('/cv')
  return jitsiRoomId
}

export async function getInterviewSchedules() {
  const userId = await getUserId()
  return db
    .select()
    .from(interviewSchedules)
    .orderBy(desc(interviewSchedules.scheduledDate))
}

export async function getInterviewsByApplication(applicationId: string) {
  return db
    .select()
    .from(interviewSchedules)
    .where(eq(interviewSchedules.applicationId, applicationId))
}

export async function updateInterviewStatus(id: string, status: string) {
  await db
    .update(interviewSchedules)
    .set({ status })
    .where(eq(interviewSchedules.id, id))
  
  revalidatePath('/cv')
}
