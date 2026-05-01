import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';

let instanceCount = 0;
import type { Database, CategoriaReporte, SeveridadReporte } from '@/src/types/database';

export type Reporte = Database['public']['Tables']['reportes']['Row'];

export type ReportesFilters = {
  tipo?:         CategoriaReporte;
  severidad?:    SeveridadReporte;
  estado?:       string;
  nearLatLng?:   { lat: number; lng: number };
  radiusMeters?: number;
  limit?:        number;
};

export function useReportes(filters: ReportesFilters = {}) {
  const channelName = useRef(`useReportes:${++instanceCount}`).current;
  const [data,    setData]    = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<Error | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtersKey = JSON.stringify(filters);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed: ReportesFilters = JSON.parse(filtersKey);

      if (parsed.nearLatLng) {
        const { data: rows, error: err } = await supabase.rpc('reportes_cercanos', {
          lat:     parsed.nearLatLng.lat,
          lng:     parsed.nearLatLng.lng,
          radio_m: parsed.radiusMeters ?? 3000,
        });
        if (err) throw err;
        setData((rows as Reporte[]) ?? []);
      } else {
        let query = supabase
          .from('reportes')
          .select('*')
          .order('creado_en', { ascending: false })
          .limit(parsed.limit ?? 50);

        if (parsed.tipo)      query = query.eq('tipo',      parsed.tipo);
        if (parsed.severidad) query = query.eq('severidad', parsed.severidad);
        if (parsed.estado)    query = query.eq('estado',    parsed.estado);

        const { data: rows, error: err } = await query;
        if (err) throw err;
        setData(rows ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    fetch();

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reportes' }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
