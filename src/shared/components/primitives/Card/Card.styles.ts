import { borderRadius, shadows, spacing } from '@/shared/styles/theme';

export const cardStyles = {
  base: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },

  padding: {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  },
};
