import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/src/theme';

const HAPTICS_ENABLED = true;

// ─── Tab icons ────────────────────────────────────────────────────────────────

function IconMapa({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M9 4v14M15 6v14" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

function IconComunidad({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="9"  cy="8"  r="3"   stroke={color} strokeWidth={1.7} />
      <Circle cx="17" cy="10" r="2.5" stroke={color} strokeWidth={1.7} />
      <Path d="M3 19c0-3 3-5 6-5s6 2 6 5"      stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M15 18c0-2 2-4 4-4s4 1.5 4 3.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function IconReportar({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

function IconMisReportes({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth={1.7} />
      <Path d="M8 9h8M8 13h8M8 17h5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function IconPerfil({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.7} />
      <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

const TAB_ICONS: Record<string, (color: string) => React.ReactElement> = {
  mapa:           (c) => <IconMapa         color={c} />,
  comunidad:      (c) => <IconComunidad    color={c} />,
  nuevo:          (c) => <IconReportar     color={c} />,
  'mis-reportes': (c) => <IconMisReportes  color={c} />,
  perfil:         (c) => <IconPerfil       color={c} />,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Solid background so icons are always readable (fallback when blur is weak/transparent).
  const bgColor = isDark
    ? 'rgba(14, 20, 36, 0.95)'
    : 'rgba(250, 247, 242, 0.95)';

  // Active icon/text color — must contrast against bgColor in both themes.
  // Light: navy900 (#0a1530) on ivory → high contrast ✓
  // Dark:  amber500 (#f59e0b) on dark navy → high contrast ✓
  const activeColor   = isDark ? colors.amber500 : colors.navy900;
  const inactiveColor = isDark ? colors.ink400   : colors.ink500;

  // FAB icon must contrast against amber500 background in both themes.
  // navy900 (#0a1530) never changes between themes — always dark.
  const fabIconColor = colors.navy900;

  return (
    <BlurView
      intensity={Platform.OS === 'android' ? 0 : 80}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.blur, { borderTopColor: colors.line, backgroundColor: bgColor }]}
    >
      <View style={[styles.row, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {state.routes.map((route, index) => {
          const isFab     = route.name === 'nuevo';
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;

          const iconColor = isFocused ? activeColor : inactiveColor;

          const handlePress = () => {
            if (isFab) {
              if (HAPTICS_ENABLED) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/nuevo-reporte');
              return;
            }
            if (HAPTICS_ENABLED) Haptics.selectionAsync();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (isFab) {
            return (
              <View key={route.key} style={styles.fabContainer}>
                <View style={styles.fabHalo}>
                  <Pressable
                    onPress={handlePress}
                    accessibilityRole="button"
                    accessibilityLabel="Crear nuevo reporte"
                    accessibilityHint="Abre el formulario de reporte"
                    style={({ pressed }) => [
                      styles.fab,
                      { backgroundColor: colors.amber500, opacity: pressed ? 0.88 : 1 },
                    ]}
                  >
                    {TAB_ICONS['nuevo'](fabIconColor)}
                  </Pressable>
                </View>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              style={({ pressed }) => [styles.tabItem, { opacity: pressed ? 0.7 : 1 }]}
            >
              {TAB_ICONS[route.name]?.(iconColor)}
              <Text style={[styles.tabLabel, { color: iconColor }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  blur: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 4,
  },
  fabHalo: {
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginTop: -18,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
