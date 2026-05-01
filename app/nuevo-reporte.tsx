import { useRef, useState } from 'react';
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
import { AnonBadge } from '@/src/components/primitives';
import { StepDots } from '@/src/components/StepDots';
import { ReportStep1 } from '@/src/components/ReportStep1';
import { ReportStep2 } from '@/src/components/ReportStep2';
import { useTheme } from '@/src/theme';
import type { Category, Severity } from '@/src/types/report';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL_STEPS = 3;

export default function NuevoReporte() {
  const router = useRouter();
  const { colors } = useTheme();

  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<Category | null>(null);
  const [severidad, setSeveridad] = useState<Severity | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const translateX = useSharedValue(SCREEN_W);
  const direction = useRef(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function slideIn(dir: 1 | -1) {
    translateX.value = dir * SCREEN_W;
    translateX.value = withTiming(0, { duration: 200 });
  }

  function goNext() {
    direction.current = 1;
    setStep((s) => {
      const next = s + 1;
      slideIn(1);
      return next;
    });
  }

  function goBack() {
    direction.current = -1;
    setStep((s) => {
      const prev = s - 1;
      slideIn(-1);
      return prev;
    });
  }

  function handleClose() {
    const hasDatos = tipo || severidad || descripcion.trim() || tags.length > 0;
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

  const stepLabels = ['Categoría', 'Detalles', 'Foto'];

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

      {/* StepDots */}
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
            <StepThreePlaceholder
              onBack={goBack}
              tipo={tipo}
              severidad={severidad}
              descripcion={descripcion}
              tags={tags}
              colors={colors}
            />
          )}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function StepThreePlaceholder({
  onBack,
  tipo,
  severidad,
  descripcion,
  tags,
  colors,
}: {
  onBack: () => void;
  tipo: Category | null;
  severidad: Severity | null;
  descripcion: string;
  tags: string[];
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={s3.container}>
      <Text style={[s3.title, { color: colors.ink900 }]}>Foto y ubicación.</Text>
      <Text style={[s3.subtitle, { color: colors.ink500 }]}>
        Paso 3 — pendiente (issue #14).
      </Text>
      <View style={[s3.summaryBox, { backgroundColor: colors.paper, borderColor: colors.line }]}>
        <Text style={[s3.summaryRow, { color: colors.ink700 }]}>Categoría: {tipo}</Text>
        <Text style={[s3.summaryRow, { color: colors.ink700 }]}>Severidad: {severidad}</Text>
        {descripcion ? (
          <Text style={[s3.summaryRow, { color: colors.ink700 }]}>Descripción: {descripcion}</Text>
        ) : null}
        {tags.length > 0 ? (
          <Text style={[s3.summaryRow, { color: colors.ink700 }]}>Tags: {tags.join(', ')}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.85}
        style={[s3.backBtn, { backgroundColor: colors.ivory, borderColor: colors.line }]}
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
        <Text style={[s3.backText, { color: colors.ink700 }]}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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

const s3 = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 28,
    lineHeight: 30,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 24,
  },
  summaryBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
    marginBottom: 24,
  },
  summaryRow: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
  },
  backText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
