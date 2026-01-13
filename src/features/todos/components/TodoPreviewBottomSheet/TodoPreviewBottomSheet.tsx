import React, { useEffect, useMemo, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Text } from '@/shared/components/primitives';
import type { Todo } from '../../types/todo.types';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { styles } from './TodoPreviewBottomSheet.styles';

interface TodoPreviewBottomSheetProps {
  isOpen: boolean;
  todo: Todo | null;
  onClose: () => void;
  onEdit: () => void;
}

export const TodoPreviewBottomSheet = React.memo<TodoPreviewBottomSheetProps>(
  ({ isOpen, todo, onClose, onEdit }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%'], []);
    const isClosingProgrammatically = useRef(false);

    useEffect(() => {
      if (isOpen && todo) {
        isClosingProgrammatically.current = false;
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(0);
        }, 100);
      } else if (!isOpen) {
        isClosingProgrammatically.current = true;
        bottomSheetRef.current?.close();
      }
    }, [isOpen, todo]);

    const handleEdit = (): void => {
      onEdit();
    };

    const handleClose = (): void => {
      onClose();
    };

    const handleSheetClose = (): void => {
      // Prevent calling onClose during programmatic closure (mode switch)
      if (!isClosingProgrammatically.current) {
        onClose();
      } else {
        isClosingProgrammatically.current = false;
      }
    };

    const renderBackdrop = (props: BottomSheetBackdropProps): React.JSX.Element => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    );

    return (
      <>
        {todo && (
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={handleSheetClose}
            backdropComponent={renderBackdrop}
          >
            <BottomSheetScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainer}
            >
              <View style={styles.header}>
                <Text variant="heading" style={styles.headerTitle}>
                  Task Details
                </Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                    <Ionicons name="create-outline" size={24} color="#2563eb" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.content}>
                <View style={styles.section}>
                  <Text style={styles.label}>Title</Text>
                  <Text style={styles.value}>{todo.title}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={styles.value}>{todo.description || 'No description'}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Due Date</Text>
                  <Text style={styles.value}>{todo.dueDate}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Status</Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        todo.completed ? styles.statusCompleted : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          todo.completed ? styles.statusTextCompleted : styles.statusTextPending,
                        ]}
                      >
                        {todo.completed ? 'Completed' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        )}
      </>
    );
  }
);

TodoPreviewBottomSheet.displayName = 'TodoPreviewBottomSheet';
