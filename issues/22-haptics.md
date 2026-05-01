# 22 — Feedback háptico

**Fase:** 4 · Pulido
**Dependencias:** 06, 13, 14, 15
**Estimación:** 30 min

## Contexto
`expo-haptics` ya está instalado. Pequeñas vibraciones suben la sensación de calidad sin estorbar.

## Tareas
- [ ] Crear `src/lib/haptics.ts` con wrappers que respeten un toggle global (Perfil → Avisos):
  ```ts
  export const haptic = {
    selection: () => Haptics.selectionAsync(),
    light:     () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium:    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    success:   () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warning:   () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    error:     () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  };
  ```
- [ ] Cablear:
  - **Tab change** → `selection`.
  - **Selección de categoría / severidad** (Report Flow pasos 1, 2) → `selection`.
  - **Avanzar de paso** → `light`.
  - **Confirmar reporte** (botón pulgar en detalle) → `medium`.
  - **Envío exitoso** (ReportSuccess) → `success`.
  - **Error de envío** → `error`.
  - **Toggle (modo oscuro, switches del perfil)** → `selection`.

## Criterios de aceptación
- En iOS se sienten las vibraciones; en Android funcionan donde el OEM las expone.
- Toggle "Hápticos" en Perfil silencia todas las llamadas globalmente.
- Ningún haptic se dispara en error de red silencioso (solo en errores que el usuario provocó).
