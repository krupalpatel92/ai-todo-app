import React from 'react';
import { Text, TextStyle } from 'react-native';
import { iconStyles } from './Icon.styles';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const Icon = React.memo<IconProps>(({ name, size = 24, color, style }) => {
  const sizeStyle: TextStyle = { fontSize: size };
  const colorStyle: TextStyle = color ? { color } : iconStyles.defaultColor;

  return <Text style={[iconStyles.base, sizeStyle, colorStyle, style]}>{name}</Text>;
});

Icon.displayName = 'Icon';
