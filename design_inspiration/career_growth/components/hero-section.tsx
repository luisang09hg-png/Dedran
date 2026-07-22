'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-card to-background overflow-hidden pt-20 pb-20">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />

      <motion.div
        className="relative container mx-auto px-4 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            Launch Your{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Career Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-8 text-pretty max-w-3xl mx-auto">
            Connect with opportunities, build your profile, and showcase your skills to top employers
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Link
            href="/sign-up"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/posts"
            className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors duration-300"
          >
            Explore Community
          </Link>
        </motion.div>

        {/* Stats and cards */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Briefcase, label: 'Job Opportunities', value: '5,000+' },
            { icon: Users, label: 'Young Professionals', value: '50,000+' },
            { icon: TrendingUp, label: 'Success Rate', value: '92%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              className="bg-card p-6 rounded-xl border border-border backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
            >
              <stat.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
              <p className="text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature highlights */}
        <motion.div variants={itemVariants} className="mt-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Customizable Profiles',
                description: 'Showcase your unique skills, qualifications, and achievements with a professional profile',
              },
              {
                title: 'Share Your Journey',
                description: 'Post your wins and connect with other professionals in the community',
              },
              {
                title: 'Learn & Grow',
                description: 'Access curated courses designed to boost your skills and employability',
              },
              {
                title: 'Track Applications',
                description: 'Manage your CV submissions and monitor your application progress in real-time',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
