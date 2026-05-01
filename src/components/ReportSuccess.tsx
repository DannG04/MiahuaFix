import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AnonBadge } from '@/src/components/primitives';
import { useTheme } from '@/src/theme';

type Props = { reporteId: string };

function formatId(uuid: string) {
  return '#R-' + uuid.replace(/-/g, '').slice(-4).toUpperCase();
}

export function ReportSuccess({ reporteId }: Props) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.ivory }]}>
      <View style={styles.center}>
        {/* Check icon */}
        <View style={styles.iconOuter}>
          <View style={[styles.iconInner, { backgroundColor: colors.navy900 }]}>
            <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
              <Path
                d="m5 12 5 5 10-11"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.ink900 }]}>Gracias. Listo.</Text>
        <Text style={[styles.body, { color: colors.ink500 }]}>
          Tu reporte llegó al equipo de mantenimiento. Recibirás avisos si cambia de estado.
        </Text>

        {/* ID pill */}
        <View style={[styles.idPill, { backgroundColor: colors.ivory, borderColor: colors.line }]}>
          <Text style={[styles.idLabel, { color: colors.ink500 }]}>ID</Text>
          <Text style={[styles.idText, { color: colors.ink900 }]}>{formatId(reporteId)}</Text>
          <Text style={[styles.dot, { color: colors.ink400 }]}>·</Text>
          <AnonBadge compact />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/mapa')}
          activeOpacity={0.85}
          style={[styles.primaryBtn, { backgroundColor: colors.navy900 }]}
        >
          <Text style={[styles.primaryBtnText, { color: colors.amber500 }]}>Volver al mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace(`/reporte/${reporteId}` as any)}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryLink, { color: colors.ink500 }]}>Ver mi reporte →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 80,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOuter: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(245,158,11,0.1)',
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 34,
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
  },
  idPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  idLabel: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  idText: {
    fontFamily: 'JetBrainsMono_600SemiBold',
    fontSize: 13,
  },
  dot: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  buttons: {
    gap: 12,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  secondaryLink: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
});
