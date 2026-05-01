-- ============================================================
-- Migration: extend reportes + confirmaciones + notificaciones
-- ============================================================

-- ─── Enums ───────────────────────────────────────────────────

create type categoria_reporte as enum (
  'bache', 'agua', 'basura', 'alumbrado', 'drenaje', 'grafiti', 'otro'
);

create type severidad_reporte as enum ('low', 'medium', 'high');

create type estado_reporte as enum (
  'pending', 'confirmed', 'assigned', 'resolved'
);

-- ─── Extend reportes ─────────────────────────────────────────

alter table reportes
  add column tipo      categoria_reporte not null default 'otro',
  add column severidad severidad_reporte not null default 'medium',
  add column estado    estado_reporte    not null default 'pending',
  add column votos     integer           not null default 0,
  add column anon_id   uuid;

create index reportes_tipo_idx    on reportes(tipo);
create index reportes_estado_idx  on reportes(estado);
create index reportes_anon_id_idx on reportes(anon_id);

-- ─── Confirmaciones (votos) ───────────────────────────────────

create table confirmaciones (
  id         uuid    primary key default gen_random_uuid(),
  reporte_id bigint  references reportes(id) on delete cascade,
  anon_id    uuid    not null,
  created_at timestamptz default now(),
  unique(reporte_id, anon_id)
);

create index confirmaciones_reporte_idx on confirmaciones(reporte_id);
create index confirmaciones_anon_idx    on confirmaciones(anon_id);

-- ─── Notificaciones ──────────────────────────────────────────

create table notificaciones (
  id          uuid    primary key default gen_random_uuid(),
  anon_id     uuid    not null,
  tipo        text    not null,   -- 'status' | 'vote' | 'resolved' | 'info'
  title       text    not null,
  description text,
  reporte_id  bigint  references reportes(id) on delete cascade,
  leida       boolean default false,
  created_at  timestamptz default now()
);

create index notificaciones_anon_id_idx on notificaciones(anon_id);

-- ─── Trigger: increment votos on confirmacion insert ─────────

create or replace function fn_increment_votos()
returns trigger language plpgsql security definer as $$
begin
  update reportes
     set votos = votos + 1
   where id = NEW.reporte_id;
  return NEW;
end;
$$;

create trigger trg_increment_votos
  after insert on confirmaciones
  for each row execute procedure fn_increment_votos();

-- ─── Trigger: notifications on estado change or vote threshold

create or replace function fn_notify_reporte_events()
returns trigger language plpgsql security definer as $$
declare
  v_anon_id uuid;
  v_titulo  text;
begin
  select anon_id, titulo
    into v_anon_id, v_titulo
    from reportes
   where id = NEW.id;

  -- Estado change
  if TG_OP = 'UPDATE' and OLD.estado is distinct from NEW.estado then
    if v_anon_id is not null then
      insert into notificaciones (anon_id, tipo, title, description, reporte_id)
      values (
        v_anon_id,
        'status',
        case NEW.estado
          when 'confirmed' then 'Reporte confirmado'
          when 'assigned'  then 'En camino'
          when 'resolved'  then 'Reporte resuelto'
          else 'Estado actualizado'
        end,
        'Tu reporte "' || v_titulo || '" cambió de estado.',
        NEW.id
      );
    end if;
  end if;

  -- Vote thresholds (3 and 10)
  if TG_OP = 'UPDATE'
     and OLD.votos is distinct from NEW.votos
     and NEW.votos in (3, 10)
  then
    if v_anon_id is not null then
      insert into notificaciones (anon_id, tipo, title, description, reporte_id)
      values (
        v_anon_id,
        'vote',
        NEW.votos || ' personas confirmaron tu reporte',
        '"' || v_titulo || '" ganó apoyo de la comunidad.',
        NEW.id
      );
    end if;
  end if;

  return NEW;
end;
$$;

create trigger trg_notify_reporte_events
  after update on reportes
  for each row execute procedure fn_notify_reporte_events();

-- ─── RLS ─────────────────────────────────────────────────────

alter table reportes        enable row level security;
alter table confirmaciones  enable row level security;
alter table notificaciones  enable row level security;

-- reportes: lectura pública
create policy "reportes_select_public"
  on reportes for select
  using (true);

-- reportes: insert permitido si anon_id no es nulo
create policy "reportes_insert_anon"
  on reportes for insert
  with check (anon_id is not null);

-- reportes: update/delete solo service_role (sin policy → solo service_role puede)

-- confirmaciones: cualquier anon puede insertar la suya propia
-- El header x-anon-id se pasa desde el cliente como claim personalizado.
create policy "confirmaciones_insert_own"
  on confirmaciones for insert
  with check (
    anon_id = (
      nullif(current_setting('request.jwt.claims', true)::json->>'anon_id', '')::uuid
    )
  );

create policy "confirmaciones_select_own"
  on confirmaciones for select
  using (
    anon_id = (
      nullif(current_setting('request.jwt.claims', true)::json->>'anon_id', '')::uuid
    )
  );

-- notificaciones: cada usuario solo ve las suyas
create policy "notificaciones_select_own"
  on notificaciones for select
  using (
    anon_id = (
      nullif(current_setting('request.jwt.claims', true)::json->>'anon_id', '')::uuid
    )
  );

create policy "notificaciones_update_own"
  on notificaciones for update
  using (
    anon_id = (
      nullif(current_setting('request.jwt.claims', true)::json->>'anon_id', '')::uuid
    )
  )
  with check (true);
