# 20 — Modo oscuro

**Fase:** 4 · Pulido
**Dependencias:** 02, 19
**Estimación:** 2 h

## Contexto
El prototipo tiene una clase `theme-dark` con tokens invertidos (CSS, líneas 35–50). Queremos:
- Por defecto seguir el tema del sistema (`useColorScheme`).
- Permitir override manual desde Perfil (issue 19) que se persista.

## Tareas
- [ ] Crear `src/theme/ThemeProvider.tsx`:
  - Estado: `mode: 'system' | 'light' | 'dark'`.
  - Persiste `mode` en `expo-secure-store` (clave `miahua.theme`).
  - Resuelve `effective: 'light' | 'dark'` combinando `mode` con `useColorScheme()`.
- [ ] Envolver `app/_layout.tsx` con `<ThemeProvider>`.
- [ ] Refactor `useTheme()` para devolver `{ tokens, mode, setMode, effective }`.
- [ ] En `app.json` setear `userInterfaceStyle: 'automatic'` (ya está).
- [ ] Configurar la status bar dinámica: `<StatusBar style={effective === 'dark' ? 'light' : 'dark'} />`.
- [ ] Auditar todas las pantallas: que ningún color esté hardcodeado fuera de `tokens`.

## Criterios de aceptación
- Cambiar el sistema (Configuración → Aspecto) cambia la app si `mode='system'`.
- Forzar dark desde Perfil mantiene oscuro aunque el sistema esté light, y persiste tras reiniciar.
- Status bar contrasta correctamente en cada modo.
- Los mapas y `<BlurView>` se ven OK en ambos modos (BlurView debe usar `tint` correcto).
