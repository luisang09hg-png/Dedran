import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogIn } from 'lucide-react';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-on-surface antialiased relative">
      <header className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto relative z-10">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-on-surface">Dedran</Link>
      </header>

      <div className="flex items-center justify-center px-4 pb-16">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Welcome back</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded mb-6 font-body-sm text-body-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors({ ...fieldErrors, email: null }); }}
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
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors({ ...fieldErrors, password: null }); }}
                placeholder="Min. 8 characters"
                className="w-full bg-[#07090E] border border-charcoal-gray rounded px-4 py-2.5 text-on-surface focus:border-[#D9D9D6] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] outline-none transition-all font-body-md text-body-md placeholder:text-on-surface-variant"
              />
              {fieldErrors.password && <p className="text-error text-label-caps mt-1">{fieldErrors.password}</p>}
            </div>

            <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full justify-center">
              {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
            </Button>
          </form>

          <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
            Dont have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-semibold">Create one</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;