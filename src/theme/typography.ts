// Font name → loaded key mapping:
//   Inter_400Regular / 500Medium / 600SemiBold / 700Bold  (@expo-google-fonts/inter)
//   InstrumentSerif_400Regular / 400Regular_Italic         (@expo-google-fonts/instrument-serif)
//   JetBrainsMono_400Regular / 500Medium / 600SemiBold     (@expo-google-fonts/jetbrains-mono)
import type { TextStyle } from 'react-native';

type TypographyToken = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'
>;

export const typography = {
  serifXl:  { fontFamily: 'InstrumentSerif_400Regular',        fontSize: 40, lineHeight: 44 } as TypographyToken,
  serifLg:  { fontFamily: 'InstrumentSerif_400Regular',        fontSize: 34, lineHeight: 36 } as TypographyToken,
  serifMd:  { fontFamily: 'InstrumentSerif_400Regular',        fontSize: 26, lineHeight: 28 } as TypographyToken,
  serifSm:  { fontFamily: 'InstrumentSerif_400Regular',        fontSize: 20, lineHeight: 24 } as TypographyToken,
  serifItalic: { fontFamily: 'InstrumentSerif_400Regular_Italic', fontSize: 26, lineHeight: 28 } as TypographyToken,

  h1:    { fontFamily: 'Inter_700Bold',     fontSize: 22, lineHeight: 28 } as TypographyToken,
  h2:    { fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 24 } as TypographyToken,
  h3:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 20 } as TypographyToken,
  body:  { fontFamily: 'Inter_400Regular',  fontSize: 14, lineHeight: 20 } as TypographyToken,
  bodyMd:{ fontFamily: 'Inter_500Medium',   fontSize: 14, lineHeight: 20 } as TypographyToken,
  sm:    { fontFamily: 'Inter_400Regular',  fontSize: 12, lineHeight: 16 } as TypographyToken,
  smMd:  { fontFamily: 'Inter_500Medium',   fontSize: 12, lineHeight: 16 } as TypographyToken,

  label: { fontFamily: 'JetBrainsMono_500Medium',   fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' } as TypographyToken,
  mono:  { fontFamily: 'JetBrainsMono_400Regular',  fontSize: 12, lineHeight: 18 } as TypographyToken,
  monoMd:{ fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 12, lineHeight: 18 } as TypographyToken,
} as const;
