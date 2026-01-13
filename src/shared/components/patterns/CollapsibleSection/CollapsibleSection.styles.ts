import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/shared/styles/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.base,
  },
  arrow: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginRight: spacing.md,
    width: 12,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  badge: {
    backgroundColor: colors.border.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  content: {
    marginTop: spacing.sm,
  },
});
