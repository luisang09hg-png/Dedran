import { useParams } from 'react-router-dom';
import { useProfileByUsername, useProfileStats } from '../../hooks/useProfiles';
import { useExperience } from '../../hooks/useExperience';
import { useEducation } from '../../hooks/useEducation';
import { useCertifications } from '../../hooks/useCertifications';
import { usePublications } from '../../hooks/usePublications';
import { useState } from 'react';
import {
  MapPin, Briefcase, Users, Award, BookOpen, ExternalLink,
  Calendar, GraduationCap
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import MetricCard from '../../components/ui/MetricCard';
import EventHorizon from '../../components/ui/EventHorizon';

const PublicProfile = () => {
  const { username } = useParams();
  const profileQuery = useProfileByUsername(username);
  const profile = profileQuery.data;
  const userId = profile?.id || null;

  const statsQuery = useProfileStats(userId);
  const stats = statsQuery.data || { connections: 0, applications: 0 };

  const experienceQuery = useExperience(userId);
  const educationQuery = useEducation(userId);
  const certificationsQuery = useCertifications(userId);
  const publicationsQuery = usePublications(userId);

  const [activeTab, setActiveTab] = useState('about');

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EventHorizon variant="spinner" size={48} />
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Users size={64} className="text-on-surface-variant/30 mb-4" />
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Profile not found</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">The user @{username} does not exist.</p>
      </div>
    );
  }

  return (
    <div className="pb-stack-lg">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-56 w-full rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary-container/40 via-surface-container to-surface">
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <EventHorizon variant="hero" size={280} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="relative z-10 -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-5 mb-stack-lg px-2">
        <EventHorizon variant="avatar" size={136}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-surface-variant flex items-center justify-center rounded-full">
              <Users size={48} className="text-on-surface-variant/50" />
            </div>
          )}
        </EventHorizon>

        <div className="text-center md:text-left flex-1">
          <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface">{profile.full_name || 'User'}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">@{profile.username}</p>
          {profile.headline && <p className="font-headline-sm text-primary mt-1">{profile.headline}</p>}
          {profile.location && (
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center justify-center md:justify-start gap-1">
              <MapPin size={14} /> {profile.location}
            </p>
          )}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
            {(profile.skills || []).slice(0, 5).map((skill) => (
              <span key={skill} className="px-3 py-1 bg-primary-container/40 border border-nebula-stroke rounded-sm font-label-caps text-label-caps text-secondary-fixed">
                {skill.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <MetricCard value={(stats.connections || 0).toLocaleString()} label="Connections" icon={Users} />
        <MetricCard value={(certificationsQuery.data?.length || 0).toLocaleString()} label="Certifications" icon={Award} />
        <MetricCard value={(stats.applications || 0).toLocaleString()} label="Applications" icon={Briefcase} />
      </div>

      {/* Tabs */}
      <div className="border-b border-nebula-stroke flex gap-6 mb-gutter overflow-x-auto">
        {['about', 'experience', 'publications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 border-b-2 font-headline-sm text-headline-sm transition-colors capitalize whitespace-nowrap ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* About */}
      {activeTab === 'about' && (
        <GlassCard className="p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4">About</h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
            {profile.bio || 'No bio yet.'}
          </p>
          {profile.skills?.length > 0 && (
            <div className="border-t border-nebula-stroke pt-6">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-sm bg-primary-container/40 border border-nebula-stroke text-primary font-label-caps text-label-caps">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-gutter">
          <GlassCard className="p-stack-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" /> Experience
            </h3>
            {(experienceQuery.data || []).length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">No experience listed.</p>
            ) : (
              (experienceQuery.data || []).map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-nebula-stroke last:border-0">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h4>
                    <p className="font-body-sm text-body-sm text-primary mt-0.5">{item.company}</p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 flex items-center gap-1">
                      <Calendar size={12} /> {item.start_date}{item.end_date ? ` — ${item.end_date}` : ' — Present'}
                    </p>
                    {item.description && <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">{item.description}</p>}
                  </div>
                </div>
              ))
            )}
          </GlassCard>

          <GlassCard className="p-stack-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <GraduationCap size={20} className="text-primary" /> Education
            </h3>
            {(educationQuery.data || []).length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">No education listed.</p>
            ) : (
              (educationQuery.data || []).map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-nebula-stroke last:border-0">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.degree}</h4>
                    <p className="font-body-sm text-body-sm text-primary mt-0.5">{item.institution}</p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">{item.start_date}{item.end_date ? ` — ${item.end_date}` : ' — Present'}</p>
                  </div>
                </div>
              ))
            )}
          </GlassCard>

          <GlassCard className="p-stack-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <Award size={20} className="text-primary" /> Certifications
            </h3>
            {(certificationsQuery.data || []).length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">No certifications listed.</p>
            ) : (
              (certificationsQuery.data || []).map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-nebula-stroke last:border-0">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center shrink-0">
                    <Award size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h4>
                    <p className="font-body-sm text-body-sm text-primary mt-0.5">{item.issuer}</p>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">{item.issue_date}</p>
                    {item.credential_url && (
                      <a href={item.credential_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors">
                        <ExternalLink size={12} /> View Credential
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </GlassCard>
        </div>
      )}

      {/* Publications */}
      {activeTab === 'publications' && (
        <GlassCard className="p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-primary" /> Publications
          </h3>
          {(publicationsQuery.data || []).length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">No publications yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(publicationsQuery.data || []).map(pub => (
                <div key={pub.id} className="bg-surface-container/60 rounded-lg border border-nebula-stroke p-4 hover:border-primary/30 transition-all">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">{pub.title}</h4>
                  {pub.summary && <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-2">{pub.summary}</p>}
                  {pub.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pub.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-sm bg-primary-container/40 text-primary font-label-caps text-[10px]">{tag}</span>
                      ))}
                    </div>
                  )}
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors">
                      <ExternalLink size={12} /> View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default PublicProfile;
