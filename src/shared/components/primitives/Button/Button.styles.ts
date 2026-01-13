import { colors, borderRadius } from '@/shared/styles/theme';

export const buttonStyles = {
  base: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: borderRadius.md,
  },

  variants: {
    primary: {
      backgroundColor: colors.primary.main,
    },
    secondary: {
      backgroundColor: colors.secondary.main,
    },
    danger: {
      backgroundColor: colors.danger.main,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border.focus,
    },
  },

  sizes: {
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    lg: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    base: {
      fontWeight: '600' as const,
    },
    variants: {
      primary: {
        color: colors.text.white,
      },
      secondary: {
        color: colors.text.white,
      },
      danger: {
        color: colors.text.white,
      },
      ghost: {
        color: colors.primary.main,
      },
    },
    sizes: {
      sm: {
        fontSize: 14,
      },
      md: {
        fontSize: 16,
      },
      lg: {
        fontSize: 18,
      },
    },
  },
};
