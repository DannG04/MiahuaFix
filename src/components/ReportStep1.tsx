import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CategoryIcon } from '@/src/components/primitives';
import { useTheme } from '@/src/theme';
import type { Category } from '@/src/types/report';

type Props = {
  selected: Category | null;
  setSelected: (cat: Category) => void;
  onNext: () => void;
};

const TYPES: { id: Category; label: string; desc: string; color: string }[] = [
  { id: 'bache',     label: 'Bache',        desc: 'Hoyo, pavimento roto',         color: '#7c3aed' },
  { id: 'basura',    label: 'Basura',        desc: 'Acumulación, no recolectada',  color: '#65a30d' },
  { id: 'alumbrado', label: 'Alumbrado',     desc: 'Lámpara fundida o dañada',     color: '#eab308' },
  { id: 'agua',      label: 'Fuga de agua',  desc: 'Drenaje, tubería rota',        color: '#0ea5e9' },
];

export function ReportStep1({ selected, setSelected, onNext }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink900 }]}>¿Qué encontraste?</Text>
      <Text style={[styles.subtitle, { color: colors.ink500 }]}>
        Elige la categoría que mejor describe la situación.
      </Text>

      <View style={styles.grid}>
        {TYPES.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setSelected(t.id)}
            activeOpacity={0.85}
            style={[
              styles.card,
              {
                borderColor: selected === t.id ? t.color : colors.line,
                borderWidth: selected === t.id ? 2 : 1,
                backgroundColor: selected === t.id ? t.color + '10' : colors.ivory,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: t.color + '18' }]}>
              <CategoryIcon type={t.id} size={22} color={t.color} />
            </View>
            <Text style={[styles.cardLabel, { color: colors.ink900 }]}>{t.label}</Text>
            <Text style={[styles.cardDesc, { color: colors.ink500 }]}>{t.desc}</Text>
            {selected === t.id && (
              <View style={[styles.checkPill, { backgroundColor: t.color }]}>
                <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="m5 12 5 5 10-11"
                    stroke="#fff"
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.otroBtn, { borderColor: colors.lineStrong }]}
        activeOpacity={0.7}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path d="M12 5v14M5 12h14" stroke={colors.ink500} strokeWidth={2} strokeLinecap="round" />
        </Svg>
        <Text style={[styles.otroText, { color: colors.ink500 }]}>Otro tipo de riesgo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!selected}
        onPress={onNext}
        activeOpacity={0.85}
        style={[
          styles.cta,
          { backgroundColor: selected ? colors.navy800 : colors.line },
        ]}
      >
        <Text style={[styles.ctaText, { color: selected ? colors.amber500 : colors.ink400 }]}>
          Continuar
        </Text>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12h14m-6-6 6 6-6 6"
            stroke={selected ? colors.amber500 : colors.ink400}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  card: {
    width: '47.5%',
    borderRadius: 16,
    padding: 18,
    position: 'relative',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    marginBottom: 3,
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 15,
  },
  checkPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  otroText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  ctaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
});
