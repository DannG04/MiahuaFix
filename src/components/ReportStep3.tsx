import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/src/theme';

type Coords = { lat: number; lng: number };

type Props = {
  fotoUri: string | null;
  setFotoUri: (uri: string | null) => void;
  coords: Coords | null;
  locLoading: boolean;
  enviando: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

async function processImage(uri: string): Promise<string> {
  const result = await manipulateAsync(uri, [], {
    compress: 0.8,
    format: SaveFormat.JPEG,
  });
  return result.uri;
}

export function ReportStep3({
  fotoUri, setFotoUri, coords, locLoading, enviando, onSubmit, onBack,
}: Props) {
  const { colors } = useTheme();
  const [exifStripped, setExifStripped] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handleCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 });
    if (result.canceled) return;
    setProcessing(true);
    try {
      const clean = await processImage(result.assets[0].uri);
      setFotoUri(clean);
      setExifStripped(true);
    } finally {
      setProcessing(false);
    }
  }

  async function handleGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, quality: 1 });
    if (result.canceled) return;
    setProcessing(true);
    try {
      const clean = await processImage(result.assets[0].uri);
      setFotoUri(clean);
      setExifStripped(true);
    } finally {
      setProcessing(false);
    }
  }

  function handleRemovePhoto() {
    setFotoUri(null);
    setExifStripped(false);
  }

  const canSubmit = !!fotoUri && !!coords && !enviando;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink900 }]}>Foto y ubicación.</Text>
      <Text style={[styles.subtitle, { color: colors.ink500 }]}>
        Una foto vale más — y ayuda a confirmar el reporte.
      </Text>

      {/* Photo area */}
      {processing ? (
        <View style={[styles.processingBox, { backgroundColor: colors.paper, borderColor: colors.line }]}>
          <ActivityIndicator color={colors.amber500} />
          <Text style={[styles.processingText, { color: colors.ink500 }]}>Procesando foto…</Text>
        </View>
      ) : fotoUri ? (
        <View style={[styles.photoWrap, { borderColor: colors.line }]}>
          <Image source={{ uri: fotoUri }} style={styles.photo} resizeMode="cover" />
          <TouchableOpacity
            onPress={handleRemovePhoto}
            style={styles.removeBtn}
            activeOpacity={0.85}
          >
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M6 6l12 12M18 6 6 18" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          {exifStripped && (
            <View style={styles.exifPill}>
              <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.exifText}>Metadatos removidos</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.photoButtons}>
          <TouchableOpacity
            onPress={handleCamera}
            activeOpacity={0.85}
            style={[styles.photoBtn, { backgroundColor: colors.ivory, borderColor: colors.line }]}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={6} width={18} height={14} rx={3} stroke={colors.ink500} strokeWidth={1.7} />
              <Circle cx={12} cy={13} r={4} stroke={colors.ink500} strokeWidth={1.7} />
              <Path d="M9 6 10 4h4l1 2" stroke={colors.ink500} strokeWidth={1.7} />
            </Svg>
            <Text style={[styles.photoBtnText, { color: colors.ink500 }]}>Tomar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGallery}
            activeOpacity={0.85}
            style={[styles.photoBtn, { backgroundColor: colors.ivory, borderColor: colors.line }]}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={16} rx={3} stroke={colors.ink500} strokeWidth={1.7} />
              <Path
                d="M3 16l5-5 4 4 3-3 6 6"
                stroke={colors.ink500}
                strokeWidth={1.7}
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.photoBtnText, { color: colors.ink500 }]}>De galería</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Location card */}
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
              <ActivityIndicator size="small" color={colors.amber500} />
            </View>
          )}
        </View>
        <View style={styles.locationInfo}>
          <Text style={[styles.locationLabel, { color: colors.ink500 }]}>Ubicación detectada</Text>
          {coords ? (
            <>
              <Text style={[styles.locationCoords, { color: colors.ink900 }]}>
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </Text>
              <Text style={[styles.locationSub, { color: colors.ink500 }]}>
                GPS — precisión alta
              </Text>
            </>
          ) : locLoading ? (
            <Text style={[styles.locationSub, { color: colors.ink500 }]}>Obteniendo ubicación…</Text>
          ) : (
            <Text style={[styles.locationSub, { color: colors.red500 }]}>Ubicación no disponible</Text>
          )}
          <TouchableOpacity
            onPress={() => Alert.alert('Próximamente', 'Ajuste manual de ubicación en desarrollo.')}
            activeOpacity={0.7}
          >
            <Text style={[styles.adjustLink, { color: colors.amber600 }]}>Ajustar en el mapa →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={onBack}
          disabled={enviando}
          activeOpacity={0.85}
          style={[styles.backBtn, { backgroundColor: colors.ivory, borderColor: colors.line }]}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5m6-6-6 6 6 6"
              stroke={colors.ink900}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
          style={[styles.submitBtn, { backgroundColor: colors.navy900, opacity: canSubmit ? 1 : 0.35 }]}
        >
          {enviando ? (
            <ActivityIndicator color={colors.amber500} />
          ) : (
            <>
              <Text style={[styles.submitText, { color: colors.amber500 }]}>Revisar y enviar</Text>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke={colors.amber500}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  processingBox: {
    height: 108,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  processingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  photoWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exifPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(15,30,61,0.9)',
  },
  exifText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: '#f59e0b',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  photoBtn: {
    flex: 1,
    height: 108,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  locationCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  mapWrap: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    flexShrink: 0,
  },
  map: {
    width: 80,
    height: 80,
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    minWidth: 0,
  },
  locationLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  locationCoords: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginTop: 3,
  },
  locationSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  adjustLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
