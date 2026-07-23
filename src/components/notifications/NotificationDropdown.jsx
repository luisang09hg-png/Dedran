import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Bell, Heart, MessageSquare, UserPlus, Check, X, 
  Loader2, ExternalLink, MoreHorizontal 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NOTIFICATION_TYPES = {
  like: { icon: Heart, color: 'text-error', bg: 'bg-error/10', label: 'Like' },
  comment: { icon: MessageSquare, color: 'text-tertiary', bg: 'bg-tertiary/10', label: 'Comentario' },
  follow: { icon: UserPlus, color: 'text-primary', bg: 'bg-primary/10', label: 'Seguidor' },
  mention: { icon: MessageSquare, color: 'text-warning', bg: 'bg-warning/10', label: 'Mención' },
  job_application: { icon: ExternalLink, color: 'text-success', bg: 'bg-success/10', label: 'Aplicación' },
};

const NotificationDropdown = ({ userId, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
      subscribeToNotifications();
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isOpen, userId]);

  let channel = null;

  const subscribeToNotifications = () => {
    if (!userId) return;
    
    channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
  };

  const fetchNotifications = async (loadMore = false) => {
    if (!userId) return;
    try {
      const currentPage = loadMore ? page + 1 : 0;
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(currentPage * 20, (currentPage + 1) * 20 - 1);

      if (error) throw error;

      if (loadMore) {
        setNotifications(prev => [...prev, ...(data || [])]);
      } else {
        setNotifications(data || []);
      }
      setPage(currentPage);
      setHasMore((data?.length || 0) === 20);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (!error) setUnreadCount(count || 0);
  };

  const markAsRead = async (notificationId) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      fetchNotifications(true);
    }
  };

  const getNotificationLink = (notification) => {
    const { reference_type, reference_id } = notification;
    switch (reference_type) {
      case 'post': return `/feed?post=${reference_id}`;
      case 'comment': return `/feed?comment=${reference_id}`;
      case 'profile': return `/profile/${reference_id}`;
      case 'job': return `/jobs/${reference_id}`;
      default: return '/feed';
    }
  };

  const NotificationItem = ({ notification }) => {
    const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.like;
    const Icon = typeConfig.icon;
    const timeAgo = formatDistanceToNow(new Date(notification.created_at), { 
      addSuffix: true, 
      locale: es 
    });

    return (
      <button
        onClick={() => {
          if (!notification.is_read) markAsRead(notification.id);
          onClose();
        }}
        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all ${
          !notification.is_read 
            ? 'bg-primary-container/30 ring-1 ring-primary/20' 
            : 'hover:bg-surface-variant/50'
        }`}
      >
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${typeConfig.bg}`}>
          <Icon size={18} className={typeConfig.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-body-sm font-body-md ${!notification.is_read ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}>
            {notification.message}
          </p>
          <p className="text-label-sm text-on-surface-variant/70 mt-0.5">{timeAgo}</p>
        </div>
        {!notification.is_read && (
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
        )}
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="fixed top-16 right-4 md:right-margin-desktop w-full md:w-80 glass-card rounded-2xl shadow-2xl border border-outline-variant/30 z-50 animate-slide-down overflow-hidden"
      role="menu"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-primary" />
          <h3 className="text-headline-sm font-headline-sm text-on-surface">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-on-primary text-[10px] font-label-sm px-2 py-0.5 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-label-sm text-primary hover:underline px-2 py-1"
            >
              Leer todo
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div 
        ref={listRef}
        onScroll={handleScroll}
        className="max-h-[500px] overflow-y-auto no-scrollbar"
        role="list"
      >
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="text-primary animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="text-on-surface-variant/30 mx-auto mb-3" />
            <p className="text-body-md text-on-surface-variant">No hay notificaciones</p>
            <p className="text-label-sm text-on-surface-variant/70 mt-1">Cuando tengas actividad, aparecerá aquí</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}

        {hasMore && !loading && (
          <div className="p-4 text-center">
            <button
              onClick={() => fetchNotifications(true)}
              disabled={loading}
              className="text-label-md text-primary hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              Cargar más
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-outline-variant/30 bg-surface-container/50">
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors font-label-md"
        >
          <X size={16} />
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;