import type { TextStyle } from 'react-native';

/**
 * Dark, high-energy, competitive — closer to a sports scoreboard than a
 * calm wellness app. No custom display font is loaded yet (avoids an
 * extra native asset dependency for this spike); "condensed numerals" are
 * approximated with system-font weight/spacing. Swap in a real condensed
 * face via expo-font later without touching call sites.
 */
export const theme = {
  color: {
    background: '#0B0B0F',
    surface: '#17171F',
    surfaceRaised: '#202029',
    border: '#2B2B36',
    battle: '#E11D2E',
    battleDim: '#7A1019',
    win: '#C6FF3D',
    textPrimary: '#F5F5F7',
    textSecondary: '#9494A0',
    textMuted: '#5C5C68',
  },
  space: (n: number) => n * 4,
  radius: {
    sm: 8,
    md: 14,
    lg: 24,
    pill: 999,
  },
} as const;

export const numeralStyle: TextStyle = {
  fontWeight: '800',
  letterSpacing: -1,
  fontVariant: ['tabular-nums'],
};
