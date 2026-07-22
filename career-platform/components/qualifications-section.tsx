'use client'

import { useState } from 'react'
import { Plus, Trash2, BookOpen } from 'lucide-react'
import { addQualification, deleteQualification } from '@/app/actions/profile'
import { motion } from 'framer-motion'

interface Qualification {
  id: string
  userId: string
  title: string
  issuer: string
  dateObtained: Date | null
  description: string | null
  createdAt: Date
}

interface QualificationsSectionProps {
  qualifications: Qualification[]
}

export function QualificationsSection({ qualifications: initialQuals }: QualificationsSectionProps) {
  const [qualifications, setQualifications] = useState(initialQuals)
  const [showForm, setShowForm] = useState(false)
  const [newQual, setNewQual] = useState({
    title: '',
    issuer: '',
    dateObtained: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleAddQual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQual.title.trim() || !newQual.issuer.trim()) return

    setLoading(true)
    try {
      await addQualification({
        title: newQual.title,
        issuer: newQual.issuer,
        dateObtained: newQual.dateObtained ? new Date(newQual.dateObtained) : undefined,
        description: newQual.description || undefined,
      })
      setQualifications([...qualifications, {
        id: Math.random().toString(),
        userId: '',
        title: newQual.title,
        issuer: newQual.issuer,
        dateObtained: newQual.dateObtained ? new Date(newQual.dateObtained) : null,
        description: newQual.description || null,
        createdAt: new Date(),
      }])
      setNewQual({ title: '', issuer: '', dateObtained: '', description: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding qualification:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQual = async (id: string) => {
    try {
      await deleteQualification(id)
      setQualifications(qualifications.filter(q => q.id !== id))
    } catch (error) {
      console.error('Error deleting qualification:', error)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Qualifications & Diplomas</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddQual} className="mb-6 p-4 bg-background rounded-lg border border-border space-y-3">
          <input
            type="text"
            placeholder="Title (e.g., Bachelor of Science)"
            value={newQual.title}
            onChange={(e) => setNewQual({ ...newQual, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary"
          />
          <input
            type="text"
            placeholder="Issuer (e.g., University Name)"
            value={newQual.issuer}
            onChange={(e) => setNewQual({ ...newQual, issuer: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary"
          />
          <input
            type="date"
            value={newQual.dateObtained}
            onChange={(e) => setNewQual({ ...newQual, dateObtained: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          />
          <textarea
            placeholder="Description (optional)"
            value={newQual.description}
            onChange={(e) => setNewQual({ ...newQual, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-secondary resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors disabled:opacity-50"
            >
              Add Qualification
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
        {qualifications.length === 0 ? (
          <p className="text-secondary text-sm">No qualifications yet. Add your first diploma!</p>
        ) : (
          qualifications.map((qual) => (
            <motion.div
              key={qual.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-background border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">{qual.title}</h4>
                  <p className="text-secondary text-sm mb-1">{qual.issuer}</p>
                  {qual.dateObtained && (
                    <p className="text-secondary text-xs">
                      {new Date(qual.dateObtained).toLocaleDateString()}
                    </p>
                  )}
                  {qual.description && (
                    <p className="text-secondary text-sm mt-2">{qual.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteQual(qual.id)}
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
