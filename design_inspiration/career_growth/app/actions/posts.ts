'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts, postLikes, postComments } from '@/lib/db/schema'
import { eq, and, desc, gt, isNull } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getPosts() {
  const now = new Date()
  return db
    .select()
    .from(posts)
    .where(
      and(
        isNull(posts.deletedAt),
        or => or(
          isNull(posts.expiresAt),
          gt(posts.expiresAt, now)
        )
      )
    )
    .orderBy(desc(posts.createdAt))
}

export async function createPost(content: string, type: 'regular' | 'temporary' = 'regular') {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  
  const expiresAt = type === 'temporary' 
    ? new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours
    : null

  await db.insert(posts).values({
    id,
    userId,
    content,
    type,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  
  revalidatePath('/posts')
}

export async function deletePost(id: string) {
  const userId = await getUserId()
  await db
    .update(posts)
    .set({ deletedAt: new Date() })
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
  revalidatePath('/posts')
}

export async function likePost(postId: string) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  
  // Check if already liked
  const existing = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
  
  if (existing.length === 0) {
    await db.insert(postLikes).values({
      id,
      postId,
      userId,
      createdAt: new Date(),
    })
  }
  
  revalidatePath('/posts')
}

export async function unlikePost(postId: string) {
  const userId = await getUserId()
  await db
    .delete(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
  revalidatePath('/posts')
}

export async function getPostLikesCount(postId: string) {
  const result = await db
    .select()
    .from(postLikes)
    .where(eq(postLikes.postId, postId))
  return result.length
}

export async function getPostComments(postId: string) {
  return db
    .select()
    .from(postComments)
    .where(eq(postComments.postId, postId))
    .orderBy(desc(postComments.createdAt))
}

export async function addComment(postId: string, content: string) {
  const userId = await getUserId()
  const id = Math.random().toString(36).substring(2, 15)
  
  await db.insert(postComments).values({
    id,
    postId,
    userId,
    content,
    createdAt: new Date(),
  })
  
  revalidatePath('/posts')
}

export async function deleteComment(id: string) {
  const userId = await getUserId()
  await db
    .delete(postComments)
    .where(and(eq(postComments.id, id), eq(postComments.userId, userId)))
  revalidatePath('/posts')
}
