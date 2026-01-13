import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { todoService } from '../services/todo.service';
import type { Todo, TodoData } from '../types/todo.types';

export const useCreateTodo = (): UseMutationResult<Todo, Error, TodoData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoData) => todoService.create(data),
    onMutate: async newTodo => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODOS });

      const previousTodos = queryClient.getQueryData<Todo[]>(QUERY_KEYS.TODOS);

      const optimisticTodo: Todo = {
        id: `temp-${Date.now()}`,
        title: newTodo.title,
        description: newTodo.description,
        completed: false,
        dueDate: newTodo.dueDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      queryClient.setQueryData<Todo[]>(QUERY_KEYS.TODOS, old => {
        return old ? [...old, optimisticTodo] : [optimisticTodo];
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
