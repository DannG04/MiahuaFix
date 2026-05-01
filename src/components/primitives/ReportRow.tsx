import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/src/theme';
import { CategoryIcon } from './CategoryIcon';
import { SeverityChip } from './SeverityChip';
import { StatusPill } from './StatusPill';
import type { Report, Category } from '@/src/types/report';

type Props = { report: Report; onPress: () => void; showVotes?: boolean };

const CATEGORY_COLOR: Record<Category, string> = {
  bache:     '#7c3aed',
  agua:      '#0ea5e9',
  basura:    '#65a30d',
  alumbrado: '#eab308',
  drenaje:   '#0891b2',
  grafiti:   '#db2777',
  otro:      '#6b7280',
};

const CATEGORY_LABEL: Record<Category, string> = {
  bache:     'Bache',
  agua:      'Fuga de agua',
  basura:    'Basura',
  alumbrado: 'Alumbrado',
  drenaje:   'Drenaje',
  grafiti:   'Grafiti',
  otro:      'Otro',
};

export function ReportRow({ report, onPress, showVotes = true }: Props) {
  const { colors } = useTheme();
  const { type, title, location, time, severity, votes, status } = report;

  const typeColor = CATEGORY_COLOR[type];
  const typeLabel = CATEGORY_LABEL[type];

  const a11yLabel = [
    typeLabel,
    title,
    location,
    `${votes} confirmaciones`,
    time,
  ].join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.ivory, borderColor: colors.line, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {/* Category icon badge */}
      <View style={[styles.iconBadge, { backgroundColor: typeColor + '20' }]}>
        <CategoryIcon type={type} size={20} color={typeColor} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top row: category label · time · status */}
        <View style={styles.topRow}>
          <Text style={[styles.categoryLabel, { color: typeColor }]}>{typeLabel}</Text>
          <Text style={[styles.dot, { color: colors.ink300 }]}>·</Text>
          <Text style={[styles.time, { color: colors.ink500 }]}>{time}</Text>
          {status && (
            <View style={styles.statusWrap}>
              <StatusPill status={status} />
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.ink900 }]} numberOfLines={2}>{title}</Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z" stroke={colors.ink500} strokeWidth={2} />
            <Circle cx="12" cy="9" r="2.5" stroke={colors.ink500} strokeWidth={2} />
          </Svg>
          <Text style={[styles.location, { color: colors.ink500 }]} numberOfLines={1}>{location}</Text>
        </View>

        {/* Bottom row: severity + votes */}
        <View style={styles.bottomRow}>
          <SeverityChip level={severity} />
          {showVotes && (
            <View style={styles.votes}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M7 10v10H3V10h4ZM7 10l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2l-1 6a3 3 0 0 1-3 2H7"
                  stroke={colors.ink500}
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={[styles.votesLabel, { color: colors.ink500 }]}>{votes} confirmaciones</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  categoryLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dot: {
    fontSize: 10,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  statusWrap: {
    marginLeft: 'auto',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  votes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  votesLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
});
