-- =============================================
-- MIGRACIÓN 00003 — Secciones de Perfil
-- Tablas: experience, education, certifications, publications
-- =============================================

-- 1. TABLA EXPERIENCE
-- =============================================
CREATE TABLE public.experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experience_profile_id ON public.experience(profile_id);
CREATE INDEX idx_experience_start_date ON public.experience(start_date DESC);

CREATE TRIGGER trigger_experience_updated_at
    BEFORE UPDATE ON public.experience
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 2. TABLA EDUCATION
-- =============================================
CREATE TABLE public.education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_education_profile_id ON public.education(profile_id);
CREATE INDEX idx_education_start_date ON public.education(start_date DESC);

CREATE TRIGGER trigger_education_updated_at
    BEFORE UPDATE ON public.education
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. TABLA CERTIFICATIONS
-- =============================================
CREATE TABLE public.certifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    credential_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certifications_profile_id ON public.certifications(profile_id);

CREATE TRIGGER trigger_certifications_updated_at
    BEFORE UPDATE ON public.certifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. TABLA PUBLICATIONS
-- =============================================
CREATE TABLE public.publications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT,
    cover_image TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_publications_profile_id ON public.publications(profile_id);
CREATE INDEX idx_publications_published_at ON public.publications(published_at DESC);
CREATE INDEX idx_publications_tags ON public.publications USING GIN(tags);

CREATE TRIGGER trigger_publications_updated_at
    BEFORE UPDATE ON public.publications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- EXPERIENCE RLS
CREATE POLICY "Authenticated users can view experience" ON public.experience
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own experience" ON public.experience
    FOR ALL USING (auth.uid() = profile_id);

-- EDUCATION RLS
CREATE POLICY "Authenticated users can view education" ON public.education
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own education" ON public.education
    FOR ALL USING (auth.uid() = profile_id);

-- CERTIFICATIONS RLS
CREATE POLICY "Authenticated users can view certifications" ON public.certifications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own certifications" ON public.certifications
    FOR ALL USING (auth.uid() = profile_id);

-- PUBLICATIONS RLS
CREATE POLICY "Authenticated users can view publications" ON public.publications
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own publications" ON public.publications
    FOR ALL USING (auth.uid() = profile_id);

-- 6. COMMENTS
-- =============================================

COMMENT ON TABLE public.experience IS 'Experiencia laboral del usuario';
COMMENT ON TABLE public.education IS 'Educación/formación académica del usuario';
COMMENT ON TABLE public.certifications IS 'Certificaciones y credenciales del usuario';
COMMENT ON TABLE public.publications IS 'Publicaciones, artículos y proyectos del usuario';

-- =============================================
-- FIN DE MIGRACIÓN 00003
-- =============================================
