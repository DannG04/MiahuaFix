import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export type Estadisticas = {
  activos:  number;
  resueltos: number;
};

export function useEstadisticas() {
  const [data,    setData]    = useState<Estadisticas>({ activos: 0, resueltos: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [activosRes, resueltosRes] = await Promise.all([
          supabase
            .from('reportes')
            .select('*', { count: 'exact', head: true })
            .in('estado', ['pending', 'confirmed', 'assigned', 'pendiente']),
          supabase
            .from('reportes')
            .select('*', { count: 'exact', head: true })
            .eq('estado', 'resolved'),
        ]);
        setData({
          activos:  activosRes.count  ?? 0,
          resueltos: resueltosRes.count ?? 0,
        });
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}
