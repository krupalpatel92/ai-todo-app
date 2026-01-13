import React from 'react';
import { View, TextInput, Text, TextInputProps, ViewStyle } from 'react-native';
import { inputStyles } from './Input.styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = React.memo<InputProps>(({ label, error, containerStyle, style, ...props }) => {
  return (
    <View style={[inputStyles.container, containerStyle]}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <TextInput
        style={[inputStyles.input, error && inputStyles.inputError, style]}
        placeholderTextColor={inputStyles.placeholderColor}
        {...props}
      />
      {error && <Text style={inputStyles.error}>{error}</Text>}
    </View>
  );
});

Input.displayName = 'Input';
