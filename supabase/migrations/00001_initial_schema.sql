-- =============================================
-- MIGRACIÓN INICIAL - Junior Career Hub / Dedran
-- =============================================

-- 1. EXTENSIONES NECESARIAS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA PROFILES (extiende auth.users)
-- =============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    headline TEXT, -- Título profesional (ej: "Junior Frontend Developer")
    bio TEXT,
    role TEXT CHECK (role IN ('student', 'junior', 'mentor', 'recruiter')) DEFAULT 'junior',
    skills TEXT[] DEFAULT '{}',
    location TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    is_onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_skills ON public.profiles USING GIN(skills);

-- 3. TABLA POSTS (Feed de contenido)
-- =============================================
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('post', 'article', 'job', 'project', 'achievement')) DEFAULT 'post',
    media_urls TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para posts
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);

-- 4. TABLA POST_LIKES (Likes en posts)
-- =============================================
CREATE TABLE public.post_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

-- 5. TABLA COMMENTS (Comentarios en posts)
-- =============================================
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- Para respuestas anidadas
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);

-- 6. TABLA FOLLOWS (Sistema de seguimiento)
-- =============================================
CREATE TABLE public.follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- 7. TABLA NOTIFICATIONS (Notificaciones)
-- =============================================
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('like', 'comment', 'follow', 'mention', 'job_application')) NOT NULL,
    reference_id UUID, -- ID del post, comment, etc.
    reference_type TEXT, -- 'post', 'comment', 'job'
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- 8. TABLA JOBS (Ofertas de empleo)
-- =============================================
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],
    location TEXT,
    remote_type TEXT CHECK (remote_type IN ('onsite', 'hybrid', 'remote')) DEFAULT 'hybrid',
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'USD',
    experience_level TEXT CHECK (experience_level IN ('intern', 'junior', 'mid', 'senior', 'lead')) DEFAULT 'junior',
    contract_type TEXT CHECK (contract_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')) DEFAULT 'full-time',
    skills_required TEXT[] DEFAULT '{}',
    application_url TEXT,
    application_email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX idx_jobs_experience_level ON public.jobs(experience_level);
CREATE INDEX idx_jobs_skills_required ON public.jobs USING GIN(skills_required);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);

-- 9. TABLA JOB_APPLICATIONS (Aplicaciones a empleos)
-- =============================================
CREATE TABLE public.job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT,
    resume_url TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn')) DEFAULT 'pending',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

-- 10. FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Trigger para profiles
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para posts
CREATE TRIGGER trigger_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para comments
CREATE TRIGGER trigger_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para jobs
CREATE TRIGGER trigger_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para job_applications
CREATE TRIGGER trigger_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, username, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'junior')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Trigger en auth.users para crear perfil
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar contadores de posts
CREATE OR REPLACE FUNCTION public.update_post_counters()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts SET
            likes_count = likes_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts SET
            likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON public.post_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_post_counters();

-- Función para actualizar contadores de comentarios
CREATE OR REPLACE FUNCTION public.update_comment_counters()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts SET
            comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts SET
            comments_count = GREATEST(comments_count - 1, 0)
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_post_comments_count
    AFTER INSERT OR DELETE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_comment_counters();

-- 11. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS PARA PROFILES
-- =============================================

-- Perfil propio: lectura y escritura total
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Perfiles públicos: lectura para usuarios autenticados
CREATE POLICY "Authenticated users can view public profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Inserción solo via trigger (handle_new_user)
CREATE POLICY "Profiles created via trigger only" ON public.profiles
    FOR INSERT WITH CHECK (false);

-- =============================================
-- POLÍTICAS PARA POSTS
-- =============================================

-- Lectura: posts publicados visibles para autenticados
CREATE POLICY "Authenticated users can view published posts" ON public.posts
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND is_published = TRUE
    );

-- Autor: CRUD total en sus posts
CREATE POLICY "Authors can manage own posts" ON public.posts
    FOR ALL USING (auth.uid() = author_id);

-- =============================================
-- POLÍTICAS PARA POST_LIKES
-- =============================================

CREATE POLICY "Users can view likes on visible posts" ON public.post_likes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts p
            WHERE p.id = post_likes.post_id
            AND p.is_published = TRUE
        )
    );

CREATE POLICY "Users can like/unlike posts" ON public.post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes" ON public.post_likes
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- POLÍTICAS PARA COMMENTS
-- =============================================

CREATE POLICY "Authenticated users can view comments on visible posts" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts p
            WHERE p.id = comments.post_id
            AND p.is_published = TRUE
        )
    );

CREATE POLICY "Authors can manage own comments" ON public.comments
    FOR ALL USING (auth.uid() = author_id);

-- =============================================
-- POLÍTICAS PARA FOLLOWS
-- =============================================

CREATE POLICY "Users can view follows" ON public.follows
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can follow others" ON public.follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" ON public.follows
    FOR DELETE USING (auth.uid() = follower_id);

-- =============================================
-- POLÍTICAS PARA NOTIFICATIONS
-- =============================================

CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications (mark read)" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- POLÍTICAS PARA JOBS
-- =============================================

-- Lectura: trabajos activos visibles para autenticados
CREATE POLICY "Authenticated users can view active jobs" ON public.jobs
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- Empresas (role recruiter): CRUD en sus ofertas
CREATE POLICY "Recruiters can manage own jobs" ON public.jobs
    FOR ALL USING (
        auth.uid() = company_id 
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('recruiter', 'mentor')
        )
    );

-- =============================================
-- POLÍTICAS PARA JOB_APPLICATIONS
-- =============================================

-- Aplicante: ver y crear sus aplicaciones
CREATE POLICY "Applicants can view own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Applicants can apply to jobs" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can withdraw own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = applicant_id AND status = 'pending');

-- Empresa: ver aplicaciones a sus ofertas
CREATE POLICY "Recruiters can view applications to own jobs" ON public.job_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.jobs j
            WHERE j.id = job_applications.job_id
            AND j.company_id = auth.uid()
        )
    );

CREATE POLICY "Recruiters can update application status" ON public.job_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.jobs j
            WHERE j.id = job_applications.job_id
            AND j.company_id = auth.uid()
        )
    );

-- 12. DATOS INICIALES / CONFIGURACIÓN ADICIONAL
-- =============================================

-- Función helper para búsqueda de perfiles por skills
CREATE OR REPLACE FUNCTION public.search_profiles_by_skills(skill_array TEXT[])
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    username TEXT,
    avatar_url TEXT,
    headline TEXT,
    skills TEXT[],
    role TEXT
) LANGUAGE sql STABLE AS $$
    SELECT p.id, p.full_name, p.username, p.avatar_url, p.headline, p.skills, p.role
    FROM public.profiles p
    WHERE p.skills && skill_array
    AND p.is_onboarding_complete = TRUE
    ORDER BY p.created_at DESC
    LIMIT 20;
$$;

-- Función helper para feed personalizado
CREATE OR REPLACE FUNCTION public.get_personalized_feed(user_uuid UUID, limit_count INT DEFAULT 20, offset_count INT DEFAULT 0)
RETURNS TABLE (
    id UUID,
    author_id UUID,
    content TEXT,
    type TEXT,
    media_urls TEXT[],
    tags TEXT[],
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    published_at TIMESTAMPTZ,
    author_full_name TEXT,
    author_username TEXT,
    author_avatar_url TEXT,
    author_headline TEXT,
    has_liked BOOLEAN
) LANGUAGE sql STABLE AS $$
    SELECT 
        p.id,
        p.author_id,
        p.content,
        p.type,
        p.media_urls,
        p.tags,
        p.likes_count,
        p.comments_count,
        p.shares_count,
        p.published_at,
        pr.full_name AS author_full_name,
        pr.username AS author_username,
        pr.avatar_url AS author_avatar_url,
        pr.headline AS author_headline,
        EXISTS (
            SELECT 1 FROM public.post_likes pl
            WHERE pl.post_id = p.id AND pl.user_id = user_uuid
        ) AS has_liked
    FROM public.posts p
    JOIN public.profiles pr ON pr.id = p.author_id
    WHERE p.is_published = TRUE
    AND (
        p.author_id = user_uuid
        OR EXISTS (
            SELECT 1 FROM public.follows f
            WHERE f.follower_id = user_uuid AND f.following_id = p.author_id
        )
        OR p.tags && (SELECT skills FROM public.profiles WHERE id = user_uuid)
    )
    ORDER BY p.published_at DESC
    LIMIT limit_count OFFSET offset_count;
$$;

-- Comentarios en tablas principales
COMMENT ON TABLE public.profiles IS 'Perfiles de usuarios extendidos desde auth.users';
COMMENT ON TABLE public.posts IS 'Publicaciones del feed (posts, artículos, proyectos, logros)';
COMMENT ON TABLE public.jobs IS 'Ofertas de empleo publicadas por reclutadores/empresas';
COMMENT ON TABLE public.job_applications IS 'Aplicaciones de usuarios a ofertas de empleo';

-- =============================================
-- FIN DE MIGRACIÓN 00001
-- =============================================