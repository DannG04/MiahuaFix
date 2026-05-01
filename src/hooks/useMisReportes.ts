import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import type { Database } from '@/src/types/database';

export type Reporte = Database['public']['Tables']['reportes']['Row'];

let instanceCount = 0;

export function useMisReportes(anonId: string | null) {
  const channelName = useRef(`useMisReportes:${++instanceCount}`).current;

  const [data,    setData]    = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!anonId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from('reportes')
        .select('*')
        .eq('anon_id', anonId)
        .order('creado_en', { ascending: false });

      if (err) throw err;
      setData(rows ?? []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [anonId]);

  const fetchRef = useRef(fetch);
  useEffect(() => { fetchRef.current = fetch; }, [fetch]);

  // Re-fetch when anonId changes
  useEffect(() => { fetch(); }, [fetch]);

  // Realtime subscription — only re-subscribes when anonId changes
  useEffect(() => {
    if (!anonId) return;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reportes', filter: `anon_id=eq.${anonId}` },
        () => { fetchRef.current(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anonId]);

  return { data, loading, error, refetch: fetch };
}
