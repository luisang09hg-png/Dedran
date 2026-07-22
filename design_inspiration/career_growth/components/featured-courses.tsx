'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Award } from 'lucide-react'
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
}

interface FeaturedCoursesProps {
  courses: Course[]
}

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-card border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Recommended Courses
          </h2>
          <p className="text-lg text-secondary">
            Enhance your skills with our curated learning paths
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-background rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 group cursor-pointer"
            >
              {/* Course image placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                <BookOpen className="w-16 h-16 text-primary/50 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-foreground text-balance line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                {course.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    {course.category}
                  </span>
                )}

                {course.description && (
                  <p className="text-secondary text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {course.instructor && (
                    <div className="flex items-center text-sm text-secondary">
                      <Award className="w-4 h-4 mr-2" />
                      {course.instructor}
                    </div>
                  )}
                  {course.durationHours && (
                    <div className="flex items-center text-sm text-secondary">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.durationHours} hours
                    </div>
                  )}
                </div>

                {course.level && (
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                      {course.level}
                    </span>
                    <button className="text-primary font-semibold text-sm hover:text-accent transition-colors">
                      Enroll →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/courses"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors duration-300"
          >
            Explore All Courses
            <span className="ml-2">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
