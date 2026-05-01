# 10 — Pantalla de Onboarding

**Fase:** 3 · Pantallas
**Dependencias:** 02, 03, 09
**Estimación:** 2 h

## Contexto
Referencia: `Proyecto IHC/components/screens-mobile-1.jsx` `ScreenOnboarding` (líneas 5–98).

Pantalla única (no carrusel real, los dots son decorativos en el prototipo) que se ve solo la primera vez. Mensaje principal: "Tu reporte mejora tu colonia."

## Tareas
- [ ] Crear `app/onboarding.tsx`.
- [ ] Layout (de arriba abajo):
  - Badge mono: dot amber + "Ciudad · Reportes urbanos"
  - Bloque hero: serif gigante "Tu reporte mejora tu **colonia**" (la palabra "colonia" en italic + amber).
  - Párrafo descriptivo (~3 líneas).
  - Pills informativas: `<AnonBadge>` + "Sin crear cuenta".
  - Dots de progreso (3, primero amber).
  - CTA principal navy "Empezar →" (flecha amber).
  - Link inferior "Cómo protegemos tu anonimato →".
- [ ] Decoración: dos blobs radiales (amber arriba-derecha, navy izquierda) — implementar con `<View>` absolutos + `expo-linear-gradient` o un `Svg radial gradient`.
- [ ] Al presionar "Empezar": guardar `miahua.onboarded = true` en SecureStore y `router.replace('/(tabs)/mapa')`.
- [ ] Botón inferior abre un sheet/modal con el detalle de privacidad (puede ser un `<Modal>` simple o ruta `/privacidad`).

## Criterios de aceptación
- En primer arranque (sin la flag) se muestra; en arranques posteriores no.
- "Empezar" navega a `mapa` sin opción de regresar.
- Funciona en safe area (no se monta debajo del notch).
