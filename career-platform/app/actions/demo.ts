'use server'

import { db } from '@/lib/db'
import {
  profiles,
  skills,
  qualifications,
  experience,
  posts,
  courses,
  courseEnrollments,
} from '@/lib/db/schema'
import { nanoid } from 'nanoid'

export async function initializeDemoProfile(userId: string) {
  try {
    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(profiles.userId === userId)
      .limit(1)

    if (existingProfile.length > 0) {
      return { success: true, message: 'Profile already initialized' }
    }

    // Create profile
    await db.insert(profiles).values({
      id: nanoid(),
      userId,
      fullName: 'Career Explorer',
      bio: 'Passionate about growing professionally and learning new skills.',
      headline: 'Software Developer | Tech Enthusiast',
      location: 'San Francisco, CA',
      profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      backgroundImageUrl: `https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop`,
    })

    // Add sample skills
    const skillsData = [
      { name: 'JavaScript', level: 'advanced' },
      { name: 'React', level: 'advanced' },
      { name: 'TypeScript', level: 'intermediate' },
      { name: 'Node.js', level: 'intermediate' },
      { name: 'Problem Solving', level: 'advanced' },
      { name: 'Team Collaboration', level: 'advanced' },
    ]

    for (const skill of skillsData) {
      await db.insert(skills).values({
        id: nanoid(),
        userId,
        name: skill.name,
        level: skill.level,
        endorsedCount: Math.floor(Math.random() * 10) + 2,
      })
    }

    // Add sample qualifications
    const qualificationsData = [
      {
        title: 'Bachelor of Science in Computer Science',
        issuer: 'State University',
        dateObtained: new Date('2022-06-01'),
        description: 'GPA: 3.8/4.0',
      },
      {
        title: 'Full Stack Web Development Certification',
        issuer: 'Online Learning Platform',
        dateObtained: new Date('2023-03-15'),
        description: 'Specialized in React and Node.js',
      },
    ]

    for (const qual of qualificationsData) {
      await db.insert(qualifications).values({
        id: nanoid(),
        userId,
        title: qual.title,
        issuer: qual.issuer,
        dateObtained: qual.dateObtained,
        description: qual.description,
      })
    }

    // Add sample experience
    const experienceData = [
      {
        company: 'Tech Startup Inc',
        position: 'Junior Developer',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2024-01-14'),
        description: 'Developed and maintained React applications',
        currentlyWorking: false,
      },
      {
        company: 'Digital Solutions LLC',
        position: 'Frontend Developer',
        startDate: new Date('2024-02-01'),
        endDate: null,
        description:
          'Building modern web applications with React and TypeScript',
        currentlyWorking: true,
      },
    ]

    for (const exp of experienceData) {
      await db.insert(experience).values({
        id: nanoid(),
        userId,
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        currentlyWorking: exp.currentlyWorking,
      })
    }

    // Add sample posts
    const postsData = [
      {
        content:
          'Just completed my first full-stack project! Feeling excited about my progress on CareerConnect. 🚀',
        type: 'regular',
        expiresAt: null,
      },
      {
        content:
          'Tip: Always document your code properly. It helps your future self and your team!',
        type: 'regular',
        expiresAt: null,
      },
      {
        content:
          '🌟 Quick reminder: Take breaks during coding sessions for better productivity!',
        type: 'temporary',
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
      },
    ]

    for (const post of postsData) {
      await db.insert(posts).values({
        id: nanoid(),
        userId,
        content: post.content,
        type: post.type,
        expiresAt: post.expiresAt,
      })
    }

    // Enroll in sample courses
    const sampleCourses = await db
      .select()
      .from(courses)
      .limit(3)

    for (const course of sampleCourses) {
      await db.insert(courseEnrollments).values({
        id: nanoid(),
        userId,
        courseId: course.id,
        progressPercentage: Math.floor(Math.random() * 80) + 10,
        completedAt: null,
      })
    }

    return { success: true, message: 'Demo profile initialized successfully' }
  } catch (error) {
    console.error('[v0] Error initializing demo profile:', error)
    return {
      success: false,
      message: 'Failed to initialize demo profile',
    }
  }
}
