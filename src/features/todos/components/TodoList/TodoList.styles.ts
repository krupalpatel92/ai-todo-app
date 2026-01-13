import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/shared/styles/theme';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.danger.main,
    textAlign: 'center',
  },
  emptySection: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});
