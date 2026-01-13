import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { Text } from '@/shared/components/primitives';
import { AuthGate } from '@/features/auth';
import {
  QuickAddInput,
  TodoList,
  TodoEditBottomSheet,
  TodoPreviewBottomSheet,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useToggleTodo,
  useTodoStore,
  type Todo,
  type TodoData,
} from '@/features/todos';
import { styles } from './Index.styles';

export default function Index(): React.JSX.Element {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const { bottomSheetMode, openPreviewSheet, openEditSheet, closeBottomSheet } = useTodoStore();

  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const toggleMutation = useToggleTodo();

  const handleQuickAdd = async (data: TodoData): Promise<void> => {
    try {
      await createMutation.mutateAsync(data);
      Toast.show({
        type: 'success',
        text1: 'Task created',
        text2: 'Your task has been added successfully',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('[handleQuickAdd] Failed to create task:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to create task',
        text2: 'Please try again',
        position: 'bottom',
      });
      throw error;
    }
  };

  const handleTodoPress = (todo: Todo): void => {
    setSelectedTodo(todo);
    openPreviewSheet(todo.id);
  };

  const handleEditFromPreview = (): void => {
    if (selectedTodo) {
      openEditSheet(selectedTodo.id);
    }
  };

  const handleToggle = async (id: string): Promise<void> => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to toggle task',
        text2: 'Please try again',
        position: 'bottom',
      });
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async (): Promise<void> => {
          try {
            await deleteMutation.mutateAsync(id);
            Toast.show({
              type: 'success',
              text1: 'Task deleted',
              text2: 'Your task has been removed',
              position: 'bottom',
              visibilityTime: 2000,
            });
          } catch {
            Toast.show({
              type: 'error',
              text1: 'Failed to delete task',
              text2: 'Please try again',
              position: 'bottom',
            });
          }
        },
      },
    ]);
  };

  const handleSave = async (id: string, data: Partial<TodoData>): Promise<void> => {
    try {
      await updateMutation.mutateAsync({ id, data });
      closeBottomSheet();
      setSelectedTodo(null);
      Toast.show({
        type: 'success',
        text1: 'Task updated',
        text2: 'Your changes have been saved',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to update task',
        text2: 'Please try again',
        position: 'bottom',
      });
    }
  };

  const handleCloseBottomSheet = (): void => {
    closeBottomSheet();
    setSelectedTodo(null);
  };

  return (
    <AuthGate>
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="heading" style={styles.title}>
                My TODOs
              </Text>
              <Text variant="body" style={styles.subtitle}>
                Your secure task list
              </Text>
            </View>

            <TodoList
              onTodoPress={handleTodoPress}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />

            <View style={styles.quickAddContainer}>
              <QuickAddInput onAdd={handleQuickAdd} isLoading={createMutation.isPending} />
            </View>

            <TodoPreviewBottomSheet
              isOpen={bottomSheetMode === 'preview'}
              todo={selectedTodo}
              onClose={handleCloseBottomSheet}
              onEdit={handleEditFromPreview}
            />

            <TodoEditBottomSheet
              isOpen={bottomSheetMode === 'edit'}
              todo={selectedTodo}
              onClose={handleCloseBottomSheet}
              onSave={handleSave}
              isSaving={updateMutation.isPending}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthGate>
  );
}
