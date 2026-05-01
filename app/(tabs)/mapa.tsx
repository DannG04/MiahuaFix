import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, FlatList, TextInput,
  RefreshControl, StyleSheet, Animated, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import { ReportRow } from '@/src/components/primitives';
import { useReportes, type ReportesFilters } from '@/src/hooks/useReportes';
import { useNotificaciones } from '@/src/hooks/useNotificaciones';
import { useAnonId } from '@/src/hooks/useAnonId';
import type { SeveridadReporte } from '@/src/types/database';
import type { Reporte } from '@/src/hooks/useReportes';
import type { Report } from '@/src/types/report';

// ─── Mapper ───────────────────────────────────────────────────────────────────

function toReport(r: Reporte): Report {
  return {
    id:       r.id,
    type:     r.tipo,
    title:    r.titulo,
    location: r.descripcion ?? '—',
    time:     new Date(r.creado_en).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    severity: r.severidad,
    votes:    r.votos,
    status:   r.estado,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Miahuatlán de Porfirio Díaz, Oaxaca — fallback when location is denied.
const MIAHUATLAN = { latitude: 16.3337, longitude: -96.5962, latitudeDelta: 0.04, longitudeDelta: 0.04 };

const SEVERITY_COLOR: Record<SeveridadReporte, string> = {
  low:    '#22c55e',
  medium: '#f59e0b',
  high:   '#ef4444',
};

type FilterOption = { label: string; key: string; severity?: SeveridadReporte; };
const FILTERS: FilterOption[] = [
  { label: 'Todos',  key: 'all' },
  { label: 'Alto',   key: 'high',   severity: 'high' },
  { label: 'Medio',  key: 'medium', severity: 'medium' },
  { label: 'Bajo',   key: 'low',    severity: 'low' },
  { label: 'Hoy',    key: 'today' },
  { label: '< 500m', key: 'near' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLocation(ubicacion: unknown): { latitude: number; longitude: number } | null {
  if (!ubicacion) return null;
  try {
    const geo = typeof ubicacion === 'string' ? JSON.parse(ubicacion) : ubicacion;
    if (geo?.type === 'Point' && Array.isArray(geo.coordinates)) {
      return { latitude: geo.coordinates[1], longitude: geo.coordinates[0] };
    }
  } catch {}
  return null;
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SeverityMarker({ severity, onPress }: { severity: SeveridadReporte; onPress: () => void }) {
  const color = SEVERITY_COLOR[severity];
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (severity !== 'high') return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 2.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 600,  useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [severity, pulseAnim]);

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [1, 2.2], outputRange: [0.3, 0] });

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <View style={markerStyles.wrap}>
        {severity === 'high' && (
          <Animated.View style={[
            markerStyles.pulse,
            { backgroundColor: color, transform: [{ scale: pulseAnim }], opacity: pulseOpacity },
          ]} />
        )}
        <View style={[markerStyles.outer, { borderColor: color }]}>
          <View style={[markerStyles.inner, { backgroundColor: color }]} />
        </View>
      </View>
    </Pressable>
  );
}

const markerStyles = StyleSheet.create({
  wrap:  { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 22, height: 22, borderRadius: 11 },
  outer: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 9, height: 9, borderRadius: 5 },
});

function UserPin() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 2.5, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 0,    useNativeDriver: true }),
      ]),
    ).start();
  }, [pulseAnim]);

  const pulseOpacity = pulseAnim.interpolate({ inputRange: [1, 2.5], outputRange: [0.28, 0] });

  return (
    <View style={pinStyles.wrap}>
      <Animated.View style={[pinStyles.pulse, { transform: [{ scale: pulseAnim }], opacity: pulseOpacity }]} />
      <View style={pinStyles.dot} />
    </View>
  );
}

const pinStyles = StyleSheet.create({
  wrap:  { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#2563eb' },
  dot:   { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2563eb', borderWidth: 3, borderColor: '#fff' },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ScreenHome() {
  const { colors, isDark, spacing, shadows } = useTheme();
  const insets       = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // Active state: navy bg + amber text in light; amber bg + navy text in dark.
  const activeBg    = isDark ? colors.amber500  : colors.navy800;
  const activeColor = isDark ? colors.navy900   : colors.amber500;
  const [headerHeight, setHeaderHeight] = useState(240);

  const [view,           setView]           = useState<'map' | 'list'>('map');
  const [activeFilter,   setActiveFilter]   = useState('all');
  const [userCoords,     setUserCoords]     = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(text), 300);
  }, []);

  const { id: anonId } = useAnonId();
  const { unreadCount } = useNotificaciones(anonId);

  // Request location once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserCoords({ lat: coords.latitude, lng: coords.longitude });
      mapRef.current?.animateToRegion({
        latitude:      coords.latitude,
        longitude:     coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 800);
    })();
  }, []);

  // Build query filters
  const queryFilters = useMemo((): ReportesFilters => {
    const f = FILTERS.find((x) => x.key === activeFilter);
    if (f?.severity) return { severidad: f.severity };
    if (activeFilter === 'near' && userCoords) return { nearLatLng: userCoords, radiusMeters: 500 };
    return {};
  }, [activeFilter, userCoords]);

  const { data: reportes, loading, refetch } = useReportes(queryFilters);

  // Client-side "Hoy" + search filters
  const displayedReportes = useMemo(() => {
    let list = activeFilter === 'today' ? reportes.filter((r) => isToday(r.creado_en)) : reportes;
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((r) =>
        r.titulo.toLowerCase().includes(q) ||
        (r.descripcion ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [reportes, activeFilter, debouncedQuery]);

  const handleLocate = useCallback(() => {
    if (!userCoords) return;
    mapRef.current?.animateToRegion({
      latitude:      userCoords.lat,
      longitude:     userCoords.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 500);
  }, [userCoords]);

  const headerTop = insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.ivory }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Map ── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={MIAHUATLAN}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* User pin */}
        {userCoords && (
          <Marker coordinate={{ latitude: userCoords.lat, longitude: userCoords.lng }} anchor={{ x: 0.5, y: 0.5 }}>
            <UserPin />
          </Marker>
        )}

        {/* Report pins */}
        {displayedReportes.map((r) => {
          const coord = parseLocation(r.ubicacion);
          if (!coord) return null;
          return (
            <Marker key={r.id} coordinate={coord} anchor={{ x: 0.5, y: 0.5 }}>
              <SeverityMarker
                severity={r.severidad}
                onPress={() => router.push(`/reporte/${r.id}`)}
              />
            </Marker>
          );
        })}
      </MapView>

      {/* ── Header overlay ── */}
      <View
        style={[styles.headerOverlay, { paddingTop: headerTop, backgroundColor: colors.ivory + 'F0' }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.locationLabel, { color: colors.ink500 }]}>
              Col. Centro · Miahuatlán
            </Text>
            <Text style={[styles.greeting, { color: colors.ink900 }]}>
              {'Hola, '}
              <Text style={[styles.greetingItalic, { color: colors.amber600 }]}>buen día</Text>
            </Text>
          </View>

          {/* Notification bell */}
          <Pressable
            onPress={() => router.push('/notificaciones')}
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
            style={[styles.bellBtn, { backgroundColor: colors.paper, borderColor: colors.line, ...shadows.sm }]}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M6 8a6 6 0 1 1 12 0v5l2 3H4l2-3V8Z" stroke={colors.ink900} strokeWidth={1.7} strokeLinejoin="round" />
              <Path d="M10 19a2 2 0 0 0 4 0" stroke={colors.ink900} strokeWidth={1.7} strokeLinecap="round" />
            </Svg>
            {unreadCount > 0 && (
              <View style={[styles.bellDot, { backgroundColor: colors.red500, borderColor: colors.paper }]} />
            )}
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.paper, borderColor: colors.line }]}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="7" stroke={colors.ink500} strokeWidth={1.8} />
            <Path d="m20 20-4-4" stroke={colors.ink500} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar calle, colonia, tipo…"
            placeholderTextColor={colors.ink400}
            style={[styles.searchInput, { color: colors.ink900 }]}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          <View style={[styles.searchDivider, { backgroundColor: colors.line }]} />
          <View style={styles.searchFilter}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path d="M3 5h18l-7 9v5l-4 2v-7L3 5Z" stroke={colors.amber600} strokeWidth={1.8} strokeLinejoin="round" />
            </Svg>
            <Text style={[styles.searchFilterText, { color: colors.amber600 }]}>
              {displayedReportes.length}
            </Text>
          </View>
        </View>

        {/* View toggle + filter chips — inside header so posición es exacta */}
        <View style={styles.toggleRow}>
          <View style={[styles.toggle, { backgroundColor: colors.paper, borderColor: colors.line }]}>
            {(['map', 'list'] as const).map((v) => {
              const active = view === v;
              return (
                <Pressable
                  key={v}
                  onPress={() => setView(v)}
                  style={[styles.toggleBtn, active && { backgroundColor: activeBg }]}
                >
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    {v === 'map'
                      ? <Path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" stroke={active ? activeColor : colors.ink500} strokeWidth={2} strokeLinejoin="round" />
                      : <Path d="M4 6h16M4 12h16M4 18h16" stroke={active ? activeColor : colors.ink500} strokeWidth={2} strokeLinecap="round" />
                    }
                  </Svg>
                  <Text style={[styles.toggleText, { color: active ? activeColor : colors.ink500 }]}>
                    {v === 'map' ? 'Mapa' : 'Lista'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          style={styles.filtersScroll}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: activeBg }
                    : { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
                ]}
              >
                {f.severity && (
                  <View style={[
                    styles.chipDot,
                    { backgroundColor: SEVERITY_COLOR[f.severity], opacity: active ? 0 : 1 },
                  ]} />
                )}
                <Text style={[styles.chipText, { color: active ? activeColor : colors.ink700 }]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Right action buttons ── */}
      <View style={styles.zoomBtns}>
        {[
          { icon: <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M5 12h14" stroke={colors.ink900} strokeWidth={2} strokeLinecap="round" /></Svg>,
            onPress: () => {} },
          { icon: <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Path d="M5 12h14" stroke={colors.ink900} strokeWidth={2} strokeLinecap="round" /></Svg>,
            onPress: () => {} },
          { icon: <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="3" fill={colors.ink900} /><Circle cx="12" cy="12" r="8" stroke={colors.ink900} strokeWidth={1.8} /><Path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={colors.ink900} strokeWidth={1.8} /></Svg>,
            onPress: handleLocate },
        ].map((btn, i) => (
          <Pressable
            key={i}
            onPress={btn.onPress}
            style={[styles.zoomBtn, { backgroundColor: colors.paper, borderColor: colors.line, ...shadows.sm }]}
          >
            {btn.icon}
          </Pressable>
        ))}
      </View>

      {/* ── Bottom sheet preview ── */}
      {displayedReportes.length > 0 && view === 'map' && (
        <View style={[styles.sheet, { backgroundColor: colors.paper, borderColor: colors.line, ...shadows.lg, bottom: tabBarHeight + 8 }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetLabel, { color: colors.ink500 }]}>Cerca de ti</Text>
            <View style={[styles.sheetDivider, { backgroundColor: colors.line }]} />
            <Text style={[styles.sheetMore, { color: colors.amber600 }]}>
              Ver {displayedReportes.length} →
            </Text>
          </View>
          <ReportRow
            report={toReport(displayedReportes[0])}
            onPress={() => router.push(`/reporte/${displayedReportes[0].id}`)}
          />
        </View>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <FlatList
          data={displayedReportes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: headerHeight + 8, paddingBottom: 110 + insets.bottom },
          ]}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.ivory, zIndex: 25 }]}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={colors.amber500}
              colors={[colors.amber500]}
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.ink700 }]}>Sin reportes</Text>
              <Text style={[styles.emptyBody, { color: colors.ink500 }]}>
                No hay reportes con estos filtros.{'\n'}Prueba cambiando la búsqueda.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ReportRow
              report={toReport(item)}
              onPress={() => router.push(`/reporte/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
    paddingHorizontal: 16, paddingBottom: 12,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  locationLabel: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  greeting: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 26, lineHeight: 28, marginTop: 2 },
  greetingItalic: { fontFamily: 'InstrumentSerif_400Regular_Italic', fontSize: 26 },

  bellBtn: { width: 40, height: 40, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, borderWidth: 2 },

  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 },
  searchInput: { fontFamily: 'Inter_400Regular', fontSize: 14, flex: 1, paddingVertical: 0 },
  searchDivider: { width: 1, height: 16 },
  searchFilter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  searchFilterText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },

  toggleRow: { marginBottom: 8 },
  toggle: { alignSelf: 'flex-start', flexDirection: 'row', borderWidth: 1, borderRadius: 10, padding: 3, gap: 2 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 7 },
  toggleText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  filtersScroll: { marginHorizontal: -16 },
  filters: { paddingHorizontal: 16, gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  zoomBtns: { position: 'absolute', right: 12, top: 270, zIndex: 20, gap: 8 },
  zoomBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  sheet: { position: 'absolute', left: 12, right: 12, zIndex: 20, borderRadius: 18, padding: 14, borderWidth: 1 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sheetLabel: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  sheetDivider: { flex: 1, height: 1 },
  sheetMore: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },

  listContent: { paddingHorizontal: 12, gap: 0 },
  emptyState:  { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle:  { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22 },
  emptyBody:   { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
