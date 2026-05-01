# 07 — Migración de schema en Supabase

**Fase:** 2 · Datos
**Dependencias:** —
**Estimación:** 1 h

## Contexto
La tabla `reportes` actual solo tiene `titulo, descripcion, foto_url, ubicacion`. El prototipo requiere categorías, severidades, estado, votos e identidad anónima. También se necesitan tablas para confirmaciones (votos) y notificaciones.

## Tareas
- [ ] Escribir migración SQL en `supabase/migrations/<timestamp>_extend_reportes.sql`:
  ```sql
  -- enums
  create type categoria_reporte as enum ('bache','agua','basura','alumbrado','drenaje','grafiti','otro');
  create type severidad_reporte as enum ('low','medium','high');
  create type estado_reporte as enum ('pending','confirmed','assigned','resolved');

  alter table reportes
    add column tipo categoria_reporte not null default 'otro',
    add column severidad severidad_reporte not null default 'medium',
    add column estado estado_reporte not null default 'pending',
    add column votos integer not null default 0,
    add column anon_id uuid;

  create index reportes_tipo_idx on reportes(tipo);
  create index reportes_estado_idx on reportes(estado);
  create index reportes_anon_id_idx on reportes(anon_id);
  ```
- [ ] Crear tabla `confirmaciones`:
  ```sql
  create table confirmaciones (
    id uuid primary key default gen_random_uuid(),
    reporte_id bigint references reportes(id) on delete cascade,
    anon_id uuid not null,
    created_at timestamptz default now(),
    unique(reporte_id, anon_id)
  );
  ```
- [ ] Crear tabla `notificaciones`:
  ```sql
  create table notificaciones (
    id uuid primary key default gen_random_uuid(),
    anon_id uuid not null,
    tipo text not null,           -- 'status' | 'vote' | 'resolved' | 'info'
    title text not null,
    description text,
    reporte_id bigint references reportes(id) on delete cascade,
    leida boolean default false,
    created_at timestamptz default now()
  );
  create index notificaciones_anon_id_idx on notificaciones(anon_id);
  ```
- [ ] Trigger que incremente `reportes.votos` al insertar en `confirmaciones`.
- [ ] Trigger que cree una notificación al cambiar `estado` o cuando `votos` cruza umbrales (3, 10).
- [ ] **RLS** (RNF-04 del ERS):
  - `reportes`: `select` público; `insert` permitido para anon (validar `anon_id` no nulo); `update` solo backend (rol `service_role`).
  - `confirmaciones`: `insert` con `anon_id = current_setting('request.headers.x-anon-id')` (o equivalente); `select` propio.
  - `notificaciones`: `select where anon_id = ...`.
- [ ] Generar tipos TS: `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.

## Criterios de aceptación
- Migración corre limpia sobre la BD existente sin perder datos.
- Insertar un reporte de prueba con todos los campos funciona desde el SQL editor.
- Las políticas RLS bloquean updates no autorizados (probar con anon key).
- `database.ts` queda comprometido.
