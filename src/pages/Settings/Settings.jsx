import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, Eye, EyeOff, Bell, LogOut, Loader2, Check, Shield } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // Toggles
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [toggleSaving, setToggleSaving] = useState(false);
  const [toggleSuccess, setToggleSuccess] = useState(null);

  // Error
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setEmail(user.email);
      setUserId(user.id);

      const { data } = await supabase
        .from('profiles')
        .select('is_profile_public, email_notifications')
        .eq('id', user.id)
        .single();

      if (data) {
        setIsProfilePublic(data.is_profile_public ?? true);
        setEmailNotifications(data.email_notifications ?? true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordSaving(true);

      // Re-authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        return;
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleToggle = async (field, value) => {
    try {
      setToggleSaving(true);
      setToggleSuccess(null);

      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', userId);

      if (error) throw error;

      if (field === 'is_profile_public') setIsProfilePublic(value);
      if (field === 'email_notifications') setEmailNotifications(value);

      setToggleSuccess(field);
      setTimeout(() => setToggleSuccess(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setToggleSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-stack-lg pb-stack-lg">
      <div>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-stack-sm">Settings</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your account and preferences.</p>
      </div>

      {error && (
        <GlassCard className="p-4 border border-error/30 bg-error-container/20">
          <span className="font-body-sm text-body-sm text-on-error-container">{error}</span>
          <button onClick={() => setError(null)} className="ml-3 p-1 hover:bg-error/20 rounded">✕</button>
        </GlassCard>
      )}

      {/* Account Section */}
      <GlassCard className="p-stack-lg" hover={false}>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-nebula-stroke">
          <Mail size={20} className="text-primary" />
          <h2 className="font-headline-md text-headline-md text-on-surface">Account</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Email</label>
              <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface font-body-md text-body-md">
                {email}
              </div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-2">Contact support to change your email address.</p>
          </div>
        </div>
      </GlassCard>

      {/* Password Section */}
      <GlassCard className="p-stack-lg" hover={false}>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-nebula-stroke">
          <Lock size={20} className="text-primary" />
          <h2 className="font-headline-md text-headline-md text-on-surface">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {passwordError && (
            <div className="bg-error-container/20 border border-error/30 rounded-lg p-3 font-body-sm text-body-sm text-on-error-container">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 font-body-sm text-body-sm text-green-400 flex items-center gap-2">
              <Check size={16} /> Password updated successfully
            </div>
          )}

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 pr-10 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 pr-10 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:border-primary focus:shadow-[0_0_0_2px_rgba(188,198,231,0.15)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
              placeholder="Confirm new password"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
            >
              {passwordSaving ? (
                <><Loader2 size={16} className="animate-spin" /> Updating...</>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Privacy Section */}
      <GlassCard className="p-stack-lg" hover={false}>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-nebula-stroke">
          <Shield size={20} className="text-primary" />
          <h2 className="font-headline-md text-headline-md text-on-surface">Privacy</h2>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-body-md text-body-md text-on-surface">Public Profile</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Allow others to view your profile</p>
          </div>
          <button
            onClick={() => handleToggle('is_profile_public', !isProfilePublic)}
            disabled={toggleSaving}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isProfilePublic ? 'bg-primary' : 'bg-charcoal-gray'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-on-surface rounded-full transition-transform ${
                isProfilePublic ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
        {toggleSuccess === 'is_profile_public' && (
          <p className="font-label-caps text-label-caps text-green-400 flex items-center gap-1"><Check size={12} /> Saved</p>
        )}

        <div className="flex items-center justify-between py-3 border-t border-nebula-stroke">
          <div>
            <p className="font-body-md text-body-md text-on-surface">Email Notifications</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Receive email updates about your activity</p>
          </div>
          <button
            onClick={() => handleToggle('email_notifications', !emailNotifications)}
            disabled={toggleSaving}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              emailNotifications ? 'bg-primary' : 'bg-charcoal-gray'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-on-surface rounded-full transition-transform ${
                emailNotifications ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
        {toggleSuccess === 'email_notifications' && (
          <p className="font-label-caps text-label-caps text-green-400 flex items-center gap-1"><Check size={12} /> Saved</p>
        )}
      </GlassCard>

      {/* Sign Out */}
      <GlassCard className="p-stack-md" hover={false}>
        <Button variant="secondary" className="w-full justify-center gap-2" onClick={handleSignOut}>
          <LogOut size={16} />
          Sign Out
        </Button>
      </GlassCard>
    </div>
  );
};

export default Settings;