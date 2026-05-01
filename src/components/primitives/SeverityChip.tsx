import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';
import type { Severity } from '@/src/types/report';

type Props = { level: Severity; size?: 'sm' | 'lg' };

export function SeverityChip({ level, size = 'sm' }: Props) {
  const { colors } = useTheme();

  const cfg = {
    low:    { bg: colors.green100, color: colors.green600, dot: colors.green500, label: 'Bajo' },
    medium: { bg: colors.amberBg,  color: colors.amber600, dot: colors.amber500, label: 'Medio' },
    high:   { bg: colors.red100,   color: colors.red600,   dot: colors.red500,   label: 'Alto' },
  }[level];

  const isLg = size === 'lg';

  return (
    <View style={[
      styles.pill,
      { backgroundColor: cfg.bg, paddingVertical: isLg ? 6 : 3, paddingHorizontal: isLg ? 12 : 9 },
    ]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.color, fontSize: isLg ? 13 : 11 }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 99,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.1,
  },
});
