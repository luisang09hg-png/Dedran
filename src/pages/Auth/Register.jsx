import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const strength = (() => {
    if (!formData.password) return 0;
    let s = 0;
    if (formData.password.length > 5) s += 25;
    if (formData.password.length > 7) s += 25;
    if (/[A-Z]/.test(formData.password)) s += 25;
    if (/[0-9]/.test(formData.password)) s += 25;
    return s;
  })();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-on-surface antialiased relative">
      <header className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto relative z-10">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-on-surface">Dedran</Link>
        <Link to="/login" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
          Sign In
        </Link>
      </header>

      <div className="flex items-center justify-center px-4 pb-16">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Create your account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Launch your career today</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded mb-6 font-body-sm text-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setFieldErrors({ ...fieldErrors, fullName: null }); }}
                placeholder="Jane Doe"
                className="w-full bg-[#07090E] border border-charcoal-gray rounded px-4 py-2.5 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
              />
              {fieldErrors.fullName && <p className="text-error text-label-caps mt-1">{fieldErrors.fullName}</p>}
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setFieldErrors({ ...fieldErrors, email: null }); }}
                placeholder="you@email.com"
                className="w-full bg-[#07090E] border border-charcoal-gray rounded px-4 py-2.5 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
              />
              {fieldErrors.email && <p className="text-error text-label-caps mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setFieldErrors({ ...fieldErrors, password: null }); }}
                placeholder="Min. 8 characters"
                className="w-full bg-[#07090E] border border-charcoal-gray rounded px-4 py-2.5 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
              />
              {fieldErrors.password && <p className="text-error text-label-caps mt-1">{fieldErrors.password}</p>}

              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1 w-full">
                    {[25, 50, 75, 100].map((threshold) => (
                      <div key={threshold} className={`flex-1 rounded-full transition-colors ${strength >= threshold ? strength >= 75 ? 'bg-green-500/80' : 'bg-primary' : 'bg-outline-variant/30'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1 text-right">
                    {strength <= 25 && 'Weak'}
                    {strength > 25 && strength < 75 && 'Medium'}
                    {strength >= 75 && strength < 100 && 'Good'}
                    {strength === 100 && 'Strong'}
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading || (formData.password.length > 0 && strength < 25)} variant="primary" size="lg" className="w-full justify-center">
              {loading ? 'Creating account...' : <><UserPlus size={18} /> Create account</>}
            </Button>
          </form>

          <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;