'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Award, User, Play } from 'lucide-react'
import { enrollCourse, unenrollCourse } from '@/app/actions/courses'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string | null
  category: string | null
  level: string | null
  durationHours: number | null
  instructor: string | null
  imageUrl: string | null
  createdAt: Date
}

interface CoursesGridProps {
  courses: Course[]
  enrolledCourseIds: Set<string>
}

export function CoursesGrid({ courses, enrolledCourseIds }: CoursesGridProps) {
  const [enrolled, setEnrolled] = useState(enrolledCourseIds)
  const [loading, setLoading] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))]

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.category === filter)

  const handleEnroll = async (courseId: string) => {
    const newEnrolled = new Set(enrolled)
    if (newEnrolled.has(courseId)) {
      newEnrolled.delete(courseId)
      setEnrolled(newEnrolled)
      await unenrollCourse(courseId)
    } else {
      newEnrolled.add(courseId)
      setEnrolled(newEnrolled)
      setLoading(prev => new Set([...prev, courseId]))
      try {
        await enrollCourse(courseId)
      } finally {
        setLoading(prev => {
          const newSet = new Set(prev)
          newSet.delete(courseId)
          return newSet
        })
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCourses.map((course) => {
          const isEnrolled = enrolled.has(course.id)
          const isLoading = loading.has(course.id)

          return (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 group flex flex-col"
            >
              {/* Course image placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                <BookOpen className="w-16 h-16 text-primary/50 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Category badge */}
                {course.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3 w-fit">
                    {course.category}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Description */}
                {course.description && (
                  <p className="text-secondary text-sm mb-4 line-clamp-2 flex-1">
                    {course.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="space-y-2 mb-4 text-sm">
                  {course.instructor && (
                    <div className="flex items-center text-secondary gap-2">
                      <User className="w-4 h-4" />
                      {course.instructor}
                    </div>
                  )}
                  {course.durationHours && (
                    <div className="flex items-center text-secondary gap-2">
                      <Clock className="w-4 h-4" />
                      {course.durationHours} hours
                    </div>
                  )}
                  {course.level && (
                    <div className="flex items-center text-secondary gap-2">
                      <Award className="w-4 h-4" />
                      {course.level}
                    </div>
                  )}
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isEnrolled
                      ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                      : 'bg-primary text-primary-foreground hover:bg-accent'
                  } disabled:opacity-50`}
                >
                  {isEnrolled ? (
                    <>
                      <Play className="w-4 h-4" />
                      Continue Course
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Enroll Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary text-lg">No courses found in this category</p>
        </div>
      )}
    </div>
  )
}
