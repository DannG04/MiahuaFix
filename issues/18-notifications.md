# 18 — Centro de notificaciones

**Fase:** 3 · Pantallas
**Dependencias:** 04, 08, 09
**Estimación:** 2 h

## Contexto
Referencia: `screens-mobile-3.jsx` `ScreenNotifications` (líneas 308–367).

Lista de avisos del usuario. No es una tab — se abre desde el ícono campana del header del mapa.

## Tareas
- [ ] Crear `app/notificaciones.tsx`.
- [ ] Header: `[← back]` + label mono "Centro de avisos" + serif "Notificaciones" + link derecha "Marcar leídas".
- [ ] Lista vertical con divisores. Cada item:
  - Icono cuadrado coloreado por tipo:
    - `status` (azul) → flecha en círculo
    - `vote` (amber) → pulgar arriba
    - `resolved` (verde) → check
    - `info` (gris) → info circle
  - Título + descripción + tiempo relativo (`hace 5 min`, `hace 2 h`, `ayer`).
  - Dot rojo si `unread`.
- [ ] Tap en un item con `reporte_id` → push al detalle y marca como leída.
- [ ] "Marcar leídas" hace `update notificaciones set leida=true where anon_id=...`.
- [ ] Pull-to-refresh.
- [ ] Empty state: "Sin avisos por ahora — te avisaremos cuando cambien tus reportes".

## Criterios de aceptación
- Las notificaciones del usuario actual se cargan ordenadas por `created_at desc`.
- Tap marca leída y navega.
- Cuando llega una nueva notificación vía realtime, aparece arriba de la lista sin recargar.
- Dot rojo del header de Mapa se sincroniza con el conteo de no leídas.
