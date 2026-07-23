import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { 
  LogOut, Home, User, BookOpen, Briefcase, Users, Settings, 
  MessageSquare, Bell, Plus 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    };
    fetchProfile();

    // Subscribe to notifications
    if (user) {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadNotifications(count || 0);

      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => {
          setUnreadNotifications(prev => prev + 1);
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Feed', path: '/feed', icon: Home },
    { name: 'Mensajes', path: '/messages', icon: MessageSquare, badge: 0 },
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
        <div className="flex items-center gap-2">
          <div className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            Dedran
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors"
              aria-label={`Notificaciones${unreadNotifications > 0 ? `, ${unreadNotifications} sin leer` : ''}`}
            >
              <Bell size={24} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <NotificationDropdown 
              userId={user?.id} 
              isOpen={notificationsOpen} 
              onClose={() => setNotificationsOpen(false)} 
            />
          </div>
          <button onClick={handleLogout} className="text-primary font-label-md hover:text-primary transition-all duration-200 px-3 py-1.5 rounded-lg">
            Cerrar sesión
          </button>
        </div>
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
                    `rounded-xl flex items-center gap-3 px-4 py-3 transition-all duration-200 relative ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-bold scale-95'
                        : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface dark:hover:bg-surface-container-highest font-label-md text-label-md'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto border-t border-outline-variant pt-4 pb-2 space-y-2">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                notificationsOpen 
                  ? 'bg-primary-container/30 text-primary' 
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface dark:hover:bg-surface-container-highest'
              }`}
            >
              <Bell size={20} />
              <span className="font-label-md text-label-md flex-1 truncate">Notificaciones</span>
              {unreadNotifications > 0 && (
                <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <NotificationDropdown 
              userId={user?.id} 
              isOpen={notificationsOpen} 
              onClose={() => setNotificationsOpen(false)} 
            />
          </div>
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
