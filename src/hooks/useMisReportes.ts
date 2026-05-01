import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/src/lib/supabase';
import type { Database } from '@/src/types/database';

export type Reporte = Database['public']['Tables']['reportes']['Row'];

// anonId comes from useAnonId (issue 09). Pass null while loading.
export function useMisReportes(anonId: string | null) {
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

  useEffect(() => {
    fetch();
    if (!anonId) return;

    const channel = supabase
      .channel(`useMisReportes:${anonId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reportes', filter: `anon_id=eq.${anonId}` },
        () => { fetch(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetch, anonId]);

  return { data, loading, error, refetch: fetch };
}
