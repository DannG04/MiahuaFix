# 05 — Reestructurar router con grupo (tabs)

**Fase:** 1 · Navegación
**Dependencias:** 04
**Estimación:** 1.5 h

## Contexto
Hoy `app/` tiene `_layout.tsx` (Stack), `index.tsx` (un botón) y `nuevo-reporte.tsx`. El prototipo requiere 5 tabs y un stack para detalle/notificaciones/onboarding.

## Tareas
- [ ] Crear estructura:
  ```
  app/
  ├─ _layout.tsx              (Stack raíz)
  ├─ onboarding.tsx           (modal/full-screen)
  ├─ (tabs)/
  │  ├─ _layout.tsx           (Tabs)
  │  ├─ mapa.tsx              (= index, ScreenHome)
  │  ├─ comunidad.tsx         (ScreenFeed)
  │  ├─ nuevo.tsx             (presenta modal con ScreenReportFlow)
  │  ├─ mis-reportes.tsx      (ScreenMine)
  │  └─ perfil.tsx            (ScreenProfile)
  ├─ reporte/
  │  └─ [id].tsx              (ScreenDetail)
  └─ notificaciones.tsx       (ScreenNotifications)
  ```
- [ ] En `(tabs)/_layout.tsx` usar `<Tabs>` de `expo-router` con `tabBar={(props) => <CustomTabBar {...props} />}` (el componente custom se construye en la issue 06).
- [ ] La ruta `nuevo` no debe ser una pantalla normal sino un modal: configurar `presentation: 'modal'` en el Stack, o interceptar el `tabPress` para hacer `router.push('/nuevo-reporte')` (que abrirá un modal). Decidir y documentar.
- [ ] Mover el `nuevo-reporte.tsx` actual a `app/nuevo-reporte.tsx` con `presentation: 'modal'` en el Stack — la lógica existente se conserva, solo cambia el chrome (issue 13/14 lo reemplazará por el wizard nuevo).
- [ ] La pantalla `index.tsx` debe redirigir: si no hay onboarding visto, a `/onboarding`; si sí, dejar que el grupo `(tabs)` se monte (o redirigir a `/(tabs)/mapa`).

## Criterios de aceptación
- Puedo navegar entre las 5 tabs.
- Tap en "Reportar" abre el form como modal.
- Botón atrás del sistema cierra el modal sin tirar la tab activa.
- `router.push('/reporte/123')` abre el detalle como push sobre el stack (no dentro de tabs).
