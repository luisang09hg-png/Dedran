'use client'

import Link from 'next/link'
import { Edit2, MapPin, Briefcase } from 'lucide-react'

interface ProfileCardProps {
  profile: {
    id: string
    userId: string
    fullName: string | null
    bio: string | null
    profilePictureUrl: string | null
    backgroundImageUrl: string | null
    headline: string | null
    location: string | null
    createdAt: Date
    updatedAt: Date
  } | null
  user: {
    id: string
    email: string
    name?: string | null
  }
}

export function ProfileCard({ profile, user }: ProfileCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Background image */}
      {profile?.backgroundImageUrl ? (
        <img
          src={profile.backgroundImageUrl}
          alt="Background"
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-r from-primary to-accent" />
      )}

      <div className="p-6">
        {/* Profile picture */}
        <div className="flex items-end gap-4 mb-4">
          <div className="-mt-16 w-20 h-20 rounded-full bg-card border-4 border-border overflow-hidden flex items-center justify-center text-3xl font-bold text-primary">
            {profile?.profilePictureUrl ? (
              <img
                src={profile.profilePictureUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user.name?.charAt(0) || user.email.charAt(0)
            )}
          </div>
          <Link
            href="/dashboard/profile"
            className="ml-auto p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Edit2 className="w-5 h-5 text-primary" />
          </Link>
        </div>

        {/* Profile info */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {profile?.fullName || user.name || 'Your Name'}
          </h2>
          {profile?.headline && (
            <p className="text-secondary font-medium flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {profile.headline}
            </p>
          )}
          {profile?.location && (
            <p className="text-secondary text-sm flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </p>
          )}
          <p className="text-secondary text-sm mt-1">{user.email}</p>
        </div>

        {profile?.bio && (
          <>
            <div className="border-t border-border my-4" />
            <p className="text-secondary text-sm leading-relaxed">{profile.bio}</p>
          </>
        )}

        {/* Actions */}
        <div className="mt-6">
          <Link
            href="/dashboard/profile"
            className="block w-full px-4 py-2 text-center rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-secondary">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-xs text-secondary">Followers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
