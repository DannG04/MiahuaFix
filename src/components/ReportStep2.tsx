import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import type { Severity } from '@/src/types/report';

type Props = {
  severity: Severity | null;
  setSeverity: (s: Severity) => void;
  descripcion: string;
  setDescripcion: (s: string) => void;
  tags: string[];
  setTags: (t: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const SEVERITIES: { id: Severity; label: string; desc: string; color: string }[] = [
  { id: 'low',    label: 'Bajo',  desc: 'Molestia menor',    color: '#22c55e' },
  { id: 'medium', label: 'Medio', desc: 'Problema evidente', color: '#f59e0b' },
  { id: 'high',   label: 'Alto',  desc: 'Riesgo inminente',  color: '#ef4444' },
];

const QUICK_TAGS = ['Daña autos', 'Zona de paso', 'Zona escolar', 'Peligroso de noche', 'Desde hace días'];

export function ReportStep2({ severity, setSeverity, descripcion, setDescripcion, tags, setTags, onNext, onBack }: Props) {
  const { colors } = useTheme();

  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink900 }]}>Cuéntanos más.</Text>
      <Text style={[styles.subtitle, { color: colors.ink500 }]}>
        Tu descripción ayuda al equipo a priorizar.
      </Text>

      {/* Severidad */}
      <Text style={[styles.sectionLabel, { color: colors.ink500 }]}>Severidad</Text>
      <View style={styles.severityRow}>
        {SEVERITIES.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSeverity(s.id)}
            activeOpacity={0.85}
            style={[
              styles.severityCard,
              {
                borderColor: severity === s.id ? s.color : colors.line,
                borderWidth: severity === s.id ? 2 : 1,
                backgroundColor: severity === s.id ? s.color + '12' : colors.ivory,
              },
            ]}
          >
            <View style={[styles.severityDot, { backgroundColor: s.color }]} />
            <Text style={[styles.severityLabel, { color: colors.ink900 }]}>{s.label}</Text>
            <Text style={[styles.severityDesc, { color: colors.ink500 }]}>{s.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Descripción */}
      <Text style={[styles.sectionLabel, { color: colors.ink500 }]}>
        {'Descripción '}
        <Text style={[styles.optionalLabel, { color: colors.ink400 }]}>(opcional)</Text>
      </Text>
      <View style={[styles.textareaWrap, { backgroundColor: colors.ivory, borderColor: colors.line }]}>
        <TextInput
          style={[styles.textarea, { color: colors.ink900 }]}
          placeholder='Ej. "Bache de unos 40 cm sobre el carril derecho."'
          placeholderTextColor={colors.ink400}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          maxLength={240}
          textAlignVertical="top"
        />
        <View style={[styles.textareaFooter, { borderTopColor: colors.line }]}>
          <View style={styles.micBtn}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 1a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3ZM19 11v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8"
                stroke={colors.ink300}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.micLabel, { color: colors.ink300 }]}>Mic</Text>
          </View>
          <Text style={[styles.counter, { color: colors.ink400 }]}>{descripcion.length} / 240</Text>
        </View>
      </View>

      {/* Quick tags */}
      <View style={styles.tagsRow}>
        {QUICK_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            activeOpacity={0.8}
            style={[
              styles.tagChip,
              {
                backgroundColor: tags.includes(tag) ? colors.amber100 : colors.ivory,
                borderColor: tags.includes(tag) ? colors.amber500 : colors.line,
              },
            ]}
          >
            <Text style={[styles.tagText, { color: tags.includes(tag) ? colors.amber600 : colors.ink500 }]}>
              {tags.includes(tag) ? '✓' : '+'} {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botones */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={onBack}
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
          onPress={onNext}
          disabled={!severity}
          activeOpacity={0.85}
          style={[
            styles.nextBtn,
            { backgroundColor: severity ? colors.navy800 : colors.line },
          ]}
        >
          <Text style={[styles.nextBtnText, { color: severity ? colors.amber500 : colors.ink400 }]}>
            Continuar
          </Text>
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
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  optionalLabel: {
    fontFamily: 'Inter_400Regular',
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  severityCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    marginBottom: 8,
  },
  severityLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  severityDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  textareaWrap: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 16,
  },
  textarea: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    minHeight: 72,
  },
  textareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  micLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  counter: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 24,
  },
  tagChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
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
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
