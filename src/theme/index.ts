import { colors } from './colors';
import type { ColorTokens } from './colors';
import { spacing } from './spacing';
import { radii } from './radii';
import { shadows } from './shadows';
import { typography } from './typography';
import { useThemeContext } from './ThemeContext';

export type Theme = {
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  typography: typeof typography;
  isDark: boolean;
};

export function useTheme(): Theme {
  const { isDark } = useThemeContext();
  return {
    colors: isDark ? colors.dark : colors.light,
    spacing,
    radii,
    shadows,
    typography,
    isDark,
  };
}

export { colors, spacing, radii, shadows, typography };
export type { ColorTokens } from './colors';
