import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { todoService } from '../services/todo.service';
import type { Todo, TodosByCategory, DateCategory } from '../types/todo.types';

export const useTodos = (): UseQueryResult<Todo[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.TODOS,
    queryFn: () => todoService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTodosByCategory = (category: DateCategory): UseQueryResult<Todo[], Error> => {
  return useQuery({
    queryKey: QUERY_KEYS.TODOS_BY_CATEGORY(category),
    queryFn: () => todoService.getByCategory(category),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTodosCategorized = (): UseQueryResult<TodosByCategory, Error> => {
  return useQuery<TodosByCategory>({
    queryKey: QUERY_KEYS.TODOS_CATEGORIZED,
    queryFn: () => todoService.getAllCategorized(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTodo = (id: string): UseQueryResult<Todo | null, Error> => {
  return useQuery<Todo | null>({
    queryKey: QUERY_KEYS.TODO_DETAIL(id),
    queryFn: () => todoService.getById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};
