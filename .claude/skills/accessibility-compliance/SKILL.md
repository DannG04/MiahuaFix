---
name: accessibility-compliance
description: Implement WCAG 2.2 compliant interfaces in React Native + Expo. Use when auditing accessibility, adding accessibilityLabel/Role/State props, supporting TalkBack/VoiceOver, checking contrast ratios, or building for users with visual or motor disabilities.
---

# Accessibility Compliance

Master accessibility implementation to create inclusive experiences that work for everyone, including users with disabilities.

## When to Use This Skill

- Implementar cumplimiento WCAG 2.2 Level AA o AAA en React Native
- Añadir `accessibilityLabel`, `accessibilityRole`, `accessibilityState` a componentes
- Soporte para TalkBack (Android) y VoiceOver (iOS)
- Verificar ratios de contraste de colores
- Construir formularios accesibles con validación anunciada al lector de pantalla
- Soporte de movimiento reducido (`isReduceMotionEnabled`) y tema oscuro
- Auditar pantallas existentes por violaciones de accesibilidad

## Core Capabilities

### 1. WCAG 2.2 Guidelines

- Perceivable: Content must be presentable in different ways
- Operable: Interface must be navigable with keyboard and assistive tech
- Understandable: Content and operation must be clear
- Robust: Content must work with current and future assistive technologies

### 2. ARIA Patterns

- Roles: Define element purpose (button, dialog, navigation)
- States: Indicate current condition (expanded, selected, disabled)
- Properties: Describe relationships and additional info (labelledby, describedby)
- Live regions: Announce dynamic content changes

### 3. Keyboard Navigation

- Focus order and tab sequence
- Focus indicators and visible focus states
- Keyboard shortcuts and hotkeys
- Focus trapping for modals and dialogs

### 4. Screen Reader Support

- Semantic HTML structure
- Alternative text for images
- Proper heading hierarchy
- Skip links and landmarks

### 5. Mobile Accessibility

- Touch target sizing (44x44dp minimum)
- VoiceOver and TalkBack compatibility
- Gesture alternatives
- Dynamic Type support

## Quick Reference

### WCAG 2.2 Success Criteria Checklist

| Level | Criterion | Description                                          |
| ----- | --------- | ---------------------------------------------------- |
| A     | 1.1.1     | Non-text content has text alternatives               |
| A     | 1.3.1     | Info and relationships programmatically determinable |
| A     | 2.1.1     | All functionality keyboard accessible                |
| A     | 2.4.1     | Skip to main content mechanism                       |
| AA    | 1.4.3     | Contrast ratio 4.5:1 (text), 3:1 (large text)        |
| AA    | 1.4.11    | Non-text contrast 3:1                                |
| AA    | 2.4.7     | Focus visible                                        |
| AA    | 2.5.8     | Target size minimum 24x24px (NEW in 2.2)             |
| AAA   | 1.4.6     | Enhanced contrast 7:1                                |
| AAA   | 2.5.5     | Target size minimum 44x44px                          |

## Key Patterns

### Pattern 1: Accessible Pressable (botón)

```tsx
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  hint?: string; // descripción extra para lectores de pantalla
}

function AccessibleButton({ label, onPress, isLoading = false, disabled = false, hint }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        (disabled || isLoading) && styles.disabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator accessibilityLabel="Cargando" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
  label: { fontSize: 16 },
});
```

### Pattern 2: Accessible Modal

```tsx
import { AccessibilityInfo, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function AccessibleDialog({ visible, onClose, title, children }: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}       // botón atrás de Android
      accessibilityViewIsModal        // oculta el contenido de fondo a VoiceOver/TalkBack
    >
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Cerrar diálogo"
        accessibilityRole="button"
      />

      <View style={styles.dialog} accessibilityLiveRegion="polite">
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>

        {children}

        <Pressable
          onPress={onClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          hitSlop={12}
        >
          <Text>✕</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  dialog: { margin: 24, padding: 20, borderRadius: 12, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  closeButton: { position: 'absolute', top: 12, right: 12, padding: 8 },
});
```

### Pattern 3: Accessible TextInput con validación

```tsx
import { Text, TextInput, View, StyleSheet } from 'react-native';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

function AccessibleField({ label, value, onChangeText, error, hint, required }: FieldProps) {
  const fullLabel = required ? `${label}, requerido` : label;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label} accessibilityElementsHidden>
        {label}{required && ' *'}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={fullLabel}
        accessibilityHint={error ?? hint}
        accessibilityInvalidated={!!error}  // RN 0.74+
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#767676"      // contraste mínimo WCAG AA
      />
      {error && (
        <Text style={styles.error} accessibilityLiveRegion="assertive">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  input: { height: 44, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12 },
  inputError: { borderColor: '#d32f2f' },
  error: { marginTop: 4, fontSize: 13, color: '#d32f2f' },
});
```

### Pattern 4: Anuncios dinámicos (live regions)

```tsx
import { AccessibilityInfo } from 'react-native';

// Anunciar contenido dinámico a TalkBack/VoiceOver sin mover el foco
function useAnnounce() {
  const announce = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };
  return announce;
}

// Uso en un listado de resultados
function ReportList({ reports, isLoading }: { reports: Report[]; isLoading: boolean }) {
  const announce = useAnnounce();

  useEffect(() => {
    if (!isLoading) {
      announce(
        reports.length > 0
          ? `${reports.length} reportes encontrados`
          : 'No se encontraron reportes',
      );
    }
  }, [isLoading, reports.length]);

  return <FlatList data={reports} renderItem={({ item }) => <ReportCard report={item} />} />;
}
```

### Pattern 5: Detectar lector de pantalla y movimiento reducido

```tsx
import { AccessibilityInfo, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

function useA11y() {
  const [isScreenReaderEnabled, setScreenReader] = useState(false);
  const [isReduceMotionEnabled, setReduceMotion] = useState(false);
  const colorScheme = useColorScheme(); // 'light' | 'dark'

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    const srSub = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReader);
    const rmSub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => { srSub.remove(); rmSub.remove(); };
  }, []);

  return { isScreenReaderEnabled, isReduceMotionEnabled, colorScheme };
}

// Uso: omitir animaciones si el usuario activó "Reducir movimiento"
function AnimatedCard({ children }) {
  const { isReduceMotionEnabled } = useA11y();
  const duration = isReduceMotionEnabled ? 0 : 300;
  // pasar duration a tu librería de animación
}
```

## Color Contrast Requirements

```typescript
// Contrast ratio utilities
function getContrastRatio(foreground: string, background: string): number {
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG requirements
const CONTRAST_REQUIREMENTS = {
  // Normal text (<18pt or <14pt bold)
  normalText: {
    AA: 4.5,
    AAA: 7,
  },
  // Large text (>=18pt or >=14pt bold)
  largeText: {
    AA: 3,
    AAA: 4.5,
  },
  // UI components and graphics
  uiComponents: {
    AA: 3,
  },
};
```

## Best Practices

1. **Use Semantic HTML**: Prefer native elements over ARIA when possible
2. **Test with Real Users**: Include people with disabilities in user testing
3. **Keyboard First**: Design interactions to work without a mouse
4. **Don't Disable Focus Styles**: Style them, don't remove them
5. **Provide Text Alternatives**: All non-text content needs descriptions
6. **Support Zoom**: Content should work at 200% zoom
7. **Announce Changes**: Use live regions for dynamic content
8. **Respect Preferences**: Honor prefers-reduced-motion and prefers-contrast

## Common Issues

- **Missing alt text**: Images without descriptions
- **Poor color contrast**: Text hard to read against background
- **Keyboard traps**: Focus stuck in component
- **Missing labels**: Form inputs without associated labels
- **Auto-playing media**: Content that plays without user initiation
- **Inaccessible custom controls**: Recreating native functionality poorly
- **Missing skip links**: No way to bypass repetitive content
- **Focus order issues**: Tab order doesn't match visual order

## Testing Tools

- **TalkBack (Android)**: Ajustes → Accesibilidad → TalkBack. Probar navegación por gestos y anuncios.
- **VoiceOver (iOS)**: Ajustes → Accesibilidad → VoiceOver. Probar en simulador con Xcode.
- **Expo Go**: `AccessibilityInfo.isScreenReaderEnabled()` para validar detección en tiempo real.
- **Contraste**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — aplica los mismos ratios WCAG a colores de RN.
- **React Native a11y inspector**: en el menú de dev (`⌘D` / agitar) → "Inspect Accessibility".
