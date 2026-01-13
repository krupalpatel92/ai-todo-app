import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/shared/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});
