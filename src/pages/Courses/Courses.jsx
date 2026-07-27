import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserCourses, useEnrollCourse, useUpdateCourseProgress } from '../../hooks/useCourses';
import { Search, Star, Clock, Users, Sparkles, TrendingUp, BookOpen, Filter, ArrowRight } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { courses } from '../../data/courses';

const CATEGORIES = ['All', 'Design', 'Tech', 'Business', 'Communication'];

const Courses = () => {
  const { user } = useAuth();
  const profileId = user?.id;
  const { data: userCourses, isLoading: coursesLoading } = useUserCourses(profileId);
  const enrollMutation = useEnrollCourse();
  const progressMutation = useUpdateCourseProgress();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const enrollments = {};
  if (userCourses) {
    userCourses.forEach((uc) => {
      enrollments[uc.course_id] = { enrolled: true, progress: uc.progress, status: uc.status };
    });
  }

  const handleEnroll = (courseId) => {
    if (!profileId) return;
    enrollMutation.mutate({ profileId, courseId });
  };

  const handleContinue = (courseId) => {
    if (!profileId) return;
    const current = enrollments[courseId] || { enrolled: true, progress: 0 };
    const newProgress = Math.min((current.progress || 0) + 10, 100);
    progressMutation.mutate({ profileId, courseId, progress: newProgress });
  };

  const filtered = courses.filter((c) => {
    const matchCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.author.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const enrolledCourses = courses.filter(c => enrollments[c.id]?.enrolled);
  const recommendedCourses = courses.filter(c => !enrollments[c.id]).slice(0, 3);

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2 flex items-center gap-3">
          <Sparkles size={28} className="text-primary" />
          Courses
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Navigate your career path with curated learning trajectories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-on-surface-variant" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer hover:border-primary/50 transition-smooth"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      {enrolledCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="font-headline-md text-headline-md text-on-surface">Continue Learning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((c) => {
              const enr = enrollments[c.id];
              const progress = enr?.progress ?? 0;

              return (
                <GlassCard key={c.id} className="overflow-hidden flex flex-col group hover:border-primary/30 transition-smooth">
                  <div className="h-44 cosmic-gradient flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 stardust-overlay opacity-30" />
                    <BookOpen size={48} className="text-primary/40 relative z-10" />
                    <Badge variant="success" className="absolute top-3 right-3">
                      In Progress
                    </Badge>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <Badge variant="outline" className="self-start mb-3 w-fit">{c.category}</Badge>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 line-clamp-2">{c.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">by {c.author}</p>

                    <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-primary fill-primary" /> {c.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {c.duration}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-nebula-stroke">
                      <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full justify-center"
                        onClick={() => handleContinue(c.id)}
                      >
                        Continue Learning
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-primary" />
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {enrolledCourses.length > 0 ? 'Recommended for You' : 'All Courses'}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your search or category filters to find what you're looking for."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => {
              const isEnrolled = enrollments[c.id]?.enrolled ?? false;
              const progress = enrollments[c.id]?.progress ?? 0;

              return (
                <GlassCard key={c.id} className="overflow-hidden flex flex-col group hover:border-primary/30 transition-smooth">
                  <div className="h-44 cosmic-gradient flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 stardust-overlay opacity-30" />
                    <span className="font-headline-sm text-headline-sm text-primary/60 relative z-10">{c.category}</span>
                    <Badge variant="outline" className="absolute top-3 right-3">
                      {c.level}
                    </Badge>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <Badge variant="secondary" className="self-start mb-3 w-fit">{c.category}</Badge>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 line-clamp-2">{c.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">by {c.author}</p>

                    <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-primary fill-primary" /> {c.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {c.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {c.enrolled}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-nebula-stroke">
                      {isEnrolled ? (
                        <>
                          <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full justify-center"
                            onClick={() => handleContinue(c.id)}
                          >
                            Continue
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center"
                          onClick={() => handleEnroll(c.id)}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
