import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ThemeContextType = {
  isDark:     boolean;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark:     false,
  toggleDark: () => {},
});

const STORAGE_KEY = 'miahuafix_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [isDark, setIsDark] = useState(system === 'dark');

  // Load persisted preference once on mount
  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY).then(val => {
      if (val === 'dark')  setIsDark(true);
      if (val === 'light') setIsDark(false);
      // null → keep system default
    });
  }, []);

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      SecureStore.setItemAsync(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
