import { useState } from 'react';
import {
  View, Text, Pressable, Modal, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import { AnonBadge } from '@/src/components/primitives';
import { markOnboarded } from '@/src/lib/anonId';

export default function ScreenOnboarding() {
  const { colors, spacing, radii, shadows } = useTheme();
  const router = useRouter();
  const [privacyVisible, setPrivacyVisible] = useState(false);

  async function handleEmpezar() {
    await markOnboarded();
    router.replace('/(tabs)/mapa');
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.ivory }]}>
      {/* ── Decorative blobs ── */}
      <View style={styles.blobContainer} pointerEvents="none">
        <Svg width={320} height={320} style={styles.blobTopRight}>
          <Defs>
            <RadialGradient id="amberBlob" cx="50%" cy="50%" r="50%">
              <Stop offset="0%"   stopColor={colors.amber500} stopOpacity={0.18} />
              <Stop offset="60%"  stopColor={colors.amber500} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="160" cy="160" rx="160" ry="160" fill="url(#amberBlob)" />
        </Svg>
        <Svg width={180} height={180} style={styles.blobLeft}>
          <Defs>
            <RadialGradient id="navyBlob" cx="50%" cy="50%" r="50%">
              <Stop offset="0%"   stopColor={colors.navy800} stopOpacity={0.1} />
              <Stop offset="60%"  stopColor={colors.navy800} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="90" cy="90" rx="90" ry="90" fill="url(#navyBlob)" />
        </Svg>
      </View>

      <View style={[styles.inner, { paddingHorizontal: spacing[7] }]}>
        {/* ── Top badge ── */}
        <View style={styles.badge}>
          <View style={[styles.badgeDot, { backgroundColor: colors.amber500 }]} />
          <Text style={[styles.badgeText, { color: colors.ink500 }]}>
            Ciudad · Reportes urbanos
          </Text>
        </View>

        {/* ── Hero + description ── */}
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.ink900 }]}>
            {'Tu reporte\nmejora tu\n'}
            <Text style={[styles.heroItalic, { color: colors.amber500 }]}>colonia</Text>
            <Text style={[styles.heroTitle, { color: colors.ink900 }]}>.</Text>
          </Text>

          <Text style={[styles.body, { color: colors.ink700 }]}>
            Un bache, basura acumulada, una lámpara fundida o una fuga.
            Repórtalo en 30 segundos, sin dar tu nombre, y avisa al ayuntamiento.
          </Text>

          {/* ── Info pills ── */}
          <View style={styles.pills}>
            <AnonBadge />
            <View style={[styles.pill, { backgroundColor: colors.amber100 }]}>
              <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                <Path
                  d="m5 12 5 5L20 7"
                  stroke={colors.amber600}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={[styles.pillText, { color: colors.amber600 }]}>Sin crear cuenta</Text>
            </View>
          </View>
        </View>

        {/* ── Progress dots ── */}
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === 0
                  ? { width: 24, backgroundColor: colors.amber500 }
                  : { width: 6,  backgroundColor: colors.line },
              ]}
            />
          ))}
        </View>

        {/* ── CTA ── */}
        <Pressable
          onPress={handleEmpezar}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.navy800, ...shadows.md, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={[styles.ctaText, { color: colors.ivory }]}>Empezar</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke={colors.amber500}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        <Pressable
          onPress={() => setPrivacyVisible(true)}
          accessibilityRole="button"
          style={styles.privacyLink}
        >
          <Text style={[styles.privacyText, { color: colors.ink500 }]}>
            Cómo protegemos tu anonimato →
          </Text>
        </Pressable>
      </View>

      {/* ── Privacy modal ── */}
      <Modal
        visible={privacyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPrivacyVisible(false)}
      >
        <SafeAreaView style={[styles.root, { backgroundColor: colors.ivory }]}>
          <ScrollView contentContainerStyle={[styles.modalContent, { paddingHorizontal: spacing[6] }]}>
            <Text style={[styles.modalTitle, { color: colors.ink900 }]}>Tu anonimato</Text>
            <Text style={[styles.modalBody, { color: colors.ink700 }]}>
              MiahuaFix no te pide nombre, email ni teléfono. Al abrir la app se genera un ID
              aleatorio que vive solo en tu dispositivo. Nadie, ni nosotros, puede relacionarlo
              contigo.{'\n\n'}
              Tus reportes se publican sin ningún dato personal. Si quieres desvincularte de
              ellos completamente, puedes regenerar tu ID desde Perfil: los reportes anteriores
              quedan anónimos en la plataforma y dejan de aparecer en "Mis reportes".{'\n\n'}
              No usamos cookies de seguimiento ni SDKs de publicidad.
            </Text>
            <Pressable
              onPress={() => setPrivacyVisible(false)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: colors.navy800, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={[styles.ctaText, { color: colors.ivory }]}>Entendido</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  blobContainer: { ...StyleSheet.absoluteFillObject },
  blobTopRight: { position: 'absolute', top: -100, right: -80 },
  blobLeft:     { position: 'absolute', top: 80,   left: -60 },

  inner: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 24,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 99 },
  badgeText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  hero: { flex: 1, justifyContent: 'center' },
  heroTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 46,
    lineHeight: 48,
    letterSpacing: -0.5,
    marginBottom: 18,
  },
  heroItalic: {
    fontFamily: 'InstrumentSerif_400Regular_Italic',
    fontSize: 46,
    lineHeight: 48,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },

  pills: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 28,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  pillText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },

  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  dot: { height: 6, borderRadius: 3 },

  cta: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },

  privacyLink: { alignItems: 'center', marginTop: 12 },
  privacyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },

  modalContent: { paddingTop: 32, paddingBottom: 40, gap: 20 },
  modalTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 28,
    lineHeight: 32,
  },
  modalBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 23,
  },
});
