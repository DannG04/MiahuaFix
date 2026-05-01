# 03 — Cargar tipografías custom

**Fase:** 0 · Cimientos
**Dependencias:** —
**Estimación:** 30 min

## Contexto
El prototipo combina tres familias:
- **Inter** — texto base
- **Instrument Serif** — titulares (`fontFamily: 'Instrument Serif, serif'`)
- **JetBrains Mono** — etiquetas pequeñas en mayúsculas

`expo-font` ya está instalado.

## Tareas
- [ ] Descargar los TTF/OTF a `assets/fonts/` (Google Fonts: Inter, Instrument Serif, JetBrains Mono — pesos: Inter 400/500/600/700, Instrument Serif 400 + 400-italic, JetBrains Mono 400/500/600).
- [ ] En `app/_layout.tsx` cargar las fuentes con `useFonts({...})` y mostrar `<SplashScreen>` o `null` mientras cargan.
- [ ] En `src/theme/typography.ts` exponer presets:
  ```ts
  export const typography = {
    serifLg: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 34, lineHeight: 36 },
    serifMd: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 26, lineHeight: 28 },
    body:    { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
    label:   { fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
    // ...
  }
  ```
- [ ] Documentar en un comentario del archivo el mapeo nombre-archivo ↔ nombre-cargado.

## Criterios de aceptación
- La app no parpadea con fuente del sistema antes de mostrar la custom.
- `<Text style={typography.serifLg}>Hola</Text>` renderiza con Instrument Serif.
- Funciona en iOS, Android y web (los TTF de Google Fonts son cross-platform).
