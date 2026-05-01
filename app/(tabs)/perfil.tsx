import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';

export default function ScreenProfile() {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.ivory }]}>
      <Text style={{ color: colors.ink500, fontFamily: 'Inter_400Regular' }}>Perfil — issue 19</Text>
    </View>
  );
}

const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
