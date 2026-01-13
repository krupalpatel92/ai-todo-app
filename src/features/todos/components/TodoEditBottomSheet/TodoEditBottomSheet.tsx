import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, Button } from '@/shared/components/primitives';
import { todoDataSchema } from '../../types/todo.schemas';
import { formatDateToYYYYMMDD, parseDateFromYYYYMMDD } from '../../lib/date.utils';
import type { Todo, TodoData } from '../../types/todo.types';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { styles } from './TodoEditBottomSheet.styles';

interface TodoEditBottomSheetProps {
  isOpen: boolean;
  todo: Todo | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<TodoData>) => void;
  isSaving?: boolean;
}

export const TodoEditBottomSheet = React.memo<TodoEditBottomSheetProps>(
  ({ isOpen, todo, onClose, onSave, isSaving = false }) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['80%', '95%'], []);
    const isClosingProgrammatically = useRef(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);

    const {
      control,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors },
    } = useForm<TodoData>({
      resolver: zodResolver(todoDataSchema),
      defaultValues: {
        title: '',
        description: '',
        dueDate: '',
      },
    });

    const currentDueDate = watch('dueDate');

    useEffect(() => {
      if (isKeyboardActive || showDatePicker) {
        bottomSheetRef.current?.snapToIndex(1);
      } else if (isOpen) {
        bottomSheetRef.current?.snapToIndex(0);
      }
    }, [isKeyboardActive, showDatePicker, isOpen]);

    useEffect(() => {
      if (isOpen && todo) {
        isClosingProgrammatically.current = false;
        reset({
          title: todo.title,
          description: todo.description || '',
          dueDate: todo.dueDate,
        });

        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(0);
        }, 100);
      } else if (!isOpen) {
        isClosingProgrammatically.current = true;
        bottomSheetRef.current?.close();
      }
    }, [isOpen, todo, reset]);

    const handleSave = (data: TodoData): void => {
      if (!todo) return;
      onSave(todo.id, data);
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

    const handleDatePress = (): void => {
      const dateToSet = currentDueDate ? parseDateFromYYYYMMDD(currentDueDate) : new Date();
      setTempDate(dateToSet);
      setIsKeyboardActive(false);
      setTimeout(() => {
        setShowDatePicker(true);
      }, 100);
    };

    const handleDateChange = (event: DateTimePickerEvent, date?: Date): void => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
        if (event.type === 'set' && date) {
          const formattedDate = formatDateToYYYYMMDD(date);
          setValue('dueDate', formattedDate, { shouldValidate: true });
        }
      } else if (date) {
        setTempDate(date);
      }
    };

    const handleIOSDateConfirm = (): void => {
      const formattedDate = formatDateToYYYYMMDD(tempDate);
      setValue('dueDate', formattedDate, { shouldValidate: true });
      setShowDatePicker(false);
    };

    const handleIOSDateCancel = (): void => {
      setShowDatePicker(false);
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
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            animateOnMount={true}
          >
            <View style={styles.contentWrapper}>
              <BottomSheetScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={!showDatePicker}
              >
                <View style={styles.header}>
                  <Text variant="heading" style={styles.title}>
                    Edit Task
                  </Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.form}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Title *</Text>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <BottomSheetTextInput
                          style={[styles.input, errors.title && styles.inputError]}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setIsKeyboardActive(true)}
                          onBlur={() => {
                            onBlur();
                            setIsKeyboardActive(false);
                          }}
                          placeholder="Task title"
                          placeholderTextColor="#9ca3af"
                        />
                      )}
                    />
                    {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Description</Text>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <BottomSheetTextInput
                          style={[
                            styles.input,
                            styles.textArea,
                            errors.description && styles.inputError,
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onFocus={() => setIsKeyboardActive(true)}
                          onBlur={() => {
                            onBlur();
                            setIsKeyboardActive(false);
                          }}
                          placeholder="Add details..."
                          placeholderTextColor="#9ca3af"
                          multiline
                          numberOfLines={4}
                          textAlignVertical="top"
                        />
                      )}
                    />
                    {errors.description && (
                      <Text style={styles.errorText}>{errors.description.message}</Text>
                    )}
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Due Date *</Text>
                    <TouchableOpacity
                      style={[styles.datePickerButton, errors.dueDate && styles.inputError]}
                      onPress={handleDatePress}
                      disabled={showDatePicker}
                    >
                      <Text style={styles.datePickerText}>{currentDueDate || 'Select date'}</Text>
                      <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    {errors.dueDate && (
                      <Text style={styles.errorText}>{errors.dueDate.message}</Text>
                    )}
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      variant="secondary"
                      size="lg"
                      onPress={onClose}
                      disabled={isSaving}
                      style={styles.button}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onPress={handleSubmit(handleSave)}
                      isLoading={isSaving}
                      disabled={isSaving}
                      style={styles.button}
                    >
                      Save
                    </Button>
                  </View>
                </View>
              </BottomSheetScrollView>

              {showDatePicker && Platform.OS === 'ios' && (
                <View style={styles.datePickerOverlay}>
                  <TouchableOpacity
                    style={styles.datePickerBackdrop}
                    onPress={handleIOSDateCancel}
                    activeOpacity={1}
                  />
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerHeader}>
                      <TouchableOpacity onPress={handleIOSDateCancel}>
                        <Text style={styles.datePickerHeaderButton}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleIOSDateConfirm}>
                        <Text
                          style={[styles.datePickerHeaderButton, styles.datePickerHeaderButtonDone]}
                        >
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      style={styles.iosDatePicker}
                    />
                  </View>
                </View>
              )}
            </View>

            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </BottomSheet>
        )}
      </>
    );
  }
);

TodoEditBottomSheet.displayName = 'TodoEditBottomSheet';
