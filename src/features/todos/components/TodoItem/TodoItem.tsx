import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Text } from '@/shared/components/primitives';
import type { Todo } from '../../types/todo.types';
import { styles } from './TodoItem.styles';

interface TodoItemProps {
  todo: Todo;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoItem = React.memo<TodoItemProps>(({ todo, onPress, onToggle, onDelete }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, {
      duration: 300,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: interpolate(scale.value, [0, 1], [0.8, 1], Extrapolate.CLAMP),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity style={styles.leftColumn} onPress={onPress} activeOpacity={0.7}>
        <Text
          variant="body"
          style={[styles.title, todo.completed && styles.titleCompleted]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text variant="body" style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            {todo.description}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.rightColumn}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={onToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="checkmark-circle"
            size={28}
            color={todo.completed ? '#22c55e' : '#d1d5db'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

TodoItem.displayName = 'TodoItem';
