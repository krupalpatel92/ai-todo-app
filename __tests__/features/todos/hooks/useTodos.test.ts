import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTodos, useTodo } from '@/features/todos/hooks/useTodos';
import { todoService } from '@/features/todos/services/todo.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo } from '@/features/todos/types/todo.types';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useTodos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should fetch todos successfully', async () => {
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: 'Test Todo',
        description: 'Test description',
        completed: false,
        dueDate: '2026-01-15',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify(mockTodos));

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTodos(), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].title).toBe('Test Todo');
  });

  it('should return empty array when no todos exist', async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTodos(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('should handle errors when fetching todos', async () => {
    jest.spyOn(todoService, 'getAll').mockRejectedValueOnce(new Error('Failed to fetch todos'));

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTodos(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useTodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should fetch a single todo by id', async () => {
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: 'Test Todo',
        description: 'Test description',
        completed: false,
        dueDate: '2026-01-15',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '2',
        title: 'Another Todo',
        description: 'Another description',
        completed: false,
        dueDate: '2026-01-16',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify(mockTodos));

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTodo('1'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe('1');
    expect(result.current.data?.title).toBe('Test Todo');
  });

  it('should return null when todo not found', async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTodo('nonexistent-id'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  it('should not fetch when id is empty', async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTodo(''), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
