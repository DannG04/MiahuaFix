import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import type { Database } from '@/src/types/database';

export type Notificacion = Database['public']['Tables']['notificaciones']['Row'];

let instanceCount = 0;

export function useNotificaciones(anonId: string | null) {
  const channelName = useRef(`useNotificaciones:${++instanceCount}`).current;

  const [data,        setData]        = useState<Notificacion[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!anonId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('anon_id', anonId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      const items = rows ?? [];
      setData(items);
      setUnreadCount(items.filter((n) => !n.leida).length);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [anonId]);

  // Always point to the latest fetch without adding it as a subscription dep
  const fetchRef = useRef(fetch);
  useEffect(() => { fetchRef.current = fetch; }, [fetch]);

  // Re-fetch when anonId / filters change
  useEffect(() => { fetch(); }, [fetch]);

  // Realtime subscription — only re-subscribes when anonId changes, not on every fetch update
  useEffect(() => {
    if (!anonId) return;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificaciones', filter: `anon_id=eq.${anonId}` },
        () => { fetchRef.current(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // channelName is a stable ref value, anonId drives the filter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anonId]);

  const marcarLeida = useCallback(async (id: string) => {
    const { error: err } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id);

    if (!err) {
      setData((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    if (!anonId) return;
    const { error: err } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('anon_id', anonId)
      .eq('leida', false);

    if (!err) {
      setData((prev) => prev.map((n) => ({ ...n, leida: true })));
      setUnreadCount(0);
    }
  }, [anonId]);

  return { data, unreadCount, loading, error, marcarLeida, marcarTodasLeidas, refetch: fetch };
}
