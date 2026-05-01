# 13 — Report Flow: pasos 1 y 2

**Fase:** 3 · Pantallas
**Dependencias:** 04, 05
**Estimación:** 3 h

## Contexto
Referencia: `Proyecto IHC/components/screens-mobile-2.jsx` `ScreenReportFlow`, `ReportStep1`, `ReportStep2`, `StepDots` (líneas 1–188).

Wizard modal de 3 pasos. Esta issue cubre paso 1 (categoría) y paso 2 (severidad + descripción + tags).

## Tareas
- [ ] Reescribir `app/nuevo-reporte.tsx` como contenedor del wizard:
  - Header: `[× cerrar]   Paso N de 3   [AnonBadge compact]`
  - `<StepDots step={n} total={3} />` (componente nuevo en `src/components/`).
  - Estado local: `step`, `tipo`, `severidad`, `descripcion`, `tags`, `fotoUri`, `coords`.
- [ ] **Paso 1 — Categoría** (`ReportStep1.tsx`):
  - Grid 2×2 de 4 categorías iniciales (bache, basura, alumbrado, agua) — usar `<CategoryIcon>`.
  - Cada card con: ícono coloreado, label, descripción.
  - Selección: borde 2px del color de la categoría + check pill en esquina.
  - Botón "Otro tipo de riesgo" (abre input adicional o ruta — definir).
  - CTA "Continuar →" deshabilitado hasta seleccionar.
- [ ] **Paso 2 — Severidad + descripción** (`ReportStep2.tsx`):
  - Tres botones grandes de severidad: Bajo (verde) · Medio (amber) · Alto (rojo). Selección con borde 2px.
  - `<TextInput>` multilínea con contador 0/240.
  - Chips sugeridos para agregar tags rápidos: "Daña autos · Zona de paso · Zona escolar · Peligroso de noche · Desde hace días". Tap añade al texto o a un array `tags`.
  - Botón mic (fuera de scope, dejar inactivo con icono).
  - Botones inferiores: `[← back]` + `[Continuar]`.
- [ ] Animación de transición entre pasos (`react-native-reanimated`): slide horizontal 200ms.

## Criterios de aceptación
- No se puede avanzar sin seleccionar categoría (paso 1) ni severidad (paso 2).
- El contador refleja la longitud real del texto.
- Botón "back" del paso 2 vuelve al paso 1 con la categoría seleccionada conservada.
- Cerrar (×) muestra confirmación si hay datos ingresados.
