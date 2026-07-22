'use client'

import { useState } from 'react'
import { Plus, X, Award } from 'lucide-react'
import { addSkill, deleteSkill } from '@/app/actions/profile'
import { motion } from 'framer-motion'

interface Skill {
  id: string
  userId: string
  name: string
  level: string | null
  endorsedCount: number | null
  createdAt: Date
}

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills: initialSkills }: SkillsSectionProps) {
  const [skills, setSkills] = useState(initialSkills)
  const [showForm, setShowForm] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', level: 'beginner' })
  const [loading, setLoading] = useState(false)

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.name.trim()) return

    setLoading(true)
    try {
      await addSkill(newSkill.name, newSkill.level)
      setSkills([...skills, {
        id: Math.random().toString(),
        userId: '',
        name: newSkill.name,
        level: newSkill.level,
        endorsedCount: 0,
        createdAt: new Date(),
      }])
      setNewSkill({ name: '', level: 'beginner' })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id)
      setSkills(skills.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Skills</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSkill} className="mb-6 p-4 bg-background rounded-lg border border-border">
          <input
            type="text"
            placeholder="Skill name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary mb-3"
          />
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground mb-3"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors disabled:opacity-50"
            >
              Add Skill
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-secondary text-sm">No skills yet. Add your first skill!</p>
        ) : (
          skills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 group hover:bg-primary/20 transition-colors"
            >
              <span className="text-sm font-medium text-primary">{skill.name}</span>
              <span className="text-xs text-secondary capitalize">{skill.level}</span>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/30"
              >
                <X className="w-3 h-3 text-primary" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
