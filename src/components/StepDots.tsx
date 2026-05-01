import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';

type Props = { step: number; total: number };

export function StepDots({ step, total }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              flex: i === step ? 3 : 1,
              backgroundColor: i <= step ? colors.amber500 : colors.line,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
});
