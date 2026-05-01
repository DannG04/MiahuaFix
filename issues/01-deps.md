# 01 — Instalar dependencias faltantes

**Fase:** 0 · Cimientos
**Dependencias:** ninguna
**Estimación:** 15 min

## Contexto
El prototipo en `Proyecto IHC/` usa SVG inline y efectos `backdropFilter` (glass). En React Native estos requieren librerías nativas que aún no están en `package.json`.

## Tareas
- [ ] Instalar `react-native-svg` (para portar `CategoryIcon` y demás SVGs del prototipo).
- [ ] Instalar `expo-blur` (para `TabBar`, headers de pantallas y elementos glass del prototipo iOS-like).
- [ ] Instalar `expo-secure-store` (se usará en la issue 09 para persistir el `anon_id`).
- [ ] Verificar que `expo-haptics` ya está en `package.json` (sí está).

## Comando
```bash
npx expo install react-native-svg expo-blur expo-secure-store
```

## Criterios de aceptación
- `npm run start` arranca sin errores.
- `import Svg from 'react-native-svg'` y `import { BlurView } from 'expo-blur'` no rompen el bundler.
- Las versiones quedan alineadas con el SDK de Expo (~54).
