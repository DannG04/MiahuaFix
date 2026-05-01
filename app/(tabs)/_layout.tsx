import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/src/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="mapa"          options={{ title: 'Mapa' }} />
      <Tabs.Screen name="comunidad"     options={{ title: 'Comunidad' }} />
      <Tabs.Screen name="nuevo"         options={{ title: 'Reportar' }} />
      <Tabs.Screen name="mis-reportes"  options={{ title: 'Mis reportes' }} />
      <Tabs.Screen name="perfil"        options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
