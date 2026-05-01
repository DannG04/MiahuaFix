-- RPC: devuelve reportes dentro de radio_m metros de (lat, lng).
-- ubicacion ya es tipo geography nativo; ST_* viven en extensions.
create or replace function reportes_cercanos(lat float8, lng float8, radio_m float8 default 3000)
returns setof reportes
language sql
stable
security definer
as $$
  select *
    from reportes
   where extensions.ST_DWithin(
           ubicacion,
           extensions.ST_SetSRID(extensions.ST_MakePoint(lng, lat), 4326)::extensions.geography,
           radio_m
         )
   order by creado_en desc;
$$;
