import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../primitives/Button';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = React.memo<EmptyStateProps>(
  ({ icon, title, message, actionLabel, onAction }) => {
    return (
      <View style={styles.container}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}
        {actionLabel && onAction && (
          <Button onPress={onAction} style={styles.button}>
            {actionLabel}
          </Button>
        )}
      </View>
    );
  }
);

EmptyState.displayName = 'EmptyState';
