'use client'

import { useState } from 'react'
import { uploadCV } from '@/app/actions/cv'
import { Upload, FileText, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface CV {
  id: string
  userId: string
  fileUrl: string
  headline: string | null
  skillsSummary: string | null
  createdAt: Date
  updatedAt: Date
}

interface CVUploadSectionProps {
  cvSubmissions: CV[]
}

export function CVUploadSection({ cvSubmissions }: CVUploadSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    headline: '',
    skillsSummary: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // In a real app, you'd upload the file to storage first
      await uploadCV({
        fileUrl: '/cv-sample.pdf',
        headline: formData.headline,
        skillsSummary: formData.skillsSummary,
      })
      setFormData({ headline: '', skillsSummary: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error uploading CV:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          My CVs
        </h3>
      </div>

      {cvSubmissions.length === 0 ? (
        <p className="text-secondary text-sm">No CVs uploaded yet</p>
      ) : (
        <div className="space-y-2">
          {cvSubmissions.map((cv) => (
            <motion.div
              key={cv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-background border border-border group hover:border-primary transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-1">
                <FileText className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {cv.headline || 'CV'}
                  </p>
                  <p className="text-xs text-secondary">
                    {new Date(cv.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full px-4 py-2 rounded-lg border-2 border-primary border-dashed bg-primary/5 hover:bg-primary/10 text-primary font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Upload CV
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-background rounded-lg border border-border space-y-3">
          <input
            type="text"
            placeholder="Headline (e.g., Senior Developer CV)"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder-secondary text-sm"
          />
          <textarea
            placeholder="Skills summary (optional)"
            value={formData.skillsSummary}
            onChange={(e) => setFormData({ ...formData, skillsSummary: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder-secondary text-sm resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors disabled:opacity-50 text-sm"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
