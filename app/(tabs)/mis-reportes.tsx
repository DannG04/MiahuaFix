import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Ellipse, Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import { useAnonId } from '@/src/hooks/useAnonId';
import { useMisReportes } from '@/src/hooks/useMisReportes';
import { ReportRow } from '@/src/components/primitives';
import { parseLocation } from '@/src/lib/parseLocation';
import type { Reporte } from '@/src/hooks/useMisReportes';
import type { Report, Category, Severity } from '@/src/types/report';

// ─── types ─────────────────────────────────────────────────────────

type Filter = 'todos' | 'abiertos' | 'resueltos';

// ─── helpers ───────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

function toReport(r: Reporte): Report {
  const coords = parseLocation(r.ubicacion ?? null);
  return {
    id:       r.id,
    type:     r.tipo     as Category,
    title:    r.titulo,
    location: coords
      ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
      : 'Sin ubicación',
    time:     timeAgo(r.creado_en),
    severity: r.severidad as Severity,
    votes:    r.votos,
    status:   r.estado,
  };
}

// ─── screen ────────────────────────────────────────────────────────

export default function ScreenMine() {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();
  const router     = useRouter();
  const { id: anonId } = useAnonId();

  const [activeFilter, setActiveFilter] = useState<Filter>('todos');
  const { data, loading } = useMisReportes(anonId);

  // ── impacto este mes ──
  const { enviados, resueltosEsteMes, confirmaron } = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const mes = data.filter(r => new Date(r.creado_en) >= start);
    return {
      enviados:        mes.length,
      resueltosEsteMes: mes.filter(r => r.estado === 'resolved').length,
      confirmaron:     mes.reduce((s, r) => s + r.votos, 0),
    };
  }, [data]);

  // ── conteos para chips ──
  const abiertosN  = data.filter(r => r.estado !== 'resolved').length;
  const resueltosN = data.filter(r => r.estado === 'resolved').length;

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: 'todos',     label: 'Todos',     count: data.length  },
    { key: 'abiertos',  label: 'Abiertos',  count: abiertosN   },
    { key: 'resueltos', label: 'Resueltos', count: resueltosN  },
  ];

  // ── lista filtrada ──
  const filtered = useMemo(() => {
    if (activeFilter === 'abiertos')  return data.filter(r => r.estado !== 'resolved');
    if (activeFilter === 'resueltos') return data.filter(r => r.estado === 'resolved');
    return data;
  }, [data, activeFilter]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.ivory }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <Text style={[styles.mono, { color: colors.ink500 }]}>Tu historial</Text>
      <Text style={[styles.headline, { color: colors.ink900 }]}>Mis reportes</Text>

      {/* ── Tarjeta de impacto ── */}
      <View style={[styles.impactCard, { backgroundColor: colors.navy900 }]}>
        {/* blob decorativo */}
        <View style={styles.blobWrap} pointerEvents="none">
          <Svg width={160} height={160}>
            <Defs>
              <RadialGradient id="blob" cx="50%" cy="50%" r="50%">
                <Stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.28" />
                <Stop offset="100%" stopColor="#f59e0b" stopOpacity="0"    />
              </RadialGradient>
            </Defs>
            <Ellipse cx="80" cy="80" rx="80" ry="80" fill="url(#blob)" />
          </Svg>
        </View>

        <Text style={styles.impactLabel}>Tu impacto este mes</Text>

        <View style={styles.statsRow}>
          {loading ? (
            <ActivityIndicator color="#f59e0b" />
          ) : (
            <>
              <View style={styles.stat}>
                <Text style={[styles.statN, { color: colors.amber500 }]}>
                  {enviados}
                </Text>
                <Text style={styles.statSub}>Reportes{'\n'}enviados</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.stat}>
                <Text style={styles.statNWhite}>{resueltosEsteMes}</Text>
                <Text style={styles.statSub}>Resueltos</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.stat}>
                <Text style={styles.statNWhite}>{confirmaron}</Text>
                <Text style={styles.statSub}>Confirmaron</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ── Filtros chip ── */}
      <View style={styles.chips}>
        {chips.map(({ key, label, count }) => {
          const active = key === activeFilter;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveFilter(key)}
              activeOpacity={0.75}
              style={[
                styles.chip,
                active
                  ? { backgroundColor: colors.navy900 }
                  : { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
              ]}
            >
              <Text style={[
                styles.chipText,
                { color: active ? colors.amber500 : colors.ink500 },
              ]}>
                {label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Lista ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.amber500} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState colors={colors} neverReported={data.length === 0} />
      ) : (
        <View style={styles.list}>
          {filtered.map(r => (
            <ReportRow
              key={r.id}
              report={toReport(r)}
              onPress={() => router.push(`/reporte/${r.id}` as any)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// ─── empty state ───────────────────────────────────────────────────

function EmptyState({ colors, neverReported }: { colors: any; neverReported: boolean }) {
  return (
    <View style={styles.emptyWrap}>
      <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <Rect x="12" y="8" width="48" height="56" rx="8"
          fill={colors.paper} stroke={colors.line} strokeWidth="1.5" />
        <Path d="M24 24h24M24 34h20M24 44h14"
          stroke={colors.ink300} strokeWidth="2" strokeLinecap="round" />
        <Circle cx="54" cy="54" r="12" fill={colors.ivory} stroke={colors.line} strokeWidth="1.5" />
        <Path d="M50 54h8M54 50v8"
          stroke={colors.ink400} strokeWidth="2" strokeLinecap="round" />
      </Svg>

      <Text style={[styles.emptyTitle, { color: colors.ink900 }]}>
        {neverReported
          ? 'Aún no has reportado nada'
          : 'Sin reportes en esta categoría'}
      </Text>
      {neverReported && (
        <Text style={[styles.emptySub, { color: colors.ink500 }]}>
          Toca el + para empezar
        </Text>
      )}
    </View>
  );
}

// ─── styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },

  mono: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headline: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -0.3,
    marginBottom: 18,
  },

  // Impact card
  impactCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  blobWrap: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
  impactLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  stat: {
    gap: 4,
  },
  statN: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 44,
    lineHeight: 46,
  },
  statNWhite: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 44,
    lineHeight: 46,
    color: '#faf7f2',
  },
  statSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 4,
  },

  // Chips
  chips: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },

  // List
  list: {
    gap: 10,
  },

  // Centered loader
  centered: {
    paddingTop: 48,
    alignItems: 'center',
  },

  // Empty state
  emptyWrap: {
    paddingTop: 48,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});
