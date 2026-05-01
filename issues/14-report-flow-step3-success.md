# 14 — Report Flow: paso 3 + éxito

**Fase:** 3 · Pantallas
**Dependencias:** 13, 08, 11
**Estimación:** 3 h

## Contexto
Referencia: `screens-mobile-2.jsx` `ReportStep3` y `ReportSuccess` (líneas 190–354).

Paso 3 captura foto y confirma ubicación. Después del envío exitoso se muestra una pantalla de gracias con el ID del reporte.

## Tareas
- [ ] **Paso 3 — Foto + ubicación** (`ReportStep3.tsx`):
  - Si no hay foto: dos botones grandes "Tomar foto" / "De galería" (usar `expo-camera` y `expo-image-picker` — ya hay lógica en el `nuevo-reporte.tsx` viejo).
  - Si hay foto: preview con botón × para quitarla; pill "Metadatos removidos" abajo (procesar EXIF antes de subir — usar `expo-image-manipulator` para re-comprimir y descartar metadatos).
  - Card de ubicación: minimapa (`<MapView>` pequeño no interactivo) + dirección + "Ajustar en el mapa →" (ruta opcional `/ajustar-ubicacion` que devuelve coords).
  - CTAs: `[← back]` + `[Revisar y enviar →]`.
- [ ] Al pulsar "Revisar y enviar":
  - Llamar `crearReporte()` del hook de la issue 08.
  - Loading con `<ActivityIndicator>` cubriendo el botón.
  - En éxito: setear `step = 3` (la pantalla `ReportSuccess`).
  - En error: mostrar `Alert` con el mensaje y dejar volver al paso 3.
- [ ] **Pantalla de éxito** (`ReportSuccess.tsx`):
  - Icono check enorme (navy con check amber).
  - Serif "Gracias. Listo." + descripción.
  - Pill con ID monospace `#R-2847` + AnonBadge compact (el ID real es el devuelto por Supabase, formateado como `R-` + 4 últimos chars del UUID).
  - Botón "Volver al mapa" → `router.replace('/(tabs)/mapa')`.
  - Link "Ver mi reporte →" → `router.replace('/reporte/[id]')`.

## Criterios de aceptación
- Sin foto no se puede avanzar.
- Sin ubicación válida no se puede enviar.
- La foto se sube a Supabase Storage limpia de EXIF (verificar con `exiftool` sobre el archivo subido).
- En éxito el reporte aparece en `(tabs)/mis-reportes` y en el feed.
