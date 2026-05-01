# 17 — Mis reportes

**Fase:** 3 · Pantallas
**Dependencias:** 04, 08, 09
**Estimación:** 1.5 h

## Contexto
Referencia: `screens-mobile-3.jsx` `ScreenMine` (líneas 236–305).

Lista personal del usuario anónimo + tarjeta de impacto destacada.

## Tareas
- [ ] Crear `app/(tabs)/mis-reportes.tsx`.
- [ ] Header serif: "Mis reportes" + label mono "Tu historial".
- [ ] **Tarjeta de impacto** — gradient navy con blob amber:
  - Label "Tu impacto este mes".
  - 3 stats inline separadas por divisores: Reportes enviados / Resueltos / Confirmaron.
  - Datos calculados de `useMisReportes()` filtrando por mes actual.
- [ ] Filtros chip: `Todos (N) · Abiertos (N) · Resueltos (N)`. El conteo entre paréntesis se calcula client-side sobre la lista del hook.
- [ ] Lista de `<ReportRow>`. Tap → detalle.
- [ ] Empty state si el usuario no ha reportado nunca: ilustración + "Aún no has reportado nada — toca el + para empezar".

## Criterios de aceptación
- Solo aparecen reportes del `anon_id` actual.
- Al regenerar el ID anónimo (issue 19), la lista se vacía.
- Las cuentas de los chips coinciden con los datos.
- La tarjeta de impacto se actualiza al confirmar/reportar nuevo (vía realtime).
