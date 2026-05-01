import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// ─── types ─────────────────────────────────────────────────────────

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  mode:      ThemeMode;
  setMode:   (m: ThemeMode) => void;
  effective: 'light' | 'dark';
  isDark:    boolean;
};

// ─── context ───────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType>({
  mode:      'system',
  setMode:   () => {},
  effective: 'light',
  isDark:    false,
});

const STORAGE_KEY = 'miahuafix_theme';

// ─── provider ──────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Load persisted mode once on mount
  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY).then(val => {
      if (val === 'dark' || val === 'light' || val === 'system') {
        setModeState(val as ThemeMode);
      }
    });
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    SecureStore.setItemAsync(STORAGE_KEY, m);
  };

  const effective: 'light' | 'dark' =
    mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;

  return (
    <ThemeContext.Provider value={{ mode, setMode, effective, isDark: effective === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── hook ──────────────────────────────────────────────────────────

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
