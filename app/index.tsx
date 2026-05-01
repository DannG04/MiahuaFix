import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { hasOnboarded } from '@/src/lib/anonId';

export default function Root() {
  const [destination, setDestination] = useState<'/(tabs)/mapa' | '/onboarding' | null>(null);

  useEffect(() => {
    hasOnboarded().then((done) => {
      setDestination(done ? '/(tabs)/mapa' : '/onboarding');
    });
  }, []);

  if (!destination) return null;
  return <Redirect href={destination} />;
}
