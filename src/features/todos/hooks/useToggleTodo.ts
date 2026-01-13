import { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { todoService } from '../services/todo.service';
import type { Todo } from '../types/todo.types';

export const useToggleTodo = (): UseMutationResult<Todo, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoService.toggleComplete(id),
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODOS });

      const previousTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.TODOS);

      queryClient.setQueryData<Todo[]>(QUERY_KEYS.TODOS, old => {
        if (!old) return old;
        return old.map(todo =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
                updatedAt: Date.now(),
              }
            : todo
        );
      });

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(QUERY_KEYS.TODOS, context.previousTodos);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS_CATEGORIZED });
    },
  });
};
