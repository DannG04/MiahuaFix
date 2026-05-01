import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/src/lib/supabase';
import type { Database } from '@/src/types/database';

export type Reporte      = Database['public']['Tables']['reportes']['Row'];
export type Confirmacion = Database['public']['Tables']['confirmaciones']['Row'];

export function useReporte(id: string | null) {
  const [data,           setData]           = useState<Reporte | null>(null);
  const [confirmaciones, setConfirmaciones] = useState<Confirmacion[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const [reporteRes, confirmsRes] = await Promise.all([
        supabase.from('reportes').select('*').eq('id', id).single(),
        supabase.from('confirmaciones').select('*').eq('reporte_id', id),
      ]);

      if (reporteRes.error) throw reporteRes.error;
      if (confirmsRes.error) throw confirmsRes.error;

      setData(reporteRes.data);
      setConfirmaciones(confirmsRes.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
    if (!id) return;

    const channel = supabase
      .channel(`useReporte:${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reportes', filter: `id=eq.${id}` },
        () => { fetch(); },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'confirmaciones', filter: `reporte_id=eq.${id}` },
        () => { fetch(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetch, id]);

  return { data, confirmaciones, loading, error, refetch: fetch };
}
