import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';
import type { Status } from '@/src/types/report';

// Accept DB values (English) and legacy Spanish values stored as text default.
type Props = { status: Status | string };

const STATUS_COLORS: Record<string, { color: string | null; bg: string | null; label: string }> = {
  pending:    { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', label: 'Recibido' },
  pendiente:  { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', label: 'Recibido' },
  confirmed:  { color: null,      bg: null,                     label: 'Confirmado' },
  confirmado: { color: null,      bg: null,                     label: 'Confirmado' },
  assigned:   { color: '#2563eb', bg: 'rgba(37,99,235,0.12)',   label: 'En camino' },
  asignado:   { color: '#2563eb', bg: 'rgba(37,99,235,0.12)',   label: 'En camino' },
  resolved:   { color: null,      bg: null,                     label: 'Resuelto' },
  resuelto:   { color: null,      bg: null,                     label: 'Resuelto' },
};

export function StatusPill({ status }: Props) {
  const { colors } = useTheme();

  const base = STATUS_COLORS[status] ?? STATUS_COLORS['pending'];
  const isConfirmed = status === 'confirmed' || status === 'confirmado';
  const color = base.color ?? (isConfirmed ? colors.amber600 : colors.green600);
  const bg    = base.bg    ?? (isConfirmed ? colors.amberBg  : colors.green100);

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color }]}>{base.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
