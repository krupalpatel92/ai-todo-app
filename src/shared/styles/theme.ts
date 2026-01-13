export const colors = {
  primary: {
    main: '#2563eb',
    light: '#3b82f6',
    dark: '#1d4ed8',
  },
  secondary: {
    main: '#6b7280',
    light: '#9ca3af',
    dark: '#4b5563',
  },
  success: {
    main: '#22c55e',
    light: '#4ade80',
    dark: '#16a34a',
  },
  danger: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
  border: {
    light: '#e5e7eb',
    main: '#d1d5db',
    dark: '#9ca3af',
    default: '#d1d5db',
    focus: '#2563eb',
    error: '#ef4444',
  },
  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6b7280',
    disabled: '#9ca3af',
    placeholder: '#9ca3af',
    white: '#ffffff',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    main: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
  transparent: 'transparent',
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 1.2,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 1.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 1.4,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  margin: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
  },
} as const;

export const borderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
