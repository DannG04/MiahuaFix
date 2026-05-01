# 19 — Perfil

**Fase:** 3 · Pantallas
**Dependencias:** 04, 09
**Estimación:** 2 h

## Contexto
Referencia: `screens-mobile-3.jsx` `ScreenProfile` (líneas 370–466).

Perfil anónimo con secciones tipo lista de iOS y toggles. No hay datos personales — todo es preferencias y privacidad.

## Tareas
- [ ] Crear `app/(tabs)/perfil.tsx`.
- [ ] **Tarjeta superior**: avatar gradient navy con escudo amber + serif "Usuario anónimo" + ID corto monospace + AnonBadge compact.
- [ ] Párrafo explicativo: "No tenemos tu nombre, correo ni matrícula…".
- [ ] Componentes reutilizables locales:
  - `<Section title="..." />` — header label mono + card redondeada.
  - `<Row icon label detail toggle on onPress />` — fila con icono cuadrado, label, valor a la derecha o switch.
- [ ] Secciones:
  1. **Apariencia**: toggle Modo oscuro (vinculado a la issue 20).
  2. **Avisos**: toggle Notificaciones push, Alertas de mi colonia (con valor "Col. Centro"), Resumen semanal.
  3. **Privacidad**: toggle Remover metadatos de fotos (default ON), "Borrar historial" (detail "Cada 90 días"), "Regenerar mi ID anónimo" (llama `regenerateAnonId()` con confirmación).
  4. **Ayuda**: Preguntas frecuentes, Política de privacidad.
- [ ] El switch debe ser custom (no `<Switch>` nativo) para que case con el prototipo: pista amber cuando ON, pista gris cuando OFF, knob blanco. Reutilizable.

## Criterios de aceptación
- Toggle de modo oscuro cambia el tema de toda la app inmediatamente.
- "Regenerar mi ID anónimo" pide confirmación y al aceptar genera nuevo UUID; al volver a `Mis reportes` la lista está vacía.
- Las preferencias persisten entre cierres (SecureStore o `AsyncStorage`).
