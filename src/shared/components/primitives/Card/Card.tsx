import React from 'react';
import { View, ViewProps } from 'react-native';
import { cardStyles } from './Card.styles';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.memo<CardProps>(({ children, padding = 'md', style, ...props }) => {
  return (
    <View style={[cardStyles.base, { padding: cardStyles.padding[padding] }, style]} {...props}>
      {children}
    </View>
  );
});

Card.displayName = 'Card';
