import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Send, Loader2, User, Users, Plus, Search, X, 
  MoreVertical, Paperclip, Image, Smile, 
  ChevronLeft, Check, CheckCheck, Clock,
  MessageSquare, ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const currentUserId = useRef(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    currentUserId.current = user.id;
    await fetchConversations();
    subscribeToMessages();
    subscribeToConversations();
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('get_user_conversations', { user_uuid: user.id });
      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase.rpc('get_conversation_messages', { 
        conv_uuid: conversationId, 
        limit_count: 50, 
        offset_count: 0 
      });
      if (error) throw error;
      setMessages(data || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      // Mark as read
      await supabase.rpc('mark_conversation_read', { conv_uuid: conversationId, user_uuid: currentUserId.current });
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  let messageChannel = null;
  let conversationChannel = null;

  const subscribeToMessages = () => {
    if (!currentUserId.current) return;
    
    messageChannel = supabase
      .channel(`messages:${currentUserId.current}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=neq.${currentUserId.current}`,
      }, (payload) => {
        if (activeConversation && payload.new.conversation_id === activeConversation.id) {
          setMessages(prev => [...prev, payload.new]);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
        // Update conversation list
        setConversations(prev => prev.map(c => 
          c.id === payload.new.conversation_id 
            ? { ...c, last_message: payload.new.content, last_message_at: payload.new.created_at, unread_count: c.unread_count + 1 }
            : c
        ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
      })
      .subscribe();
  };

  const subscribeToConversations = () => {
    if (!currentUserId.current) return;
    
    conversationChannel = supabase
      .channel(`conversations:${currentUserId.current}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversation_participants',
        filter: `user_id=eq.${currentUserId.current}`,
      }, () => {
        fetchConversations();
      })
      .subscribe();
  };

  useEffect(() => {
    return () => {
      if (messageChannel) supabase.removeChannel(messageChannel);
      if (conversationChannel) supabase.removeChannel(conversationChannel);
    };
  }, []);

  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    await fetchMessages(conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation.id,
          sender_id: currentUserId.current,
          content,
        })
        .select(`
          *,
          sender:profiles!sender_id(id, full_name, username, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Optimistic update already handled by realtime
      // Update conversation list
      setConversations(prev => prev.map(c => 
        c.id === activeConversation.id 
          ? { ...c, last_message: content, last_message_at: data.created_at, unread_count: 0 }
          : c
      ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleStartNewChat = async (userId) => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase.rpc('get_or_create_direct_conversation', {
        user1_id: currentUserId.current,
        user2_id: userId,
      });
      if (error) throw error;

      const conversation = conversations.find(c => c.id === data);
      if (conversation) {
        handleSelectConversation(conversation);
      } else {
        // Fetch the new conversation
        const { data: convData } = await supabase.rpc('get_user_conversations', { user_uuid: currentUserId.current });
        const newConv = convData?.find(c => c.id === data);
        if (newConv) handleSelectConversation(newConv);
      }
      setShowNewChat(false);
    } catch (err) {
      console.error('Error starting chat:', err);
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim() || query.length < 2) {
      setUsers([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, headline')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq('id', currentUserId.current)
        .eq('is_onboarding_complete', true)
        .limit(10);
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => searchUsers(searchQuery), 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    if (diffHours < 24) return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (diffHours < 168) return date.toLocaleDateString('es-ES', { weekday: 'short' });
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getOtherUser = (conversation) => {
    if (!conversation) return {};
    if (conversation.type === 'direct') {
      return {
        id: conversation.other_user_id,
        full_name: conversation.other_user_name,
        username: conversation.other_user_username,
        avatar_url: conversation.other_user_avatar,
        headline: conversation.other_user_headline,
      };
    }
    return {
      id: conversation.id,
      full_name: conversation.name || 'Grupo',
      username: '',
      avatar_url: conversation.avatar_url,
    };
  };

  const filteredConversations = conversations.filter(c => {
    const other = getOtherUser(c);
    const search = searchQuery.toLowerCase();
    return other.full_name?.toLowerCase().includes(search) || 
           other.username?.toLowerCase().includes(search) ||
           c.last_message?.toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="h-screen bg-background text-on-background flex starry-bg">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // Compute chat content outside JSX to avoid IIFE parsing issues
  let chatContent;
  if (!activeConversation) {
    chatContent = (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="w-24 h-24 text-on-surface-variant/20 mb-6" />
        <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">Selecciona una conversación</h2>
        <p className="text-body-md text-on-surface-variant mb-6">O empieza una nueva</p>
        <button
          onClick={() => setShowNewChat(true)}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md flex items-center gap-2 hover:scale-[0.98] transition-transform"
        >
          <Plus size={18} />
          Nuevo mensaje
        </button>
      </div>
    );
  } else {
    chatContent = (
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface">
          <button
            onClick={() => setActiveConversation(null)}
            className="md:hidden p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30">
                {getOtherUser(activeConversation).avatar_url ? (
                  <img src={getOtherUser(activeConversation).avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-headline-sm font-bold text-primary">
                      {getOtherUser(activeConversation).full_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-md font-semibold text-on-surface truncate">
                {getOtherUser(activeConversation).full_name || getOtherUser(activeConversation).username}
              </p>
              {getOtherUser(activeConversation).headline && (
                <p className="text-label-sm text-on-surface-variant truncate">
                  {getOtherUser(activeConversation).headline}
                </p>
              )}
            </div>
          </div>
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant" aria-label="Más opciones">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
          onScroll={(e) => {
            // Load more messages on scroll up
          }}
        >
          {loadingMessages ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare className="w-16 h-16 text-on-surface-variant/30 mb-4" />
              <p className="text-body-md text-on-surface-variant">No hay mensajes aún</p>
              <p className="text-label-sm text-on-surface-variant/70 mt-1">Envía el primer mensaje</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isOwn = msg.sender_id === currentUserId.current;
                const showTime = idx === 0 || 
                  new Date(msg.created_at).getHours() !== new Date(messages[idx - 1]?.created_at)?.getHours() ||
                  new Date(msg.created_at).getDate() !== new Date(messages[idx - 1]?.created_at)?.getDate();
                const showAvatar = idx === messages.length - 1 || 
                  messages[idx + 1]?.sender_id !== msg.sender_id;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    {!isOwn && showAvatar && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
                          {msg.sender?.avatar_url ? (
                            <img src={msg.sender.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-label-md font-bold text-primary">
                                {msg.sender?.full_name?.[0]?.toUpperCase() || msg.sender?.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}
                    
                    <div className={`flex-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isOwn && idx === 0 && (
                        <p className="text-label-sm text-on-surface-variant/70 mb-1 ml-1">
                          {msg.sender?.full_name || msg.sender?.username}
                        </p>
                      )}
                      <div className={`relative px-4 py-2 rounded-2xl ${
                        isOwn 
                          ? 'bg-primary-container text-on-primary-container rounded-tr-sm' 
                          : 'bg-surface-container text-on-surface rounded-tl-sm'
                      }`}>
                        <p className="text-body-md whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'} ml-1 mr-1`}>
                        <span className="text-[10px] text-on-surface-variant/50">
                          {formatTime(msg.created_at)}
                        </span>
                        {isOwn && (
                          <span className="text-[10px] text-on-primary-container/70">
                            {msg.deleted_at ? 'Eliminado' : '✓✓'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isOwn && showAvatar && <div className="w-8 flex-shrink-0" />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant flex-shrink-0"
              aria-label="Adjuntar archivo"
            >
              <Paperclip size={22} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                rows={1}
                className="w-full bg-surface-container border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none max-h-32"
                style={{ minHeight: '48px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="p-2.5 rounded-xl bg-primary-container text-on-primary-container hover:scale-[0.95] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Enviar mensaje"
            >
              {sending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-on-background flex starry-bg overflow-hidden">
      {/* Conversations List - Mobile Drawer */}
      <aside className="fixed inset-y-0 left-0 z-40 w-80 md:relative md:translate-x-0 transform -translate-x-full md:transform-none transition-transform duration-300 ease-in-out bg-surface border-r border-outline-variant flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <h2 className="text-headline-md font-headline-md text-on-surface">Mensajes</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="md:hidden p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant"
            aria-label="Nuevo chat"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversaciones..."
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-12 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
              <p className="text-body-md text-on-surface-variant mb-2">No hay conversaciones</p>
              <p className="text-label-sm text-on-surface-variant/70">Empieza a chatear con alguien</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="mt-4 bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-label-md flex items-center gap-2 mx-auto hover:scale-[0.98] transition-transform"
              >
                <Plus size={18} />
                Nuevo chat
              </button>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/30">
              {filteredConversations.map(conv => {
                const other = getOtherUser(conv);
                const isActive = activeConversation?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 transition-colors ${
                      isActive 
                        ? 'bg-primary-container/30 ring-1 ring-primary/20' 
                        : 'hover:bg-surface-variant/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30">
                        {other.avatar_url ? (
                          <img src={other.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-headline-sm font-bold text-primary">
                              {other.full_name?.[0]?.toUpperCase() || other.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unread_count > 9 ? '9+' : conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-body-md font-semibold truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                          {other.full_name || other.username || 'Usuario'}
                        </p>
                        <p className="text-label-sm text-on-surface-variant/70 whitespace-nowrap">
                          {formatTime(conv.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className={`text-body-sm truncate ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {conv.last_message || 'Sin mensajes'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* New Chat Button (Desktop) */}
        <div className="p-4 border-t border-outline-variant/30 hidden md:block">
          <button
            onClick={() => setShowNewChat(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md hover:scale-[0.98] transition-transform"
          >
            <Plus size={18} />
            Nuevo mensaje
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <button
        onClick={() => setActiveConversation(null)}
        className="md:hidden fixed inset-0 z-30 bg-background/50"
        aria-label="Cerrar lista"
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        {/* Empty State / Chat Window */}
        {chatContent}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm starry-bg">
          <div className="w-full max-w-md bg-surface-container rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
              <h3 className="text-headline-md font-headline-md text-on-surface">Nuevo mensaje</h3>
              <button
                onClick={() => { setShowNewChat(false); setSearchQuery(''); setUsers([]); }}
                className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 border-b border-outline-variant/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar usuarios..."
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-12 py-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto no-scrollbar">
              {loadingUsers ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center">
                  <User className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                  <p className="text-body-md text-on-surface-variant">No se encontraron usuarios</p>
                  <p className="text-label-sm text-on-surface-variant/70 mt-1">Busca por nombre o usuario</p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/30">
                  {users.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleStartNewChat(user.id)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-surface-variant transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border border-outline-variant/30 flex-shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-label-lg font-bold text-primary">
                              {user.full_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-md font-semibold text-on-surface truncate">
                          {user.full_name || user.username}
                        </p>
                        <p className="text-label-sm text-on-surface-variant truncate">
                          @{user.username}
                        </p>
                        {user.headline && (
                          <p className="text-[11px] text-on-surface-variant/70 truncate mt-0.5">
                            {user.headline}
                          </p>
                        )}
                      </div>
                      <MessageSquare size={20} className="text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 z-50 glass-card rounded-xl p-4 border border-error/30 bg-error-container/20 animate-slide-in">
          <div className="flex items-center gap-2">
            <span className="text-on-error-container text-label-md">{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-error/20 rounded">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;