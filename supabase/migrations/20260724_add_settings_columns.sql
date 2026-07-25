-- Migration: Add settings columns to profiles table
-- Run this in your Supabase SQL Editor or via the Dashboard

-- Profile visibility toggle (public/private)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_profile_public BOOLEAN DEFAULT true;

-- Email notifications opt-in/out
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;