import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/shared/components/primitives';
import { getTodayDate } from '../../lib/date.utils';
import type { TodoData } from '../../types/todo.types';
import { styles } from './QuickAddInput.styles';

interface QuickAddInputProps {
  onAdd: (data: TodoData) => void | Promise<void>;
  isLoading?: boolean;
}

export const QuickAddInput = React.memo<QuickAddInputProps>(({ onAdd, isLoading = false }) => {
  const [value, setValue] = useState('');

  const handleAdd = async (): Promise<void> => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const data = {
      title: trimmedValue,
      dueDate: getTodayDate(),
    };

    try {
      await onAdd(data);
      setValue('');
    } catch {
      // Keep input value on error so user can retry
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Add a new task..."
        placeholderTextColor="#9ca3af"
        onSubmitEditing={handleAdd}
        returnKeyType="done"
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.button, (!value.trim() || isLoading) && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={!value.trim() || isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>+</Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

QuickAddInput.displayName = 'QuickAddInput';
