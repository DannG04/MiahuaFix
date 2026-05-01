# 08 — Hooks de datos con realtime

**Fase:** 2 · Datos
**Dependencias:** 07, 09
**Estimación:** 2.5 h

## Contexto
Las pantallas necesitan leer/escribir reportes con suscripción en tiempo real (cambio de estado, nuevos votos). Centralizar en hooks evita duplicar queries.

## Tareas
- [ ] Crear `src/hooks/useReportes.ts` — lista paginada con filtros opcionales (`tipo`, `severidad`, `estado`, `nearLatLng`, `radiusMeters`).
  - Suscribir a canal `reportes:public` con `supabase.channel(...).on('postgres_changes', { event: '*', table: 'reportes' }, ...)`.
  - Devuelve `{ data, loading, error, refetch }`.
- [ ] Crear `src/hooks/useReporte.ts` — un solo reporte por id, con realtime en esa fila + lista de confirmaciones.
- [ ] Crear `src/hooks/useMisReportes.ts` — filtra por `anon_id` (de la issue 09).
- [ ] Crear `src/hooks/useNotificaciones.ts` — lista por `anon_id`, marcar como leída.
- [ ] Crear `src/lib/api/reportes.ts` con funciones puras:
  - `crearReporte({ tipo, severidad, descripcion, lat, lng, fotoUri, anonId })` — sube foto a `evidencias-reportes` y hace `insert`.
  - `confirmarReporte({ reporteId, anonId })` — `insert` en `confirmaciones`.
- [ ] Implementar nearby con `ST_DWithin(ubicacion, ST_SetSRID(ST_MakePoint($lng,$lat),4326)::geography, $radius)` vía RPC en Supabase (crear función SQL `reportes_cercanos(lat, lng, radio_m)`).

## Criterios de aceptación
- `useReportes()` en una pantalla pinta la lista y se actualiza sola cuando otro cliente inserta un reporte.
- Llamar `crearReporte()` con foto válida deja el registro y lo refleja realtime en otra sesión.
- `confirmarReporte()` incrementa `votos` (vía trigger de la issue 07).
- Errores de red no rompen la UI (los hooks manejan `error` y la UI puede mostrar fallback).
