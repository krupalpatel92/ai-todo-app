import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/shared/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
    ...shadows.base,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.border.main,
  },
  buttonText: {
    fontSize: 24,
    color: colors.text.white,
    fontWeight: typography.fontWeight.regular,
    lineHeight: 28,
  },
});
