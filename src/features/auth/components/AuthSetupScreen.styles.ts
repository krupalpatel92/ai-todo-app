import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/shared/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  header: {
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#eff6ff',
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: '#1e40af',
    lineHeight: 20,
  },
  benefitsContainer: {
    marginBottom: spacing['3xl'],
  },
  benefitsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.base,
  },
  benefitItem: {
    marginBottom: spacing.md,
  },
  benefitText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});
