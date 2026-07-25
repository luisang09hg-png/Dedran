-- Migration: Add DELETE policy for job_applications
-- Owner can withdraw their own application

CREATE POLICY "Applicants can delete own applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = applicant_id);