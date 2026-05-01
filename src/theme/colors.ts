export type ColorTokens = {
  navy900: string; navy800: string; navy700: string; navy600: string; navy500: string;
  amber600: string; amber500: string; amber400: string; amber100: string; amberBg: string;
  ink900: string; ink700: string; ink500: string; ink400: string; ink300: string;
  ivory: string; paper: string;
  green600: string; green500: string; green100: string;
  red600: string; red500: string; red100: string;
  line: string; lineStrong: string;
};

const light: ColorTokens = {
  navy900: '#0a1530',
  navy800: '#0f1e3d',
  navy700: '#162a52',
  navy600: '#1f3a6b',
  navy500: '#2c4d85',

  amber600: '#d97706',
  amber500: '#f59e0b',
  amber400: '#fbbf24',
  amber100: '#fef3c7',
  amberBg:  '#fef7ed',

  ink900: '#0c1220',
  ink700: '#2a3348',
  ink500: '#5b6478',
  ink400: '#8892a6',
  ink300: '#bdc4d4',

  ivory: '#faf7f2',
  paper: '#f5f1ea',

  green600: '#15803d',
  green500: '#22c55e',
  green100: '#dcfce7',

  red600: '#b91c1c',
  red500: '#ef4444',
  red100: '#fee2e2',

  line:      'rgba(15, 30, 61, 0.08)',
  lineStrong:'rgba(15, 30, 61, 0.14)',
};

const dark: ColorTokens = {
  ...light,
  ivory: '#0e1424',
  paper: '#141c33',

  ink900: '#f5f1ea',
  ink700: '#d4dae8',
  ink500: '#95a0b8',
  ink400: '#6b7590',
  ink300: '#3a4464',

  navy800: '#f59e0b',
  amber100: 'rgba(245, 158, 11, 0.14)',
  amberBg:  'rgba(245, 158, 11, 0.1)',
  green100: 'rgba(34, 197, 94, 0.14)',
  red100:   'rgba(239, 68, 68, 0.14)',

  line:      'rgba(255, 255, 255, 0.08)',
  lineStrong:'rgba(255, 255, 255, 0.14)',
};

export const colors = { light, dark };
