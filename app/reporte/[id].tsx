import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/src/theme';

export default function ScreenDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.ivory }]}>
      <Text style={{ color: colors.ink500, fontFamily: 'Inter_400Regular' }}>Detalle #{id} — issue 15</Text>
    </View>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
