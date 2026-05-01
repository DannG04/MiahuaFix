import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { AnonBadge } from '@/src/components/primitives';
import { StepDots } from '@/src/components/StepDots';
import { ReportStep1 } from '@/src/components/ReportStep1';
import { ReportStep2 } from '@/src/components/ReportStep2';
import { ReportStep3 } from '@/src/components/ReportStep3';
import { ReportSuccess } from '@/src/components/ReportSuccess';
import { useTheme } from '@/src/theme';
import { useAnonId } from '@/src/hooks/useAnonId';
import { crearReporte } from '@/src/lib/api/reportes';
import type { Category, Severity } from '@/src/types/report';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL_STEPS = 3;

const TIPO_LABELS: Record<Category, string> = {
  bache:     'Bache',
  basura:    'Basura',
  alumbrado: 'Alumbrado',
  agua:      'Fuga de agua',
  drenaje:   'Drenaje',
  grafiti:   'Grafiti',
  otro:      'Incidencia',
};

type Coords = { lat: number; lng: number };

export default function NuevoReporte() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id: anonId } = useAnonId();

  // Wizard state
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<Category | null>(null);
  const [severidad, setSeveridad] = useState<Severity | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [reporteId, setReporteId] = useState<string | null>(null);

  // Location
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locLoading, setLocLoading] = useState(true);

  // Submit
  const [enviando, setEnviando] = useState(false);

  // Slide animation
  const translateX = useSharedValue(0);
  const direction = useRef(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocLoading(false);
        return;
      }
      const { coords: c } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCoords({ lat: c.latitude, lng: c.longitude });
      setLocLoading(false);
    })();
  }, []);

  function slideIn(dir: 1 | -1) {
    translateX.value = dir * SCREEN_W;
    translateX.value = withTiming(0, { duration: 200 });
  }

  function goNext() {
    setStep((s) => { slideIn(1); return s + 1; });
  }

  function goBack() {
    setStep((s) => { slideIn(-1); return s - 1; });
  }

  function handleClose() {
    const hasDatos = tipo || severidad || descripcion.trim() || tags.length > 0 || fotoUri;
    if (hasDatos) {
      Alert.alert(
        'Descartar reporte',
        '¿Seguro que quieres cerrar? Los datos ingresados se perderán.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Descartar', style: 'destructive', onPress: () => router.back() },
        ],
      );
    } else {
      router.back();
    }
  }

  async function handleSubmit() {
    if (!tipo || !severidad || !fotoUri || !coords || !anonId) return;

    const titulo = `${TIPO_LABELS[tipo]}${descripcion.trim() ? ' — ' + descripcion.trim().slice(0, 80) : ''}`;

    setEnviando(true);
    try {
      const reporte = await crearReporte({
        titulo,
        tipo,
        severidad,
        descripcion: descripcion.trim() || undefined,
        lat: coords.lat,
        lng: coords.lng,
        fotoUri,
        anonId,
      });
      setReporteId(reporte.id);
      slideIn(1);
      setStep(3);
    } catch (err: any) {
      Alert.alert('Error al enviar', err.message ?? 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  // Success screen: full screen, no wizard chrome
  if (step === 3 && reporteId) {
    return <ReportSuccess reporteId={reporteId} />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.ivory }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.line }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6 6 18M6 6l12 12"
              stroke={colors.ink700}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={[styles.stepTitle, { color: colors.ink700 }]}>
          Paso {step + 1} de {TOTAL_STEPS}
        </Text>
        <AnonBadge compact />
      </View>

      {/* Progress */}
      <View style={styles.dotsWrap}>
        <StepDots step={step} total={TOTAL_STEPS} />
      </View>

      {/* Step content */}
      <Animated.View style={[styles.stepWrap, animStyle]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && (
            <ReportStep1
              selected={tipo}
              setSelected={setTipo}
              onNext={goNext}
            />
          )}
          {step === 1 && (
            <ReportStep2
              severity={severidad}
              setSeverity={setSeveridad}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              tags={tags}
              setTags={setTags}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 2 && (
            <ReportStep3
              fotoUri={fotoUri}
              setFotoUri={setFotoUri}
              coords={coords}
              locLoading={locLoading}
              enviando={enviando}
              onSubmit={handleSubmit}
              onBack={goBack}
            />
          )}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  dotsWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  stepWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
});
