import { View, Text, StyleSheet, type DimensionValue } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line } from 'react-native-svg';
import { useTheme } from '@/src/theme';

type Props = {
  width?:  DimensionValue;
  height?: number;
  label?:  string;
  radius?: number;
};

export function PhotoPlaceholder({ width = '100%', height = 160, label = 'foto', radius = 12 }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { width, height, borderRadius: radius, overflow: 'hidden' }]}>
      {/* Diagonal stripe pattern via SVG */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="stripes" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
            <Rect width="24" height="24" fill={colors.ivory} />
            <Line x1="0" y1="0" x2="0" y2="24" stroke={colors.paper} strokeWidth="12" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#stripes)" />
      </Svg>
      <Text style={[styles.label, { color: colors.ink500 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
