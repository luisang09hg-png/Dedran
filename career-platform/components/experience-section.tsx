'use client'

import { useState } from 'react'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { addExperience, deleteExperience } from '@/app/actions/profile'
import { motion } from 'framer-motion'

interface Experience {
  id: string
  userId: string
  company: string
  position: string
  startDate: Date | null
  endDate: Date | null
  description: string | null
  currentlyWorking: boolean | null
  createdAt: Date
}

interface ExperienceSectionProps {
  experience: Experience[]
}

export function ExperienceSection({ experience: initialExp }: ExperienceSectionProps) {
  const [experience, setExperience] = useState(initialExp)
  const [showForm, setShowForm] = useState(false)
  const [newExp, setNewExp] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExp.company.trim() || !newExp.position.trim()) return

    setLoading(true)
    try {
      await addExperience({
        company: newExp.company,
        position: newExp.position,
        startDate: newExp.startDate ? new Date(newExp.startDate) : undefined,
        endDate: newExp.endDate && !newExp.currentlyWorking ? new Date(newExp.endDate) : undefined,
        currentlyWorking: newExp.currentlyWorking,
        description: newExp.description || undefined,
      })
      setExperience([...experience, {
        id: Math.random().toString(),
        userId: '',
        company: newExp.company,
        position: newExp.position,
        startDate: newExp.startDate ? new Date(newExp.startDate) : null,
        endDate: newExp.endDate && !newExp.currentlyWorking ? new Date(newExp.endDate) : null,
        currentlyWorking: newExp.currentlyWorking,
        description: newExp.description || null,
        createdAt: new Date(),
      }])
      setNewExp({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExp = async (id: string) => {
    try {
      await deleteExperience(id)
      setExperience(experience.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Work Experience</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddExp} className="mb-6 p-4 bg-background rounded-lg border border-border space-y-3">
          <input
            type="text"
            placeholder="Company"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary"
          />
          <input
            type="text"
            placeholder="Position"
            value={newExp.position}
            onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary"
          />
          <input
            type="date"
            value={newExp.startDate}
            onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          />
          {!newExp.currentlyWorking && (
            <input
              type="date"
              value={newExp.endDate}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          )}
          <label className="flex items-center gap-2 text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={newExp.currentlyWorking}
              onChange={(e) => setNewExp({ ...newExp, currentlyWorking: e.target.checked })}
              className="w-4 h-4 rounded border border-border"
            />
            <span className="text-sm">Currently working here</span>
          </label>
          <textarea
            placeholder="Description (optional)"
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors disabled:opacity-50"
            >
              Add Experience
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

      <div className="space-y-4">
        {experience.length === 0 ? (
          <p className="text-secondary text-sm">No work experience yet. Add your first job!</p>
        ) : (
          experience.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-background border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground">{exp.position}</h4>
                    {exp.currentlyWorking && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-secondary text-sm mb-1">{exp.company}</p>
                  {exp.startDate && (
                    <p className="text-secondary text-xs">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  )}
                  {exp.description && (
                    <p className="text-secondary text-sm mt-2">{exp.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteExp(exp.id)}
                  className="ml-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
