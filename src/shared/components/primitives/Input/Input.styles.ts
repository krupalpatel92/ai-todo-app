import { colors, borderRadius, spacing } from '@/shared/styles/theme';

export const inputStyles = {
  container: {
    marginBottom: spacing.margin.md,
  },

  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 6,
    color: colors.text.secondary,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.md,
  },

  inputError: {
    borderColor: colors.border.error,
  },

  error: {
    fontSize: 12,
    marginTop: 4,
    color: colors.danger.main,
  },

  placeholderColor: colors.text.placeholder,
};
