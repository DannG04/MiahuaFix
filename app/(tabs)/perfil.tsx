import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import { useThemeContext } from '@/src/theme/ThemeContext';
import { useAnonId } from '@/src/hooks/useAnonId';
import { AnonBadge } from '@/src/components/primitives';

// ─── persistence helpers ────────────────────────────────────────────

async function loadPref(key: string, def: boolean): Promise<boolean> {
  const v = await SecureStore.getItemAsync(`pref_${key}`);
  return v === null ? def : v === '1';
}

function savePref(key: string, val: boolean) {
  SecureStore.setItemAsync(`pref_${key}`, val ? '1' : '0');
}

// ─── custom switch ──────────────────────────────────────────────────

function CustomSwitch({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const tx = useRef(new Animated.Value(value ? 16 : 0)).current;

  useEffect(() => {
    Animated.timing(tx, {
      toValue:         value ? 16 : 0,
      duration:        180,
      useNativeDriver: true,
    }).start();
  }, [value, tx]);

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      style={[
        styles.switchTrack,
        { backgroundColor: value ? '#f59e0b' : 'rgba(15,30,61,0.18)' },
      ]}
    >
      <Animated.View style={[styles.switchKnob, { transform: [{ translateX: tx }] }]} />
    </TouchableOpacity>
  );
}

// ─── row ───────────────────────────────────────────────────────────

type RowProps = {
  icon:     React.ReactNode;
  label:    string;
  detail?:  string;
  toggle?:  boolean;
  value?:   boolean;
  last?:    boolean;
  onPress?: () => void;
  onToggle?:() => void;
};

function Row({ icon, label, detail, toggle, value, last, onPress, onToggle }: RowProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggle ? onToggle : onPress}
      disabled={!onPress && !onToggle}
      activeOpacity={0.7}
      style={[
        styles.row,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.line },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.paper }]}>
        {icon}
      </View>
      <Text style={[styles.rowLabel, { color: colors.ink900 }]} numberOfLines={1}>
        {label}
      </Text>
      {detail && !toggle && (
        <Text style={[styles.rowDetail, { color: colors.ink500 }]}>{detail}</Text>
      )}
      {toggle ? (
        <CustomSwitch value={!!value} onToggle={onToggle ?? (() => {})} />
      ) : (
        onPress && (
          <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <Path d="m9 5 7 7-7 7" stroke={colors.ink400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )
      )}
    </TouchableOpacity>
  );
}

// ─── section ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.ink500 }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
        {children}
      </View>
    </>
  );
}

// ─── screen ────────────────────────────────────────────────────────

export default function ScreenProfile() {
  const { colors }         = useTheme();
  const { isDark, toggleDark } = useThemeContext();
  const insets             = useSafeAreaInsets();
  const { id, idShort, regenerate } = useAnonId();

  const [pushOn,    setPushOn]    = useState(true);
  const [alertsOn,  setAlertsOn]  = useState(false);
  const [summaryOn, setSummaryOn] = useState(false);
  const [metaOn,    setMetaOn]    = useState(true);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Load persisted prefs once
  useEffect(() => {
    Promise.all([
      loadPref('push',    true),
      loadPref('alerts',  false),
      loadPref('summary', false),
      loadPref('meta',    true),
    ]).then(([push, alerts, summary, meta]) => {
      setPushOn(push);
      setAlertsOn(alerts);
      setSummaryOn(summary);
      setMetaOn(meta);
      setPrefsLoaded(true);
    });
  }, []);

  const toggle = useCallback((
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    key: string,
  ) => {
    setter(prev => {
      const next = !prev;
      savePref(key, next);
      return next;
    });
  }, []);

  function handleRegenerate() {
    Alert.alert(
      'Regenerar ID anónimo',
      'Se generará un nuevo código. Perderás el acceso a tus reportes anteriores.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Regenerar',
          style: 'destructive',
          onPress: regenerate,
        },
      ],
    );
  }

  const shortId = idShort ?? '····-····';

  return (
    <ScrollView
      style={{ backgroundColor: colors.ivory }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 32 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Tarjeta superior ── */}
      <View style={[styles.profileCard, { backgroundColor: colors.paper, borderColor: colors.line }]}>
        <View style={[styles.avatar, { backgroundColor: colors.navy900 }]}>
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"
              stroke={colors.amber500}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.ink900 }]}>Usuario anónimo</Text>
          <Text style={[styles.profileId, { color: colors.ink500 }]}>#{shortId}</Text>
          <View style={{ marginTop: 8 }}>
            <AnonBadge compact />
          </View>
        </View>
      </View>

      {/* ── Párrafo privacidad ── */}
      <Text style={[styles.privacyNote, { color: colors.ink500 }]}>
        No tenemos tu nombre, correo ni matrícula. Tu ID es un código aleatorio que puedes borrar en cualquier momento.
      </Text>

      {/* ── Apariencia ── */}
      <Section title="Apariencia">
        <Row
          icon={<MoonIcon color={colors.ink500} />}
          label="Modo oscuro"
          toggle
          value={isDark}
          onToggle={toggleDark}
          last
        />
      </Section>

      {/* ── Avisos ── */}
      <Section title="Avisos">
        <Row
          icon={<BellIcon color={colors.ink500} />}
          label="Notificaciones push"
          toggle
          value={pushOn}
          onToggle={() => toggle(setPushOn, 'push')}
        />
        <Row
          icon={<PinIcon color={colors.ink500} />}
          label="Alertas de mi colonia"
          detail="Col. Centro"
        />
        <Row
          icon={<CalIcon color={colors.ink500} />}
          label="Resumen semanal"
          toggle
          value={summaryOn}
          onToggle={() => toggle(setSummaryOn, 'summary')}
          last
        />
      </Section>

      {/* ── Privacidad ── */}
      <Section title="Privacidad">
        <Row
          icon={<LockIcon color={colors.ink500} />}
          label="Remover metadatos de fotos"
          toggle
          value={metaOn}
          onToggle={() => toggle(setMetaOn, 'meta')}
        />
        <Row
          icon={<ClockIcon color={colors.ink500} />}
          label="Borrar historial"
          detail="Cada 90 días"
          onPress={() => {}}
        />
        <Row
          icon={<RefreshIcon color={colors.ink500} />}
          label="Regenerar mi ID anónimo"
          onPress={handleRegenerate}
          last
        />
      </Section>

      {/* ── Ayuda ── */}
      <Section title="Ayuda">
        <Row
          icon={<QuestionIcon color={colors.ink500} />}
          label="Preguntas frecuentes"
          onPress={() => {}}
        />
        <Row
          icon={<ShieldCheckIcon color={colors.ink500} />}
          label="Política de privacidad"
          onPress={() => {}}
          last
        />
      </Section>
    </ScrollView>
  );
}

// ─── inline icons ───────────────────────────────────────────────────

const I = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">{children as any}</Svg>
);

const MoonIcon       = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M20 12a8 8 0 1 1-8-8c0 4 4 8 8 8Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
  </Svg>
);
const BellIcon       = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M6 8a6 6 0 1 1 12 0v5l2 3H4l2-3V8Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
  </Svg>
);
const PinIcon        = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z" stroke={color} strokeWidth="1.7" />
  </Svg>
);
const CalIcon        = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.7" />
    <Path d="M3 9h18" stroke={color} strokeWidth="1.7" />
  </Svg>
);
const LockIcon       = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="10" width="16" height="11" rx="2" stroke={color} strokeWidth="1.7" />
    <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="1.7" />
  </Svg>
);
const ClockIcon      = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
    <Path d="M12 7v5l3 2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);
const RefreshIcon    = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5a9 9 0 1 1-3.5-7.1" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M21 4v6h-6" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const QuestionIcon   = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
    <Path d="M9 9a3 3 0 1 1 3 3v2M12 18v.01" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);
const ShieldCheckIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <Path d="m9 12 2 2 4-4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },

  // Profile card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 22,
    lineHeight: 24,
  },
  profileId: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    marginTop: 4,
  },

  // Privacy note
  privacyNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginHorizontal: 8,
    marginBottom: 4,
  },

  // Section
  sectionTitle: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowLabel: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  rowDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },

  // Custom switch
  switchTrack: {
    width: 40,
    height: 24,
    borderRadius: 99,
    padding: 2,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 99,
    backgroundColor: '#fff',
  },
});
