import React, { useRef } from 'react';
import { View } from 'react-native';
import { AuthGuard } from '@/features/auth';
import { QuickAddInput } from '../QuickAddInput';
import type { TodoData } from '../../types/todo.types';

interface ProtectedQuickAddInputProps {
  onAdd: (data: TodoData) => Promise<void>;
  isLoading?: boolean;
}

export const ProtectedQuickAddInput = React.memo<ProtectedQuickAddInputProps>(
  ({ onAdd, isLoading }) => {
    const pendingDataRef = useRef<TodoData | null>(null);

    const handleAdd = (data: TodoData): void => {
      pendingDataRef.current = data;
    };

    const handleAuthenticated = async (): Promise<void> => {
      if (pendingDataRef.current) {
        await onAdd(pendingDataRef.current);
        pendingDataRef.current = null;
      }
    };

    return (
      <AuthGuard
        onAuthenticated={handleAuthenticated}
        promptMessage="Authenticate to create a new task"
      >
        <View>
          <QuickAddInput onAdd={handleAdd} isLoading={isLoading} />
        </View>
      </AuthGuard>
    );
  }
);

ProtectedQuickAddInput.displayName = 'ProtectedQuickAddInput';
