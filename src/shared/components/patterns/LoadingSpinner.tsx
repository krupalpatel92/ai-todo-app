import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from './LoadingSpinner.styles';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner = React.memo<LoadingSpinnerProps>(
  ({ message, size = 'large', color = '#2563eb' }) => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';
