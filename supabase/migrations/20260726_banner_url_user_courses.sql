-- =============================================
-- MIGRACIÓN 20260726 — banner_url + user_courses
-- =============================================

-- 1. BANNER URL en profiles
-- =============================================
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS banner_url TEXT;

COMMENT ON COLUMN public.profiles.banner_url IS 'URL pública del banner de perfil (storage avatars/{userId}/banner.jpg)';

-- 2. TABLA USER_COURSES (inscripciones y progreso)
-- =============================================
CREATE TABLE public.user_courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'enrolled'
        CHECK (status IN ('enrolled', 'in_progress', 'completed')),
    progress INTEGER NOT NULL DEFAULT 0
        CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (profile_id, course_id)
);

CREATE INDEX idx_user_courses_profile_id ON public.user_courses(profile_id);
CREATE INDEX idx_user_courses_course_id ON public.user_courses(course_id);
CREATE INDEX idx_user_courses_status ON public.user_courses(status);

CREATE TRIGGER trigger_user_courses_updated_at
    BEFORE UPDATE ON public.user_courses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view course enrollments" ON public.user_courses
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own course enrollments" ON public.user_courses
    FOR ALL USING (auth.uid() = profile_id);

-- 4. COMMENTS
-- =============================================
COMMENT ON TABLE public.user_courses IS 'Inscripciones y progreso de cursos guiados por usuario';

-- =============================================
-- FIN DE MIGRACIÓN 20260726
-- =============================================
