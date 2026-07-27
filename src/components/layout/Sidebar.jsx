import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import {
  LogOut, User, Bell, Compass, Sun, MessageSquare, Briefcase,
  Settings, HelpCircle, Star, Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationDropdown from '../notifications/NotificationDropdown';

const navItems = [
  { name: 'Galaxy View', path: '/galaxy', icon: Compass },
  { name: 'Star Systems', path: '/star-systems', icon: Sun },
  { name: 'Feed', path: '/feed', icon: MessageSquare },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Applications', path: '/applications', icon: Briefcase },
  { name: 'Messages', path: '/messages', icon: MessageSquare },
];

const bottomItems = [
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Support', path: '#', icon: HelpCircle },
];

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
      <nav className="fixed left-0 top-0 h-full flex-col border-r border-nebula-stroke bg-surface-container w-72 px-gutter py-8 z-40 hidden md:flex">
        {/* Brand */}
        <div className="mb-stack-lg">
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-3">
            <Star size={28} className="text-primary" />
            Nova Analytics
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Deep Space Explorer</p>
        </div>

        {/* Primary Nav */}
        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'text-primary font-bold border-r-2 border-primary bg-primary-container/20'
                    : 'text-on-surface-variant font-medium hover:bg-primary-container/20 hover:text-primary'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-body-md text-body-md">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-2 border-t border-nebula-stroke pt-6">
          {bottomItems.map((item) => (
            item.path === '#' ? (
              <a
                key={item.name}
                href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-primary-container/20 hover:text-primary transition-all duration-300 ease-in-out"
              >
                <item.icon size={18} />
                <span className="font-body-sm text-body-sm">{item.name}</span>
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                    isActive
                      ? 'text-primary font-bold bg-primary-container/20'
                      : 'text-on-surface-variant font-medium hover:bg-primary-container/20 hover:text-primary'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="font-body-sm text-body-sm">{item.name}</span>
              </NavLink>
            )
          ))}

          {/* User / Logout */}
          <div className="pt-4 mt-4 border-t border-nebula-stroke">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all duration-300 ease-in-out"
            >
              <User size={18} />
              <span className="font-body-sm text-body-sm flex-1 truncate text-left">
                {profile?.full_name || profile?.email || 'User'}
              </span>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;