import { useState, useEffect } from 'react';
import { Compass, Users, Briefcase, BookOpen, Activity, Bell, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { storage } from '../../lib/localStorage';
import GlassCard from '../../components/ui/GlassCard';
import MetricCard from '../../components/ui/MetricCard';

const LOGS = [
  { time: 'T-Minus 04:22', msg: 'Application submitted — Frontend Developer at Stellar Labs', highlight: true },
  { time: 'T-Minus 12:05', msg: 'Enrolled in Advanced Astro-Navigation course', highlight: true },
  { time: 'T-Minus 24:00', msg: 'Profile updated with new skills', highlight: false },
  { time: 'T-Minus 48:00', msg: 'Connection request from Nova Corps Recruiter', highlight: false },
];

const Galaxy = () => {
  const [connections, setConnections] = useState(0);
  const [applications, setApplications] = useState([]);
  const [enrollments, setEnrollments] = useState({});

  useEffect(() => {
    const apps = storage.get('applications') || [];
    setApplications(apps);
    setEnrollments(storage.get('enrollments') || {});

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id)
          .then(({ count }) => setConnections(count || 0));
      }
    });
  }, []);

  const enrolledCount = Object.values(enrollments).filter((e) => e.enrolled).length;
  const appsByStage = {
    Applied: applications.filter((a) => a.stage === 'Applied').length,
    'Under Review': applications.filter((a) => a.stage === 'Under Review').length,
    Interview: applications.filter((a) => a.stage === 'Interview').length,
    Offer: applications.filter((a) => a.stage === 'Offer').length,
  };

  return (
    <div className="pb-stack-lg space-y-stack-lg">
      {/* Hero — Sector Health */}
      <GlassCard className="p-stack-md relative overflow-hidden" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container/40 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Sector Alpha Stability
            </h2>
            <div className="flex items-baseline gap-3">
              <span className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-[#D9D9D6]">98.4%</span>
              <span className="font-label-caps text-label-caps text-charcoal-gray">OPTIMAL</span>
            </div>
          </div>
          <div className="flex-1 w-full h-32 relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}>
              <path d="M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="#D9D9D6" strokeWidth="0.5" />
              <path d="M0,30 L0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,10 L100,30 Z" fill="rgba(32, 42, 68, 0.2)" />
              <circle cx="20" cy="20" fill="#FFFFFF" r="0.8" />
              <circle cx="40" cy="10" fill="#FFFFFF" r="0.8" />
              <circle cx="60" cy="15" fill="#FFFFFF" r="0.8" />
              <circle cx="80" cy="5" fill="#D9D9D6" r="1.2" />
            </svg>
          </div>
        </div>
      </GlassCard>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <MetricCard value={connections.toLocaleString()} label="Connections" icon={Users} />
        <MetricCard value={applications.length.toLocaleString()} label="Applications" icon={Briefcase} />
        <MetricCard value={enrolledCount.toLocaleString()} label="Enrolled Courses" icon={BookOpen} />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Constellation Map */}
        <GlassCard className="col-span-12 lg:col-span-8 p-stack-md min-h-[400px] flex flex-col" hover={false}>
          <div className="flex justify-between items-center mb-4 border-b border-nebula-stroke pb-2">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <Compass size={18} className="text-primary" />
              Constellation Mapping
            </h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-primary-container/40 rounded-sm font-label-caps text-label-caps text-[#D9D9D6]">ORION</span>
              <span className="px-2 py-1 border border-charcoal-gray rounded-sm font-label-caps text-label-caps text-charcoal-gray">CYGNUS</span>
            </div>
          </div>
          <div className="flex-1 relative bg-[#07090E] rounded-lg border border-nebula-stroke overflow-hidden flex items-center justify-center">
            <span className="text-charcoal-gray font-body-sm italic">Interactive constellation map rendering...</span>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary-container/20 via-transparent to-transparent opacity-50" />
          </div>
        </GlassCard>

        {/* Celestial Logs */}
        <GlassCard className="col-span-12 lg:col-span-4 p-stack-md flex flex-col min-h-[400px]" hover={false}>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 pb-2 border-b border-nebula-stroke flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            Celestial Logs
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(83,86,90,0.5) transparent' }}>
            {LOGS.map((log, i) => (
              <div key={i} className={`group cursor-pointer ${i > 0 ? 'pt-3 border-t border-nebula-stroke/50' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-label-caps text-label-caps ${log.highlight ? 'text-primary' : 'text-charcoal-gray'}`}>{log.time}</span>
                  <Star size={14} className="text-charcoal-gray shrink-0 group-hover:text-primary transition-colors" />
                </div>
                <p className={`font-body-sm text-body-sm ${log.highlight ? 'text-on-surface' : 'text-on-surface-variant'}`}>{log.msg}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-[#D9D9D6] text-[#D9D9D6] font-body-sm rounded-DEFAULT hover:bg-white/5 transition-colors">
            View All Logs
          </button>
        </GlassCard>

        {/* Applications Breakdown */}
        <GlassCard className="col-span-12 lg:col-span-6 p-stack-md" hover={false}>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-4 pb-2 border-b border-nebula-stroke">Applications Breakdown</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(appsByStage).map(([stage, count]) => (
              <div key={stage}>
                <p className="font-label-caps text-label-caps text-charcoal-gray mb-1">{stage.toUpperCase()}</p>
                <p className="font-data-heavy text-data-heavy text-on-surface">{count}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <GlassCard className="col-span-12 lg:col-span-6 p-stack-md" hover={false}>
          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-4 pb-2 border-b border-nebula-stroke">Activity Snapshot</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-label-caps text-label-caps text-charcoal-gray mb-1">PROFILE VIEWS</p>
              <p className="font-data-heavy text-data-heavy text-on-surface">—</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Requires view-tracking table</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-charcoal-gray mb-1">ACTIVE LOGS</p>
              <p className="font-data-heavy text-data-heavy text-on-surface">{LOGS.length}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">From this session</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Galaxy;