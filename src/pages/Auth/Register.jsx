import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { UserPlus, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const calculatePasswordStrength = (pass) => {
    if (pass.length === 0) return 0;
    let strength = 0;
    if (pass.length > 5) strength += 25;
    if (pass.length > 7) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-4 starry-bg">
        <div className="max-w-md w-full bg-surface-container p-8 rounded-2xl text-center border border-outline-variant/30 shadow-xl">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-headline-md font-bold mb-4">¡Registro Exitoso!</h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            Hemos enviado un correo electrónico de confirmación. Por favor, verifica tu bandeja de entrada para activar tu cuenta.
          </p>
          <Link to="/login" className="bg-surface text-on-surface hover:bg-surface-variant px-6 py-3 rounded-xl transition-colors font-label-md inline-block">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center p-4 py-12 starry-bg selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      <div className="w-full max-w-md bg-surface-container-low p-8 rounded-2xl shadow-xl border border-outline-variant/30">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-headline-md font-headline-md font-bold text-on-surface mb-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            Dedran
          </div>
          <h1 className="text-headline-lg font-headline-lg mb-2">Únete a la comunidad</h1>
          <p className="text-body-md text-on-surface-variant">Lanza tu carrera hoy mismo</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-label-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-label-md font-label-md mb-1 text-on-surface-variant">Nombre Completo</label>
            <input
              type="text"
              required
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-label-md font-label-md mb-1 text-on-surface-variant">Rol Principal</label>
            <select
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Estudiante / Junior</option>
              <option value="professional">Profesional Senior / Mentor</option>
              <option value="company">Reclutador / Empresa</option>
            </select>
          </div>

          <div>
            <label className="block text-label-md font-label-md mb-1 text-on-surface-variant">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-label-md font-label-md mb-1 text-on-surface-variant">Contraseña</label>
            <input
              type="password"
              required
              className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Mínimo 8 caracteres"
            />
            
            {/* Password Strength */}
            {formData.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 w-full">
                  <div className={`flex-1 rounded-full ${strength > 0 ? 'bg-error' : 'bg-outline-variant/30'} ${strength > 25 ? 'bg-warning' : ''} ${strength > 50 ? 'bg-primary' : ''} ${strength > 75 ? 'bg-green-500' : ''}`}></div>
                  <div className={`flex-1 rounded-full ${strength > 25 ? 'bg-error' : 'bg-outline-variant/30'} ${strength > 50 ? 'bg-primary' : ''} ${strength > 75 ? 'bg-green-500' : ''}`}></div>
                  <div className={`flex-1 rounded-full ${strength > 50 ? 'bg-primary' : 'bg-outline-variant/30'} ${strength > 75 ? 'bg-green-500' : ''}`}></div>
                  <div className={`flex-1 rounded-full ${strength > 75 ? 'bg-green-500' : 'bg-outline-variant/30'}`}></div>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 text-right">
                  {strength <= 25 && 'Débil'}
                  {strength === 50 && 'Media'}
                  {strength === 75 && 'Buena'}
                  {strength === 100 && 'Fuerte'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 mt-4 mb-6">
            <input type="checkbox" required className="mt-1 bg-surface-container border-outline-variant rounded focus:ring-primary text-primary" />
            <span className="text-label-sm text-on-surface-variant">
              Acepto los <a href="#" className="text-primary hover:underline">Términos de Servicio</a> y la <a href="#" className="text-primary hover:underline">Política de Privacidad</a>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || strength < 25}
            className="w-full bg-primary-container text-on-primary-container font-label-md py-3 rounded-xl hover:scale-[0.98] transition-transform flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : (
              <>
                <UserPlus size={18} />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/50"></div>
          <span className="text-label-sm text-on-surface-variant">O regístrate con</span>
          <div className="flex-1 h-px bg-outline-variant/50"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button type="button" className="bg-surface-container border border-outline-variant/50 hover:bg-surface-container-high transition-colors py-2 rounded-lg flex items-center justify-center gap-2 text-label-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button type="button" className="bg-surface-container border border-outline-variant/50 hover:bg-surface-container-high transition-colors py-2 rounded-lg flex items-center justify-center gap-2 text-label-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-label-md text-on-surface-variant">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:underline font-bold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
