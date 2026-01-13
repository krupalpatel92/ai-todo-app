import { colors, typography } from '@/shared/styles/theme';

export const textStyles = {
  base: {
    color: colors.text.primary,
  },

  variants: {
    heading: {
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
      lineHeight: typography.heading.fontSize * typography.heading.lineHeight,
    },
    subheading: {
      fontSize: typography.subheading.fontSize,
      fontWeight: typography.subheading.fontWeight,
      lineHeight: typography.subheading.fontSize * typography.subheading.lineHeight,
    },
    body: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      lineHeight: typography.body.fontSize * typography.body.lineHeight,
    },
    caption: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.caption.fontWeight,
      lineHeight: typography.caption.fontSize * typography.caption.lineHeight,
      color: colors.text.secondary,
    },
    label: {
      fontSize: typography.label.fontSize,
      fontWeight: typography.label.fontWeight,
      lineHeight: typography.label.fontSize * typography.label.lineHeight,
      color: colors.text.secondary,
    },
  },
};
