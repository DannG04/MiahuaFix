import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import { useAnonId } from '@/src/hooks/useAnonId';
import { useNotificaciones } from '@/src/hooks/useNotificaciones';
import type { Notificacion } from '@/src/hooks/useNotificaciones';

// ─── icon colors by type ────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  status:   '#2563eb',
  vote:     '#f59e0b',
  resolved: '#22c55e',
  info:     '#6b7280',
};

// ─── helpers ────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `hace ${hrs}h`;
  if (hrs < 48)  return 'ayer';
  return `hace ${Math.floor(hrs / 24)}d`;
}

// ─── notification icon ──────────────────────────────────────────────

function NotifIcon({ tipo, color }: { tipo: string; color: string }) {
  if (tipo === 'status') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.8" />
        <Path d="m12 8 3 4-3 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    );
  }
  if (tipo === 'vote') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M7 10v10H3V10h4ZM7 10l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1 6a3 3 0 0 1-3 2H7"
          stroke={color} strokeWidth="1.8" strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (tipo === 'resolved') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path d="m5 12 5 5 10-11" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  // info (default)
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Path d="M12 8v.01M12 11v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// ─── screen ─────────────────────────────────────────────────────────

export default function ScreenNotifications() {
  const { colors } = useTheme();
  const insets     = useSafeAreaInsets();
  const router     = useRouter();
  const { id: anonId } = useAnonId();

  const {
    data, loading, refetch, marcarLeida, marcarTodasLeidas,
  } = useNotificaciones(anonId);

  async function handlePress(n: Notificacion) {
    if (!n.leida) await marcarLeida(n.id);
    if (n.reporte_id) router.push(`/reporte/${n.reporte_id}` as any);
  }

  // ── render item ──
  function renderItem({ item, index }: { item: Notificacion; index: number }) {
    const color = TYPE_COLOR[item.tipo] ?? TYPE_COLOR.info;
    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={[item.title, item.description, timeAgo(item.created_at)].filter(Boolean).join('. ')}
        accessibilityState={{ checked: item.leida }}
        style={[
          styles.item,
          index > 0 && { borderTopWidth: 1, borderTopColor: colors.line },
        ]}
      >
        {/* Icon badge */}
        <View style={[styles.iconBadge, { backgroundColor: color + '18' }]}>
          <NotifIcon tipo={item.tipo} color={color} />
          {!item.leida && (
            <View style={[styles.unreadDot, { borderColor: colors.ivory }]} />
          )}
        </View>

        {/* Content */}
        <View style={styles.itemContent}>
          <View style={styles.itemTop}>
            <Text
              style={[
                styles.itemTitle,
                { color: item.leida ? colors.ink500 : colors.ink900 },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text style={[styles.itemTime, { color: colors.ink400 }]}>
              {timeAgo(item.created_at)}
            </Text>
          </View>
          {item.description ? (
            <Text style={[styles.itemDesc, { color: colors.ink500 }]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  // ── empty state ──
  function ListEmpty() {
    if (loading) return null;
    return (
      <View style={styles.emptyWrap}>
        <Svg width={56} height={56} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke={colors.ink300} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </Svg>
        <Text style={[styles.emptyTitle, { color: colors.ink900 }]}>Sin avisos por ahora</Text>
        <Text style={[styles.emptySub, { color: colors.ink500 }]}>
          Te avisaremos cuando cambien tus reportes
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.ivory }]}>

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.ivory }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.paper, borderColor: colors.line }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5m6-6-6 6 6 6" stroke={colors.ink900} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.mono, { color: colors.ink500 }]}>Centro de avisos</Text>
          <Text style={[styles.headline, { color: colors.ink900 }]}>Notificaciones</Text>
        </View>

        <TouchableOpacity
          onPress={marcarTodasLeidas}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Marcar todas como leídas"
          hitSlop={8}
        >
          <Text style={[styles.markRead, { color: colors.amber600 }]}>Marcar{'\n'}leídas</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {loading && data.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.amber500} size="large" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={n => n.id}
          renderItem={renderItem}
          ListEmptyComponent={<ListEmpty />}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={colors.amber500}
              colors={[colors.amber500]}
            />
          }
        />
      )}
    </View>
  );
}

// ─── styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerCenter: {
    flex: 1,
  },
  mono: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  markRead: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textAlign: 'right',
    lineHeight: 16,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // Item
  item: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: '#ef4444',
    borderWidth: 2,
  },
  itemContent: { flex: 1 },
  itemTop: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  itemTitle: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
  },
  itemTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    flexShrink: 0,
    marginTop: 2,
  },
  itemDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  // Empty
  emptyWrap: {
    paddingTop: 64,
    alignItems: 'center',
    gap: 10,
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
    maxWidth: 240,
  },

  // Centered loader
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
