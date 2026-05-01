# 06 — Custom TabBar con glass y FAB central

**Fase:** 1 · Navegación
**Dependencias:** 01, 02, 04, 05
**Estimación:** 2 h

## Contexto
El `TabBar` del prototipo (`primitives.jsx` líneas 124–199) tiene 5 items, el central ("Reportar") es un FAB amber elevado, y el contenedor usa `backdropFilter: blur(20px) saturate(180%)`.

## Tareas
- [ ] Crear `src/components/CustomTabBar.tsx` que reciba las props de `BottomTabBar` de `@react-navigation/bottom-tabs` (lo mismo que `expo-router` pasa a `tabBar`).
- [ ] Layout: `<BlurView intensity={80} tint={dark ? 'dark' : 'light'}>` con borde superior y `paddingBottom` igual al `useSafeAreaInsets().bottom`.
- [ ] 4 items normales + 1 botón central FAB:
  - 54×54, `backgroundColor: amber500`, `borderRadius: 20`
  - `boxShadow` simulado con `shadowColor`, `shadowOpacity`, `elevation`
  - Halo blanco: `borderColor: rgba(255,255,255,0.6)`, `borderWidth: 4` (o un wrapper).
- [ ] Iconos SVG portados del prototipo:
  - mapa: silueta plegada (líneas 127–131 del primitives)
  - comunidad: dos personas
  - reportar: `+` grande
  - mis-reportes: rectángulo con renglones
  - perfil: persona con base
- [ ] Item activo: navy en light / amber en dark; inactivo: ink400.
- [ ] `accessibilityRole="tab"` y `accessibilityState={{ selected }}`.
- [ ] Trigger `Haptics.selectionAsync()` en cada cambio de tab (issue 22 puede activarlo después; dejarlo cableado con un toggle).

## Criterios de aceptación
- Los 5 tabs cambian al tocarlos.
- El FAB del medio queda visualmente elevado por encima del bar (no recortado).
- El blur se ve real en iOS y Android (en Android puede ser menos vidrioso, está OK).
- En iPhone con notch hay padding inferior correcto (no se pisa con el home indicator).
