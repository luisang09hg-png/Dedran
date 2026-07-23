import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogOut, Home, User, BookOpen, Briefcase, Users, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Feed', path: '/feed', icon: Home },
    { name: 'Perfil', path: '/profile', icon: User },
    { name: 'Cursos', path: '/courses', icon: BookOpen },
    { name: 'Aplicaciones', path: '/applications', icon: Briefcase },
    { name: 'Empresas y Usuarios', path: '/network', icon: Users },
    { name: 'Personalización', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Nav */}
      <nav className="md:hidden flex justify-between items-center px-margin-desktop h-16 w-full fixed top-0 bg-surface dark:bg-background border-b border-outline-variant z-50">
        <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          Dedran
        </div>
        <button onClick={handleLogout} className="text-primary font-label-md hover:text-primary transition-all duration-200">
          Cerrar sesión
        </button>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-full flex-col justify-between border-r border-outline-variant bg-surface dark:bg-surface-container shadow-sm w-64 p-4 z-40 hidden md:flex">
        <div>
          <div className="flex items-center gap-2 text-headline-md font-headline-md font-bold text-on-surface dark:text-on-surface mb-8 px-4 pt-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span>Dedran</span>
          </div>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `rounded-xl flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-bold scale-95'
                        : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface dark:hover:bg-surface-container-highest font-label-md text-label-md'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto border-t border-outline-variant pt-4 pb-2">
          <button 
            onClick={handleLogout}
            className="w-full text-left text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl flex items-center gap-3 px-4 py-3 transition-colors dark:hover:bg-surface-container-highest"
          >
            <User size={20} />
            <span className="font-label-md text-label-md flex-1 truncate">
              {profile?.full_name || profile?.email || 'Usuario'}
            </span>
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
