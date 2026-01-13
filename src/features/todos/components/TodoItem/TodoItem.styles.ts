import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/shared/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.base,
    ...shadows.sm,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  titleCompleted: {
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  checkbox: {
    padding: 2,
  },
  deleteButton: {
    padding: 2,
  },
});
