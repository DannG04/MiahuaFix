import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/src/lib/supabase';
import type { Database } from '@/src/types/database';

export type Notificacion = Database['public']['Tables']['notificaciones']['Row'];

export function useNotificaciones(anonId: string | null) {
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

  useEffect(() => {
    fetch();
    if (!anonId) return;

    const channel = supabase
      .channel(`useNotificaciones:${anonId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificaciones', filter: `anon_id=eq.${anonId}` },
        () => { fetch(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetch, anonId]);

  return { data, unreadCount, loading, error, marcarLeida, marcarTodasLeidas, refetch: fetch };
}
