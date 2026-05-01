# 16 — Feed comunitario

**Fase:** 3 · Pantallas
**Dependencias:** 04, 08
**Estimación:** 2 h

## Contexto
Referencia: `screens-mobile-3.jsx` `ScreenFeed` (líneas 149–233).

Vista comunitaria con stats globales y reportes agrupados por estado.

## Tareas
- [ ] Crear `app/(tabs)/comunidad.tsx`.
- [ ] Header sticky:
  - Label mono "Comunidad".
  - Serif h1 "Lo que **pasa** en tu ciudad" (la palabra "pasa" en italic amber).
  - **Stats row**: 3 cards con número grande serif + label.
    - Activos (amber) — count `where estado in ('pending','confirmed','assigned')`.
    - Resueltos esta semana (verde) — count `where estado='resolved' and resolved_at >= now() - interval '7 days'`.
    - Promedio resolución (azul) — `avg(resolved_at - created_at) where estado='resolved'`.
  - Tabs: `Todo · Cerca · Mi colonia · Tendencias` (subrayado amber el activo).
- [ ] Cuerpo: `<SectionList>` con 2 secciones:
  - "Activos ahora" — subtítulo "N reportes en curso en tu colonia" + link "Ver todo".
  - "Resueltos esta semana" — subtítulo + link.
- [ ] Cada item es `<ReportRow>`. Tap → detalle.
- [ ] Las stats deben venir de un hook nuevo `useEstadisticas()` que llame una RPC en Supabase (`select count(*)...`) — crear la función SQL en la migración o en una nueva.

## Criterios de aceptación
- Las stats reflejan el estado real de la BD.
- Tabs cambian el filtrado (al menos "Cerca" requiere geolocation; las otras pueden ser placeholders cliente).
- Sticky header se queda fijo al hacer scroll.
