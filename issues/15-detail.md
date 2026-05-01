# 15 — Detalle de reporte

**Fase:** 3 · Pantallas
**Dependencias:** 04, 08
**Estimación:** 3 h

## Contexto
Referencia: `screens-mobile-3.jsx` `ScreenDetail` (líneas 5–146).

Pantalla full-screen accesible desde el mapa, feed o "mis reportes".

## Tareas
- [ ] Crear `app/reporte/[id].tsx` con `useLocalSearchParams<{ id: string }>()`.
- [ ] Hook `useReporte(id)` (de la issue 08).
- [ ] Layout:
  - **Hero foto** (280pt). Botones flotantes top: back + share (los dos en pills semi-transparentes con `BlurView`).
  - Indicador de progreso para múltiples fotos (decorativo si solo hay una).
  - Chips horizontales: categoría + severidad + status.
  - Título serif (h1) + ubicación con pin pequeño + tiempo.
  - Descripción.
  - **Card CTA "Confirma para priorizar"** navy: cuenta + botón amber con icono pulgar y número de votos. Tap llama `confirmarReporte()`.
  - **Timeline** vertical con 4 eventos: Recibido → Confirmado → Asignado → Resuelto. Pintar `done = true` para los que ya pasaron, dot navy con check, conector amber semi-transparente.
  - **Card de ubicación** con minimapa + lat/lng + "Abrir en mapa" (link a Apple Maps / Google Maps con `Linking.openURL`).
- [ ] Manejo de loading (skeleton) y error (botón "Reintentar" + `router.back()`).
- [ ] Suscripción realtime: si cambia el estado del reporte mientras está abierto, animar el timeline.

## Criterios de aceptación
- Reporte cargado y visible en <1s con red razonable.
- Confirmar incrementa el contador en vivo (vía realtime).
- "Abrir en mapa" lanza la app de mapas nativa con las coordenadas.
- Si el reporte no existe, fallback a 404 con botón de regreso.
