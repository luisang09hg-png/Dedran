'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MessageSquare, Video, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react'
import { updateApplicationStatus, deleteApplication, scheduleInterview } from '@/app/actions/cv'
import { formatDate } from '@/lib/utils'

interface Application {
  id: string
  userId: string
  companyName: string
  position: string
  cvSubmissionId: string | null
  status: string | null
  appliedDate: Date
  lastUpdated: Date
}

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showScheduleForm, setShowScheduleForm] = useState<string | null>(null)
  const [loading, setLoading] = useState<Set<string>>(new Set())
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(prev => new Set([...prev, id]))
    try {
      await updateApplicationStatus(id, status)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(prev => new Set([...prev, id]))
    try {
      await deleteApplication(id)
    } catch (error) {
      console.error('Error deleting application:', error)
    } finally {
      setLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleScheduleInterview = async (applicationId: string) => {
    if (!scheduledDate || !scheduledTime) return

    setLoading(prev => new Set([...prev, applicationId]))
    try {
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`)
      await scheduleInterview({
        applicationId,
        scheduledDate: dateTime,
      })
      setShowScheduleForm(null)
      setScheduledDate('')
      setScheduledTime('')
    } catch (error) {
      console.error('Error scheduling interview:', error)
    } finally {
      setLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(applicationId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'interview':
        return <Video className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border p-6">
        <p className="text-secondary text-lg">No applications yet. Start applying to positions!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((app, idx) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary transition-colors"
        >
          <div
            onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
            className="p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{app.position}</h3>
                  {getStatusIcon(app.status)}
                </div>
                <p className="text-secondary">{app.companyName}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(app.id)
                }}
                disabled={loading.has(app.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Applied {new Date(app.appliedDate).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  app.status === 'accepted' ? 'bg-green-500/20 text-green-600' :
                  app.status === 'rejected' ? 'bg-red-500/20 text-red-600' :
                  app.status === 'interview' ? 'bg-blue-500/20 text-blue-600' :
                  'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {app.status || 'Applied'}
                </span>
              </div>
            </div>
          </div>

          {expandedId === app.id && (
            <div className="border-t border-border p-6 bg-background space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleStatusChange(app.id, 'applied')}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors text-sm"
                >
                  Applied
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'interview')}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors text-sm"
                >
                  Interview
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'accepted')}
                  className="px-4 py-2 rounded-lg border-2 border-green-500 text-green-600 hover:bg-green-500/10 transition-colors text-sm font-semibold"
                >
                  Accepted
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, 'rejected')}
                  className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-500/10 transition-colors text-sm font-semibold"
                >
                  Rejected
                </button>
              </div>

              {app.status === 'interview' && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <button
                    onClick={() => setShowScheduleForm(showScheduleForm === app.id ? null : app.id)}
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Schedule Video Interview
                  </button>

                  {showScheduleForm === app.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleScheduleInterview(app.id)
                      }}
                      className="mt-3 space-y-3"
                    >
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                      />
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading.has(app.id) || !scheduledDate || !scheduledTime}
                          className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          Schedule
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowScheduleForm(null)}
                          className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
