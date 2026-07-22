'use server'

import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { nanoid } from 'nanoid'

export async function seedDemoCourses() {
  try {
    // Check if courses already exist
    const existingCourses = await db.select().from(courses).limit(1)
    
    if (existingCourses.length > 0) {
      return { success: true, message: 'Courses already seeded' }
    }

    const sampleCourses = [
      {
        title: 'React Advanced Patterns',
        description:
          'Master advanced React concepts including hooks, performance optimization, and state management.',
        category: 'Frontend',
        level: 'advanced',
        durationHours: 24,
        instructor: 'Sarah Chen',
        imageUrl:
          'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop',
      },
      {
        title: 'Full Stack JavaScript',
        description:
          'Learn to build complete web applications with Node.js, Express, and React from scratch.',
        category: 'Full Stack',
        level: 'intermediate',
        durationHours: 32,
        instructor: 'James Wilson',
        imageUrl:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      },
      {
        title: 'TypeScript Essentials',
        description:
          'Learn TypeScript fundamentals and how to use it effectively in production applications.',
        category: 'Programming',
        level: 'intermediate',
        durationHours: 16,
        instructor: 'Alex Rodriguez',
        imageUrl:
          'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop',
      },
      {
        title: 'Web Performance Optimization',
        description:
          'Optimize your web applications for speed and efficiency with modern techniques and tools.',
        category: 'Frontend',
        level: 'advanced',
        durationHours: 20,
        instructor: 'Emma Davis',
        imageUrl:
          'https://images.unsplash.com/photo-1537432376769-00f5c2f3bdf0?w=500&h=300&fit=crop',
      },
      {
        title: 'Database Design & SQL',
        description:
          'Master database design principles and write efficient SQL queries for complex applications.',
        category: 'Backend',
        level: 'intermediate',
        durationHours: 28,
        instructor: 'Michael Park',
        imageUrl:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
      },
      {
        title: 'Career Development Bootcamp',
        description:
          'Build a strong professional profile, polish your resume, and master interview techniques.',
        category: 'Career',
        level: 'beginner',
        durationHours: 12,
        instructor: 'Lisa Johnson',
        imageUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      },
    ]

    for (const course of sampleCourses) {
      await db.insert(courses).values({
        id: nanoid(),
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        durationHours: course.durationHours,
        instructor: course.instructor,
        imageUrl: course.imageUrl,
      })
    }

    return { success: true, message: 'Demo courses seeded successfully' }
  } catch (error) {
    console.error('[v0] Error seeding courses:', error)
    return {
      success: false,
      message: 'Failed to seed courses',
    }
  }
}
