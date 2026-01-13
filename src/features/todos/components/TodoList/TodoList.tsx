import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/shared/components/primitives';
import { LoadingSpinner, EmptyState, CollapsibleSection } from '@/shared/components/patterns';
import { useTodosCategorized } from '../../hooks/useTodos';
import { useTodoStore } from '../../store/todo.store';
import { TodoItem } from '../TodoItem';
import type { Todo } from '../../types/todo.types';
import { styles } from './TodoList.styles';

interface TodoListProps {
  onTodoPress: (todo: Todo) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = React.memo<TodoListProps>(({ onTodoPress, onToggle, onDelete }) => {
  const { data: categorizedTodos, isLoading, error } = useTodosCategorized();
  const { collapsedSections, toggleSection } = useTodoStore();

  const totalTodos = categorizedTodos
    ? categorizedTodos.today.length +
      categorizedTodos.tomorrow.length +
      categorizedTodos.other.length
    : 0;

  return (
    <>
      {isLoading && (
        <View style={styles.centerContainer}>
          <LoadingSpinner size="large" />
        </View>
      )}

      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load todos</Text>
        </View>
      )}

      {!isLoading && !error && categorizedTodos && totalTodos === 0 && (
        <View style={styles.centerContainer}>
          <EmptyState title="No tasks yet" message="Add your first TODO to get started!" />
        </View>
      )}

      {!isLoading && !error && categorizedTodos && totalTodos > 0 && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <CollapsibleSection
            title="Today"
            count={categorizedTodos.today.length}
            collapsed={collapsedSections.today}
            onToggle={() => toggleSection('today')}
          >
            {categorizedTodos.today.length > 0 ? (
              categorizedTodos.today.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onPress={() => onTodoPress(todo)}
                  onToggle={() => onToggle(todo.id)}
                  onDelete={() => onDelete(todo.id)}
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>No tasks for today</Text>
              </View>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Tomorrow"
            count={categorizedTodos.tomorrow.length}
            collapsed={collapsedSections.tomorrow}
            onToggle={() => toggleSection('tomorrow')}
          >
            {categorizedTodos.tomorrow.length > 0 ? (
              categorizedTodos.tomorrow.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onPress={() => onTodoPress(todo)}
                  onToggle={() => onToggle(todo.id)}
                  onDelete={() => onDelete(todo.id)}
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>No tasks for tomorrow</Text>
              </View>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Other"
            count={categorizedTodos.other.length}
            collapsed={collapsedSections.other}
            onToggle={() => toggleSection('other')}
          >
            {categorizedTodos.other.length > 0 ? (
              categorizedTodos.other.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onPress={() => onTodoPress(todo)}
                  onToggle={() => onToggle(todo.id)}
                  onDelete={() => onDelete(todo.id)}
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptySectionText}>No other tasks</Text>
              </View>
            )}
          </CollapsibleSection>
        </ScrollView>
      )}
    </>
  );
});

TodoList.displayName = 'TodoList';
