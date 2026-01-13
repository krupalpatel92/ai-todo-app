import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { textStyles } from './Text.styles';

interface CustomTextProps extends RNTextProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  children: React.ReactNode;
}

export const Text = React.memo<CustomTextProps>(
  ({ variant = 'body', style, children, ...props }) => {
    return (
      <RNText style={[textStyles.base, textStyles.variants[variant], style]} {...props}>
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';
