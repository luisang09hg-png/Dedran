-- =============================================
-- MIGRACIÓN 00002 - MENSAJERÍA Y CONVERSACIONES
-- =============================================

-- 1. TABLA CONVERSATIONS
-- =============================================
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
    name TEXT, -- Para grupos
    avatar_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_created_at ON public.conversations(created_at DESC);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- 2. TABLA CONVERSATION_PARTICIPANTS
-- =============================================
CREATE TABLE public.conversation_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    muted BOOLEAN DEFAULT FALSE,
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);

-- 3. TABLA MESSAGES
-- =============================================
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
    media_urls TEXT[] DEFAULT '{}',
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_reply_to_id ON public.messages(reply_to_id);

-- 4. TRIGGERS PARA UPDATED_AT
-- =============================================
CREATE TRIGGER trigger_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. FUNCIÓN PARA ACTUALIZAR updated_at DE CONVERSACIÓN AL ENVIAR MENSAJE
-- =============================================
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.conversations 
    SET updated_at = NOW() 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_conversation_on_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_conversation_timestamp();

-- 6. FUNCIÓN PARA CREAR/OBTENER CONVERSACIÓN DIRECTA
-- =============================================
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    conv_id UUID;
BEGIN
    -- Buscar conversación existente entre los dos usuarios
    SELECT c.id INTO conv_id
    FROM public.conversations c
    JOIN public.conversation_participants cp1 ON cp1.conversation_id = c.id
    JOIN public.conversation_participants cp2 ON cp2.conversation_id = c.id
    WHERE c.type = 'direct'
    AND cp1.user_id = user1_id
    AND cp2.user_id = user2_id
    AND (
        SELECT COUNT(*) FROM public.conversation_participants 
        WHERE conversation_id = c.id
    ) = 2
    LIMIT 1;

    IF conv_id IS NOT NULL THEN
        RETURN conv_id;
    END IF;

    -- Crear nueva conversación
    INSERT INTO public.conversations (type, created_by)
    VALUES ('direct', user1_id)
    RETURNING id INTO conv_id;

    -- Agregar participantes
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (conv_id, user1_id), (conv_id, user2_id);

    RETURN conv_id;
END;
$$;

-- 7. FUNCIÓN PARA OBTENER CONVERSACIONES DEL USUARIO CON ÚLTIMO MENSAJE
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_conversations(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    type TEXT,
    name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ,
    other_user_id UUID,
    other_user_name TEXT,
    other_user_username TEXT,
    other_user_avatar TEXT,
    other_user_headline TEXT,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    last_message_sender_id UUID,
    unread_count BIGINT
) LANGUAGE sql STABLE AS $$
    SELECT 
        c.id,
        c.type,
        c.name,
        c.avatar_url,
        c.updated_at,
        CASE 
            WHEN c.type = 'direct' THEN cp2.user_id
        END AS other_user_id,
        CASE 
            WHEN c.type = 'direct' THEN p2.full_name
        END AS other_user_name,
        CASE 
            WHEN c.type = 'direct' THEN p2.username
        END AS other_user_username,
        CASE 
            WHEN c.type = 'direct' THEN p2.avatar_url
        END AS other_user_avatar,
        CASE 
            WHEN c.type = 'direct' THEN p2.headline
        END AS other_user_headline,
        COALESCE(m.content, '') AS last_message,
        m.created_at AS last_message_at,
        m.sender_id AS last_message_sender_id,
        COALESCE((
            SELECT COUNT(*) FROM public.messages m2
            WHERE m2.conversation_id = c.id
            AND m2.sender_id != user_uuid
            AND m2.created_at > cp.last_read_at
            AND m2.deleted_at IS NULL
        ), 0) AS unread_count
    FROM public.conversations c
    JOIN public.conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = user_uuid
    LEFT JOIN public.conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id != user_uuid
    LEFT JOIN public.profiles p2 ON p2.id = cp2.user_id
    LEFT JOIN LATERAL (
        SELECT content, created_at, sender_id
        FROM public.messages
        WHERE conversation_id = c.id AND deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 1
    ) m ON true
    ORDER BY c.updated_at DESC;
$$;

-- 8. FUNCIÓN PARA OBTENER MENSAJES DE UNA CONVERSACIÓN
-- =============================================
CREATE OR REPLACE FUNCTION public.get_conversation_messages(conv_uuid UUID, limit_count INT DEFAULT 50, offset_count INT DEFAULT 0)
RETURNS TABLE (
    id UUID,
    conversation_id UUID,
    sender_id UUID,
    content TEXT,
    type TEXT,
    media_urls TEXT[],
    reply_to_id UUID,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    sender_name TEXT,
    sender_username TEXT,
    sender_avatar TEXT
) LANGUAGE sql STABLE AS $$
    SELECT 
        m.id,
        m.conversation_id,
        m.sender_id,
        m.content,
        m.type,
        m.media_urls,
        m.reply_to_id,
        m.edited_at,
        m.created_at,
        p.full_name AS sender_name,
        p.username AS sender_username,
        p.avatar_url AS sender_avatar
    FROM public.messages m
    JOIN public.profiles p ON p.id = m.sender_id
    WHERE m.conversation_id = conv_uuid
    AND m.deleted_at IS NULL
    ORDER BY m.created_at DESC
    LIMIT limit_count OFFSET offset_count;
$$;

-- 9. FUNCIÓN PARA MARCAR CONVERSACIÓN COMO LEÍDA
-- =============================================
CREATE OR REPLACE FUNCTION public.mark_conversation_read(conv_uuid UUID, user_uuid UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.conversation_participants
    SET last_read_at = NOW()
    WHERE conversation_id = conv_uuid AND user_id = user_uuid;
END;
$$;

-- 10. RLS POLICIES
-- =============================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations: usuarios pueden ver conversaciones donde participan
CREATE POLICY "Users can view own conversations" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_id = conversations.id AND user_id = auth.uid()
        )
    );

-- Crear conversaciones (solo via función get_or_create_direct_conversation)
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Conversation participants
CREATE POLICY "Users can view own participations" ON public.conversation_participants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can add participants to own conversations" ON public.conversation_participants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversation_participants cp
            WHERE cp.conversation_id = conversation_participants.conversation_id
            AND cp.user_id = auth.uid()
        )
    );

-- Messages
CREATE POLICY "Users can view messages in own conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to own conversations" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can soft delete own messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid() AND deleted_at IS NULL);

-- 11. REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;

-- 12. COMENTARIOS
-- =============================================
COMMENT ON TABLE public.conversations IS 'Conversaciones directas y grupales';
COMMENT ON TABLE public.conversation_participants IS 'Participantes de cada conversación';
COMMENT ON TABLE public.messages IS 'Mensajes dentro de conversaciones';
COMMENT ON FUNCTION public.get_or_create_direct_conversation IS 'Obtiene o crea una conversación directa entre dos usuarios';
COMMENT ON FUNCTION public.get_user_conversations IS 'Obtiene todas las conversaciones de un usuario con último mensaje y conteo no leídos';
COMMENT ON FUNCTION public.get_conversation_messages IS 'Obtiene mensajes de una conversación con paginación';
COMMENT ON FUNCTION public.mark_conversation_read IS 'Marca una conversación como leída para el usuario';