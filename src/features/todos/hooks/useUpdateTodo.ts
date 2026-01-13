import { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { todoService } from '../services/todo.service';
import type { Todo, UpdateTodoData } from '../types/todo.types';

interface UpdateTodoVariables {
  id: string;
  data: UpdateTodoData;
}

export const useUpdateTodo = (): UseMutationResult<Todo, Error, UpdateTodoVariables> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTodoVariables) => todoService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODOS });

      const previousTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.TODOS);

      queryClient.setQueryData<Todo[]>(QUERY_KEYS.TODOS, old => {
        if (!old) return old;
        return old.map(todo =>
          todo.id === id
            ? {
                ...todo,
                ...data,
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
