# 02 — Sistema de tokens de tema

**Fase:** 0 · Cimientos
**Dependencias:** —
**Estimación:** 1 h

## Contexto
El prototipo usa CSS variables (`--navy-800`, `--amber-500`, `--ink-700`, etc.) con una variante `theme-dark`. Hay que portar esos tokens a constantes JS y exponerlos vía contexto/hook para que las pantallas no tengan colores hardcodeados.

Referencia: `Proyecto IHC/styles.css` líneas 1–50.

## Tareas
- [ ] Crear `src/theme/colors.ts` con dos paletas (`light`, `dark`):
  - navy 900/800/700/600/500
  - amber 600/500/400/100 + `amberBg`
  - ink 900/700/500/400/300
  - ivory, paper
  - severidades: green 600/500/100, red 600/500/100
  - line, lineStrong
- [ ] Crear `src/theme/spacing.ts` (escala 4/8/12/16/20/24/28/32) y `src/theme/radii.ts` (8/10/12/14/16/18/20/26).
- [ ] Crear `src/theme/shadows.ts` con `sm`, `md`, `lg` (usando `shadowColor/Offset/Opacity/Radius` para iOS y `elevation` para Android).
- [ ] Crear `src/theme/index.ts` con `useTheme()` que retorne el objeto activo según `useColorScheme()`.
- [ ] Crear `ThemeProvider` opcional (contexto) si se quiere forzar tema desde Perfil — alternativamente, dejarlo para la issue 20.

## Criterios de aceptación
- `import { useTheme } from '@/src/theme'` funciona en cualquier pantalla.
- Cambiar el tema del sistema cambia los colores devueltos por `useTheme()`.
- Ningún color hex se usará directamente fuera de `src/theme/`.
