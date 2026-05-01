import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/src/theme';

type Props = { compact?: boolean };

export function AnonBadge({ compact = false }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.pill,
      {
        backgroundColor: colors.line,
        paddingVertical:  compact ? 3 : 5,
        paddingHorizontal: compact ? 8 : 11,
      },
    ]}>
      <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"
          stroke={colors.navy800}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M9 12l2 2 4-4"
          stroke={colors.navy800}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={[styles.label, { color: colors.navy800, fontSize: compact ? 10 : 11 }]}>
        Anónimo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
  },
});
