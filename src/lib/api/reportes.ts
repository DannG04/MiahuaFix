import { supabase } from '@/src/lib/supabase';
import type { CategoriaReporte, SeveridadReporte } from '@/src/types/database';

export type CrearReporteParams = {
  titulo:       string;
  tipo:         CategoriaReporte;
  severidad:    SeveridadReporte;
  descripcion?: string;
  lat:          number;
  lng:          number;
  fotoUri:      string;
  anonId:       string;
};

export async function crearReporte({
  titulo, tipo, severidad, descripcion, lat, lng, fotoUri, anonId,
}: CrearReporteParams) {
  const fileName = `reporte_${anonId}_${Date.now()}.jpg`;

  const response = await fetch(fotoUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('evidencias-reportes')
    .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('evidencias-reportes')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('reportes')
    .insert({
      titulo:      titulo.trim(),
      tipo,
      severidad,
      descripcion: descripcion?.trim() || null,
      foto_url:    publicUrl,
      ubicacion:   `SRID=4326;POINT(${lng} ${lat})`,
      anon_id:     anonId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function confirmarReporte({
  reporteId,
  anonId,
}: {
  reporteId: string;
  anonId:    string;
}) {
  const { error } = await supabase
    .from('confirmaciones')
    .insert({ reporte_id: reporteId, anon_id: anonId });

  if (error) throw error;
}
