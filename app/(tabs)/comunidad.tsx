import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/theme';
import { useReportes } from '@/src/hooks/useReportes';
import { useEstadisticas } from '@/src/hooks/useEstadisticas';
import { ReportRow } from '@/src/components/primitives';
import { parseLocation } from '@/src/lib/parseLocation';
import type { Reporte } from '@/src/hooks/useReportes';
import type { Report, Category, Severity } from '@/src/types/report';

// ─── types ─────────────────────────────────────────────────────────

type Tab = 'todo' | 'cerca' | 'colonia' | 'tendencias';

type FeedSection = {
  key:      string;
  title:    string;
  subtitle: string;
  data:     Reporte[];
};

// ─── constants ─────────────────────────────────────────────────────

const TABS: { key: Tab; label: string }[] = [
  { key: 'todo',       label: 'Todo' },
  { key: 'cerca',      label: 'Cerca' },
  { key: 'colonia',    label: 'Mi colonia' },
  { key: 'tendencias', label: 'Tendencias' },
];

const ACTIVE_ESTADOS = new Set(['pending', 'confirmed', 'assigned', 'pendiente']);

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
    type:     r.tipo as Category,
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

export default function ScreenFeed() {
  const { colors }  = useTheme();
  const insets      = useSafeAreaInsets();
  const router      = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('todo');

  const { data: allReportes, loading } = useReportes();
  const { data: stats }                = useEstadisticas();

  const sections = useMemo<FeedSection[]>(() => {
    const active   = allReportes.filter(r => ACTIVE_ESTADOS.has(r.estado));
    const resolved = allReportes.filter(r => r.estado === 'resolved');
    return [
      {
        key:      'activos',
        title:    'Activos ahora',
        subtitle: `${active.length} reportes en curso`,
        data:     active,
      },
      {
        key:      'resueltos',
        title:    'Resueltos esta semana',
        subtitle: `${resolved.length} problemas atendidos`,
        data:     resolved,
      },
    ];
  }, [allReportes]);

  return (
    <View style={[styles.container, { backgroundColor: colors.ivory }]}>

      {/* ── Sticky header ── */}
      <View style={[
        styles.stickyHeader,
        { paddingTop: insets.top + 14, backgroundColor: colors.ivory },
      ]}>
        <Text style={[styles.mono, { color: colors.ink500 }]}>Comunidad</Text>

        <Text style={[styles.headline, { color: colors.ink900 }]}>
          {'Lo que '}
          <Text style={[styles.italic, { color: colors.amber500 }]}>pasa</Text>
          {' en tu ciudad'}
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {([
            { n: String(stats.activos),   label: 'activos',   color: colors.amber500  },
            { n: String(stats.resueltos),  label: 'resueltos', color: colors.green500  },
            { n: '—',                      label: 'promedio',  color: '#2563eb'        },
          ] as const).map((s) => (
            <View
              key={s.label}
              style={[styles.statCard, { backgroundColor: colors.paper, borderColor: colors.line }]}
              accessibilityLabel={`${s.n} ${s.label}`}
              accessible
            >
              <Text style={[styles.statN, { color: s.color }]}>{s.n}</Text>
              <Text style={[styles.statLabel, { color: colors.ink500 }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={[styles.tabsBar, { borderBottomColor: colors.line }]}>
          {TABS.map(({ key, label }) => {
            const isActive = key === activeTab;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveTab(key)}
                style={[
                  styles.tab,
                  { borderBottomColor: isActive ? colors.amber500 : 'transparent' },
                ]}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[
                  styles.tabText,
                  { color: isActive ? colors.ink900 : colors.ink500 },
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Body ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.amber500} size="large" />
        </View>
      ) : (
        <SectionList<Reporte, FeedSection>
          sections={sections}
          keyExtractor={r => r.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.ink900 }]}>
                  {section.title}
                </Text>
                <Text style={[styles.sectionSub, { color: colors.ink500 }]}>
                  {section.subtitle}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Ver todos los reportes de ${section.title}`}
                hitSlop={8}
              >
                <Text style={[styles.verTodo, { color: colors.amber600 }]}>Ver todo</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <ReportRow
              report={toReport(item)}
              onPress={() => router.push(`/reporte/${item.id}` as any)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          SectionSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      )}
    </View>
  );
}

// ─── styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  stickyHeader: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    zIndex: 10,
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
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  italic: {
    fontFamily: 'InstrumentSerif_400Regular_Italic',
    fontStyle: 'italic',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statN: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 22,
    lineHeight: 26,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },

  // Tabs
  tabsBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    gap: 0,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    marginRight: 18,
    borderBottomWidth: 2,
    marginBottom: -1,
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  sectionSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  verTodo: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
