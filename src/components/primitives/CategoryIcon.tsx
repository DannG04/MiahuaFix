import Svg, { Path, Circle } from 'react-native-svg';
import type { Category } from '@/src/types/report';

type Props = { type: Category; size?: number; color?: string };

const SW = 1.7;
const CAPS = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function CategoryIcon({ type, size = 22, color = 'currentColor' }: Props) {
  const stroke = { stroke: color, strokeWidth: SW, fill: 'none', ...CAPS };

  if (type === 'bache') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 18h18" {...stroke} />
      <Path d="M6 18c0-3 2-5 6-5s6 2 6 5" {...stroke} />
      <Path d="M8 14l-1-3M16 14l1-3M12 13V9" {...stroke} />
    </Svg>
  );

  if (type === 'agua') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" {...stroke} />
      <Path d="M9 14a3 3 0 0 0 3 3" {...stroke} />
    </Svg>
  );

  if (type === 'basura') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 7h16" {...stroke} />
      <Path d="M9 7V4h6v3" {...stroke} />
      <Path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" {...stroke} />
      <Path d="M10 11v7M14 11v7" {...stroke} />
    </Svg>
  );

  if (type === 'alumbrado') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3a5 5 0 0 0-3 9v3h6v-3a5 5 0 0 0-3-9Z" {...stroke} />
      <Path d="M10 19h4M11 22h2" {...stroke} />
    </Svg>
  );

  if (type === 'drenaje') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="9" {...stroke} />
      <Path d="M5 9h14M5 15h14M9 4v16M15 4v16" {...stroke} />
    </Svg>
  );

  if (type === 'grafiti') return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 20h16M6 16l5-9 3 2-5 9H6v-2Z" {...stroke} />
      <Path d="M13 9l3-5 3 2-3 5" {...stroke} />
    </Svg>
  );

  // otro — generic alert circle
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 9v4M12 17h.01" {...stroke} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" {...stroke} />
    </Svg>
  );
}
