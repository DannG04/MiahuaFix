import { colors } from './colors';
import type { ColorTokens } from './colors';
import { spacing } from './spacing';
import { radii } from './radii';
import { shadows } from './shadows';
import { typography } from './typography';
import { useThemeContext } from './ThemeContext';
import type { ThemeMode } from './ThemeContext';

export type Theme = {
  colors:    ColorTokens;
  spacing:   typeof spacing;
  radii:     typeof radii;
  shadows:   typeof shadows;
  typography:typeof typography;
  isDark:    boolean;
  mode:      ThemeMode;
  setMode:   (m: ThemeMode) => void;
  effective: 'light' | 'dark';
};

export function useTheme(): Theme {
  const { isDark, mode, setMode, effective } = useThemeContext();
  return {
    colors: isDark ? colors.dark : colors.light,
    spacing,
    radii,
    shadows,
    typography,
    isDark,
    mode,
    setMode,
    effective,
  };
}

export { colors, spacing, radii, shadows, typography };
export type { ColorTokens } from './colors';
export type { ThemeMode } from './ThemeContext';
