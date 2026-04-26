/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// =====================================================================
// Stitch design tokens — sourced from project 16062927818472003315
// ("청약 코파일럿: 맞춤형 청약 어시스턴트"). Mirrored in tailwind.config.js
// so NativeWind classes like `bg-primary` resolve at compile time. Use
// the runtime exports below when a value must be referenced from JS.
// =====================================================================

export const stitchColors = {
  "on-primary": "#ffffff",
  "surface-dim": "#d7dbda",
  "tertiary-fixed": "#ffe088",
  "tertiary-fixed-dim": "#e9c349",
  background: "#f6faf9",
  "secondary-fixed": "#d5e3ff",
  "on-error": "#ffffff",
  "inverse-primary": "#76d6d5",
  "inverse-on-surface": "#edf2f1",
  "on-tertiary-container": "#4f3e00",
  "surface-container-low": "#f0f4f3",
  "on-background": "#181c1c",
  "primary-container": "#008080",
  "surface-container-highest": "#dfe3e2",
  "on-tertiary-fixed": "#241a00",
  "surface-bright": "#f6faf9",
  "secondary-fixed-dim": "#a7c8ff",
  "primary-fixed-dim": "#76d6d5",
  tertiary: "#735c00",
  "on-primary-container": "#e3fffe",
  "on-secondary-fixed": "#001c3b",
  "surface-container-lowest": "#ffffff",
  outline: "#6e7979",
  "inverse-surface": "#2c3131",
  "on-secondary-fixed-variant": "#1e477b",
  "secondary-container": "#9ec2fe",
  "surface-variant": "#dfe3e2",
  "on-secondary": "#ffffff",
  primary: "#006565",
  "surface-tint": "#006a6a",
  "on-primary-fixed": "#002020",
  "on-primary-fixed-variant": "#004f4f",
  "on-tertiary": "#ffffff",
  "surface-container-high": "#e5e9e8",
  secondary: "#395f94",
  error: "#ba1a1a",
  "primary-fixed": "#93f2f2",
  "outline-variant": "#bdc9c8",
  "surface-container": "#ebefee",
  "error-container": "#ffdad6",
  "on-secondary-container": "#284f83",
  "tertiary-container": "#cca830",
  surface: "#f6faf9",
  "on-surface-variant": "#3e4949",
  "on-error-container": "#93000a",
  "on-tertiary-fixed-variant": "#574500",
  "on-surface": "#181c1c",
} as const;

export const stitchRadii = {
  DEFAULT: 4,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

export const stitchSpacing = {
  unit: 4,
  "stack-gap-sm": 8,
  "stack-gap-md": 16,
  "stack-gap-lg": 24,
  "container-padding": 20,
  "section-margin": 40,
} as const;

export const stitchFonts = {
  regular: "PublicSans_400Regular",
  medium: "PublicSans_500Medium",
  semibold: "PublicSans_600SemiBold",
  bold: "PublicSans_700Bold",
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
