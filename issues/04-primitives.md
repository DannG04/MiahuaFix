# 04 — Portar primitivos compartidos

**Fase:** 0 · Cimientos
**Dependencias:** 01, 02, 03
**Estimación:** 3 h

## Contexto
`Proyecto IHC/components/primitives.jsx` define los building blocks que reutilizan TODAS las pantallas. Hay que portarlos a React Native con tipado TypeScript.

## Tareas
Crear cada componente en `src/components/primitives/`:

- [ ] **`SeverityChip.tsx`** — props: `level: 'low' | 'medium' | 'high'`, `size?: 'sm' | 'lg'`. Pill con dot + label.
- [ ] **`StatusPill.tsx`** — props: `status: 'pending' | 'confirmed' | 'assigned' | 'resolved'`. Pill cuadrado con label en mayúsculas.
- [ ] **`CategoryIcon.tsx`** — props: `type: 'bache' | 'agua' | 'basura' | 'alumbrado' | 'drenaje' | 'grafiti'`, `size?: number`, `color?: string`. Implementar con `react-native-svg` (`Svg`, `Path`, `Circle`).
- [ ] **`AnonBadge.tsx`** — props: `compact?: boolean`. Pill con icono escudo + "Anónimo".
- [ ] **`PhotoPlaceholder.tsx`** — props: `width?`, `height?`, `label?`, `radius?`. Patrón de rayas diagonales (puede hacerse con `Svg` `Pattern` o un `LinearGradient` repetido).
- [ ] **`ReportRow.tsx`** — props: `report`, `onPress`, `showVotes?`. Card con icono de categoría + título + ubicación + chip severidad + votos.

Todos:
- Usar `useTheme()` para colores.
- Sin estilos inline con hex; todos vía tokens.
- `Pressable` con `accessibilityRole="button"` donde aplique.
- Exportar tipos: `Severity`, `Status`, `Category`, `Report` (estos tipos vivirán en `src/types/report.ts`).

## Criterios de aceptación
- Los seis primitivos renderizan correctamente en una pantalla de prueba (`app/_dev.tsx` opcional).
- Visualmente coinciden con el prototipo (comparar lado a lado).
- `npx tsc --noEmit` no reporta errores.
