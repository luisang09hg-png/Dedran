import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import {
  LogOut, User, Bell, Sparkles, Sun, Moon, MessageSquare, Briefcase,
  Settings, HelpCircle, Star, Search, Users, BookOpen, Home, TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationDropdown from '../notifications/NotificationDropdown';
import Badge from '../ui/Badge';

const navSections = [
  {
    title: 'Main',
    items: [
      { name: 'Home', path: '/galaxy', icon: Home },
      { name: 'Feed', path: '/feed', icon: MessageSquare },
      { name: 'Search', path: '/search', icon: Search },
    ],
  },
  {
    title: 'Career',
    items: [
      { name: 'Courses', path: '/star-systems', icon: BookOpen },
      { name: 'Jobs', path: '/applications', icon: Briefcase },
      { name: 'Network', path: '/network', icon: Users },
    ],
  },
];

const bottomItems = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Support', path: '#', icon: HelpCircle },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    };
    fetchProfile();

    if (user) {
      const fetchNotifications = async () => {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
        setUnreadNotifications(count || 0);
      };
      fetchNotifications();

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

  return (
    <>
      {/* Mobile Top Nav */}
      <nav className="md:hidden flex justify-between items-center px-4 h-16 w-full fixed top-0 bg-surface border-b border-nebula-stroke z-50">
        <div className="flex items-center gap-2">
          <Star size={24} className="text-primary" />
          <span className="font-headline-md text-headline-md font-bold text-on-surface">Nova Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-primary-container/20 text-on-surface-variant transition-colors"
              aria-label={`Notifications${unreadNotifications > 0 ? `, ${unreadNotifications} unread` : ''}`}
            >
              <Bell size={22} />
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
          <button onClick={handleLogout} className="text-primary text-label-caps font-semibold hover:text-on-surface transition-colors px-3 py-1.5">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-full flex-col border-r border-nebula-stroke bg-surface-container w-64 px-4 py-6 z-40 hidden md:flex">
        {/* Brand */}
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Star size={24} className="text-primary animate-float" />
              <Sparkles size={10} className="text-cosmic-accent absolute -top-1 -right-1" />
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Dedran</h1>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 ml-8">Career Explorer</p>
        </div>

        {/* Primary Nav */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant px-2 mb-2 text-xs uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth ${
                        isActive
                          ? 'text-primary bg-primary-container/30 border border-primary/20'
                          : 'text-on-surface-variant hover:bg-primary-container/20 hover:text-primary'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    <span className="font-body-sm text-body-sm">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-nebula-stroke pt-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-smooth"
            >
              <div className="relative">
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
              <span className="font-body-sm text-body-sm">Notifications</span>
            </button>
            <NotificationDropdown
              userId={user?.id}
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-smooth"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="font-body-sm text-body-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {bottomItems.map((item) => (
            item.path === '#' ? (
              <a
                key={item.name}
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-smooth"
              >
                <item.icon size={18} />
                <span className="font-body-sm text-body-sm">{item.name}</span>
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth ${
                    isActive
                      ? 'text-primary bg-primary-container/30 border border-primary/20'
                      : 'text-on-surface-variant hover:bg-primary-container/20 hover:text-primary'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="font-body-sm text-body-sm">{item.name}</span>
              </NavLink>
            )
          ))}

          {/* User / Logout */}
          <div className="pt-2 mt-2 border-t border-nebula-stroke">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-smooth"
            >
              <LogOut size={18} />
              <span className="font-body-sm text-body-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;