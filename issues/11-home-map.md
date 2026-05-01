# 11 — Home: mapa con `react-native-maps`

**Fase:** 3 · Pantallas
**Dependencias:** 04, 05, 06, 08
**Estimación:** 4 h

## Contexto
Referencia: `Proyecto IHC/components/screens-mobile-1.jsx` `ScreenHome` y `MapCanvas` (líneas 100–339).

El prototipo usa un SVG ficticio. En la app real reemplazamos por `<MapView>` (Google Maps en Android, Apple Maps en iOS — `react-native-maps` ya está instalado) con marcadores custom.

## Tareas
- [ ] Crear `app/(tabs)/mapa.tsx` con vista mapa por defecto.
- [ ] Header overlay (`position: 'absolute'`, top, gradient para legibilidad sobre el mapa):
  - Pequeño label mono: "Col. Centro · Miahuatlán" (placeholder hasta tener geocoding inverso).
  - Saludo serif "Hola, **buen día**".
  - Botón circular de notificaciones con dot rojo si hay no leídas → `router.push('/notificaciones')`.
- [ ] Search bar fake (luego se hace real): placeholder "Buscar calle, colonia, tipo…" + chip de filtros activos.
- [ ] Toggle Mapa/Lista (la vista lista vive en la issue 12).
- [ ] `<MapView>`:
  - `provider={PROVIDER_GOOGLE}` solo en Android (mejor que el default).
  - `initialRegion` centrada en la ubicación del usuario (con `expo-location`).
  - Estilo de mapa minimalista (descargar uno de [snazzymaps.com](https://snazzymaps.com) o usar el default).
  - Pin "you are here" pulsante.
- [ ] Markers custom por reporte:
  - Color por severidad (verde/amber/rojo).
  - Pulse animado en los `high`.
  - Implementar con `<Marker>` + componente custom hijo (View con `Animated` para el pulse).
- [ ] Filtros chip horizontal scroll: `[Todos · Alto · Medio · Bajo · Hoy · <500m]`. Aplicar al `useReportes()`.
- [ ] Bottom sheet preview del reporte cercano: `<ReportRow>` envuelto en card, `position: absolute, bottom: 90` (encima del TabBar). Tap → `router.push('/reporte/[id]')`.
- [ ] Botones flotantes de zoom/locate a la derecha (decorativos al inicio, luego integrar con `MapView` ref).

## Criterios de aceptación
- El mapa carga centrado en la ubicación real del usuario tras conceder permiso.
- Si se deniega permiso, fallback a un centro fijo (Miahuatlán) sin crashear.
- Los pins pintan con color correcto por severidad.
- Filtros recargan los pins (vía `useReportes` con filtros).
- Bottom sheet del reporte cercano hace push al detalle correcto.
