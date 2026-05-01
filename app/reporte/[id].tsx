import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Svg, { Circle, Path } from 'react-native-svg';
import { CategoryIcon, SeverityChip, StatusPill } from '@/src/components/primitives';
import { useReporte } from '@/src/hooks/useReporte';
import { useAnonId } from '@/src/hooks/useAnonId';
import { confirmarReporte } from '@/src/lib/api/reportes';
import { useTheme } from '@/src/theme';
import { parseLocation } from '@/src/lib/parseLocation';
import { haptic } from '@/src/lib/haptics';
import type { Category } from '@/src/types/report';

// ─── helpers ───────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  bache:     '#7c3aed',
  basura:    '#65a30d',
  alumbrado: '#eab308',
  agua:      '#0ea5e9',
  drenaje:   '#0891b2',
  grafiti:   '#db2777',
  otro:      '#6b7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  bache:     'Bache',
  basura:    'Basura',
  alumbrado: 'Alumbrado',
  agua:      'Fuga de agua',
  drenaje:   'Drenaje',
  grafiti:   'Grafiti',
  otro:      'Otro',
};

const STATUS_RANK: Record<string, number> = {
  pending: 0, pendiente: 0,
  confirmed: 1, confirmado: 1,
  assigned: 2, asignado: 2,
  resolved: 3, resuelto: 3,
};

const TIMELINE = [
  { label: 'Recibido',                    rank: 0 },
  { label: 'Confirmado por la comunidad', rank: 1 },
  { label: 'Asignado a Mantenimiento',    rank: 2 },
  { label: 'Resuelto',                    rank: 3 },
];


function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

function openInMaps(lat: number, lng: number) {
  const label = encodeURIComponent('Reporte MiahuaFix');
  const url = Platform.OS === 'ios'
    ? `maps:0,0?q=${label}@${lat},${lng}`
    : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
  Linking.openURL(url).catch(() =>
    Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`),
  );
}

// ─── screen ────────────────────────────────────────────────────────

export default function ScreenDetail() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { colors } = useTheme();
  const { id: anonId } = useAnonId();
  const { data, confirmaciones, loading, error, refetch } = useReporte(id ?? null);

  const [confirming, setConfirming] = useState(false);

  const hasConfirmed = !!anonId && confirmaciones.some(c => c.anon_id === anonId);
  const currentRank  = STATUS_RANK[data?.estado ?? 'pending'] ?? 0;
  const coords       = parseLocation(data?.ubicacion ?? null);

  async function handleConfirm() {
    if (!anonId || !id) return;
    haptic.medium();
    setConfirming(true);
    try {
      await confirmarReporte({ reporteId: id, anonId });
      await refetch();
    } catch (err: any) {
      if (err.code === '23505') {
        Alert.alert('Ya confirmado', 'Ya confirmaste este reporte anteriormente.');
      } else {
        Alert.alert('Error', err.message ?? 'No se pudo confirmar el reporte.');
      }
    } finally {
      setConfirming(false);
    }
  }

  async function handleShare() {
    await Share.share({ message: `${data?.titulo ?? 'Reporte'} — MiahuaFix` });
  }

  // ── loading ──
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.ivory }]}>
        <ActivityIndicator color={colors.amber500} size="large" />
      </View>
    );
  }

  // ── error / not found ──
  if (error || !data) {
    const is404 = !data && !error;
    return (
      <View style={[styles.centered, { backgroundColor: colors.ivory }]}>
        <Text style={[styles.errorTitle, { color: colors.ink900 }]}>
          {is404 ? 'Reporte no encontrado' : 'Ocurrió un error'}
        </Text>
        {error && (
          <Text style={[styles.errorBody, { color: colors.ink500 }]}>{error.message}</Text>
        )}
        <View style={styles.errorButtons}>
          {!is404 && (
            <TouchableOpacity
              onPress={refetch}
              style={[styles.retryBtn, { backgroundColor: colors.navy900 }]}
            >
              <Text style={[styles.retryText, { color: colors.amber500 }]}>Reintentar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: colors.ink500 }]}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[data.tipo] ?? '#6b7280';

  return (
    <ScrollView
      style={{ backgroundColor: colors.ivory }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero foto ── */}
      <View style={styles.hero}>
        {data.foto_url ? (
          <Image
            source={{ uri: data.foto_url }}
            style={styles.heroImg}
            resizeMode="cover"
            accessibilityLabel={data.descripcion ? `Foto del reporte: ${data.descripcion}` : `Foto del reporte ${data.titulo}`}
            accessibilityRole="image"
          />
        ) : (
          <View style={[styles.heroImg, styles.heroPlaceholder, { backgroundColor: colors.paper }]}>
            <Text style={{ color: colors.ink400, fontFamily: 'Inter_400Regular', fontSize: 13 }}>
              Sin foto
            </Text>
          </View>
        )}

        {/* Floating buttons */}
        <View style={[styles.heroButtons, { top: insets.top + 12 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.heroBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5m6-6-6 6 6 6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.heroBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Compartir reporte"
            hitSlop={8}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M12 3v13m0-13-5 5m5-5 5 5" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Photo indicator dots */}
        <View style={styles.photoDots}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.photoDot,
                { backgroundColor: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* ── Content ── */}
      <View style={styles.content}>

        {/* Chips */}
        <View style={styles.chips}>
          <View style={[styles.catChip, { backgroundColor: catColor + '15' }]}>
            <CategoryIcon type={data.tipo as Category} size={12} color={catColor} />
            <Text style={[styles.catChipText, { color: catColor }]}>
              {CATEGORY_LABELS[data.tipo] ?? data.tipo}
            </Text>
          </View>
          <SeverityChip level={data.severidad} />
          <StatusPill status={data.estado} />
        </View>

        {/* Title */}
        <Text accessibilityRole="header" style={[styles.title, { color: colors.ink900 }]}>{data.titulo}</Text>

        {/* Location + time */}
        <View style={styles.meta}>
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z" stroke={colors.ink400} strokeWidth={2} />
            <Circle cx={12} cy={9} r={2.5} stroke={colors.ink400} strokeWidth={2} />
          </Svg>
          <Text style={[styles.metaText, { color: colors.ink500 }]}>
            {coords
              ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
              : 'Ubicación no disponible'}
            {'  ·  '}{timeAgo(data.creado_en)}
          </Text>
        </View>

        {/* Description */}
        {data.descripcion ? (
          <Text style={[styles.description, { color: colors.ink700 }]}>{data.descripcion}</Text>
        ) : null}

        {/* ── Confirm CTA ── */}
        <View style={[styles.confirmCard, { backgroundColor: colors.navy900 }]}>
          <View style={styles.confirmInfo}>
            <Text style={styles.confirmSub}>¿También lo viste?</Text>
            <Text style={styles.confirmTitle}>Confirma para priorizar</Text>
          </View>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={hasConfirmed || confirming}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={hasConfirmed ? 'Ya confirmaste este reporte' : 'Confirmar reporte'}
            accessibilityHint={hasConfirmed ? undefined : 'Marca este reporte como visto para priorizarlo'}
            accessibilityState={{ disabled: hasConfirmed || confirming, busy: confirming }}
            style={[
              styles.confirmBtn,
              { backgroundColor: colors.amber500, opacity: hasConfirmed ? 0.5 : 1 },
            ]}
          >
            {confirming ? (
              <ActivityIndicator size="small" color={colors.navy900} />
            ) : (
              <>
                <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M7 10v10H3V10h4ZM7 10l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1 6a3 3 0 0 1-3 2H7"
                    stroke={colors.navy900}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={[styles.confirmBtnText, { color: colors.navy900 }]}>{data.votos}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Timeline ── */}
        <Text style={[styles.sectionLabel, { color: colors.ink500 }]}>Estado del reporte</Text>
        <View style={[styles.timelineCard, { backgroundColor: colors.ivory, borderColor: colors.line }]}>
          {TIMELINE.map((step, i) => {
            const done    = currentRank >= step.rank;
            const isLast  = i === TIMELINE.length - 1;
            const connDone = currentRank > step.rank;
            return (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View style={[
                    styles.timelineDot,
                    {
                      backgroundColor:  done ? colors.navy900 : 'transparent',
                      borderColor:      done ? 'transparent' : colors.lineStrong,
                      borderWidth:      done ? 0 : 2,
                      borderStyle:      'dashed',
                    },
                  ]}>
                    {done && (
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="m5 12 5 5 10-11"
                          stroke={colors.amber500}
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    )}
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.timelineConnector,
                      {
                        backgroundColor: connDone ? colors.amber500 : colors.line,
                        opacity: connDone ? 0.4 : 1,
                      },
                    ]} />
                  )}
                </View>
                <View style={[styles.timelineLabel, isLast && styles.timelineLabelLast]}>
                  <Text style={[
                    styles.timelineTitle,
                    { color: done ? colors.ink900 : colors.ink400 },
                  ]}>
                    {step.label}
                  </Text>
                  {step.rank === 0 && (
                    <Text style={[styles.timelineTime, { color: colors.ink400 }]}>
                      {timeAgo(data.creado_en)}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Location card ── */}
        <View style={[styles.locationCard, { backgroundColor: colors.ivory, borderColor: colors.line }]}>
          <View style={styles.mapWrap}>
            {coords ? (
              <MapView
                style={styles.map}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                initialRegion={{
                  latitude: coords.lat,
                  longitude: coords.lng,
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004,
                }}
              >
                <Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} />
              </MapView>
            ) : (
              <View style={[styles.map, styles.mapPlaceholder, { backgroundColor: colors.paper }]}>
                <Text style={{ color: colors.ink400, fontSize: 10 }}>–</Text>
              </View>
            )}
          </View>
          <View style={styles.locationInfo}>
            {coords ? (
              <>
                <Text style={[styles.locationCoords, { color: colors.ink900 }]}>
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </Text>
                <TouchableOpacity
                  onPress={() => openInMaps(coords.lat, coords.lng)}
                  activeOpacity={0.7}
                  accessibilityRole="link"
                  accessibilityLabel="Abrir ubicación en mapa"
                  hitSlop={8}
                >
                  <Text style={[styles.openMapLink, { color: colors.amber600 }]}>Abrir en mapa →</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={[styles.locationCoords, { color: colors.ink500 }]}>Sin coordenadas</Text>
            )}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

// ─── styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButtons: { gap: 12, alignItems: 'center' },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  backLink:  { fontFamily: 'Inter_500Medium', fontSize: 14 },

  hero:            { height: 280, position: 'relative' },
  heroImg:         { width: '100%', height: 280 },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  heroButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(15,30,61,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoDots: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 5,
  },
  photoDot: { flex: 1, height: 3, borderRadius: 2 },

  content: { padding: 16 },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  catChipText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
  },

  title: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: 10,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  metaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    flex: 1,
  },

  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },

  confirmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  confirmInfo: { flex: 1 },
  confirmSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 2,
  },
  confirmTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  confirmBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },

  sectionLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  timelineCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  timelineDotCol: {
    alignItems: 'center',
    flexShrink: 0,
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineConnector: {
    width: 2,
    height: 22,
    marginTop: 2,
  },
  timelineLabel: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 22,
  },
  timelineLabelLast: { paddingBottom: 2 },
  timelineTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  timelineTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },

  locationCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  mapWrap: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  map:            { width: 70, height: 70 },
  mapPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  locationInfo:   { flex: 1 },
  locationCoords: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  openMapLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 6,
  },
});
