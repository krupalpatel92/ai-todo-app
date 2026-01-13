import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateTodo } from '@/features/todos/hooks/useCreateTodo';
import { useUpdateTodo } from '@/features/todos/hooks/useUpdateTodo';
import { useDeleteTodo } from '@/features/todos/hooks/useDeleteTodo';
import { todoService } from '@/features/todos/services/todo.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo, TodoData } from '@/features/todos/types/todo.types';

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

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-456'),
}));

describe('useCreateTodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should create a todo successfully', async () => {
    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateTodo(), {
      wrapper: createWrapper(queryClient),
    });

    const todoData: TodoData = {
      title: 'New Todo',
      description: 'Test description',
      dueDate: '2026-01-15',
    };

    await act(async () => {
      result.current.mutate(todoData);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.title).toBe('New Todo');
    expect(result.current.data?.id).toBe('test-uuid-456');
  });

  it('should handle optimistic updates', async () => {
    const existingTodos: Todo[] = [
      {
        id: '1',
        title: 'Existing Todo',
        description: '',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify(existingTodos));

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useCreateTodo(), {
      wrapper: createWrapper(queryClient),
    });

    const todoData: TodoData = {
      title: 'New Todo',
      description: 'Test',
      dueDate: '2026-01-15',
    };

    await act(async () => {
      result.current.mutate(todoData);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const allTodos = await todoService.getAll();
    expect(allTodos).toHaveLength(2);
  });

  it('should rollback on error', async () => {
    const queryClient = createTestQueryClient();

    queryClient.setQueryData(
      ['todos'],
      [
        {
          id: '1',
          title: 'Existing Todo',
          description: '',
          completed: false,
          dueDate: '2026-01-14',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ]
    );

    jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error('Create failed'));

    const { result } = renderHook(() => useCreateTodo(), {
      wrapper: createWrapper(queryClient),
    });

    const todoData: TodoData = {
      title: 'New Todo',
      description: 'Test',
      dueDate: '2026-01-15',
    };

    await act(async () => {
      result.current.mutate(todoData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    const cachedTodos = queryClient.getQueryData<Todo[]>(['todos']);
    expect(cachedTodos).toHaveLength(1);
    expect(cachedTodos?.[0].title).toBe('Existing Todo');
  });
});

describe('useUpdateTodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should update a todo successfully', async () => {
    const existingTodo: Todo = {
      id: '1',
      title: 'Original Title',
      description: 'Original description',
      completed: false,
      dueDate: '2026-01-14',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify([existingTodo]));

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUpdateTodo(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        id: '1',
        data: { title: 'Updated Title' },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.title).toBe('Updated Title');
  });

  it('should handle optimistic updates correctly', async () => {
    const existingTodo: Todo = {
      id: '1',
      title: 'Original Title',
      description: 'Original description',
      completed: false,
      dueDate: '2026-01-14',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(['todos'], [existingTodo]);

    const { result } = renderHook(() => useUpdateTodo(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        id: '1',
        data: { title: 'Updated Title' },
      });
    });

    const cachedTodos = queryClient.getQueryData<Todo[]>(['todos']);
    expect(cachedTodos?.[0].title).toBe('Updated Title');
  });

  it('should rollback on error', async () => {
    const existingTodo: Todo = {
      id: '1',
      title: 'Original Title',
      description: 'Original description',
      completed: false,
      dueDate: '2026-01-14',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(['todos'], [existingTodo]);

    jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error('Update failed'));

    const { result } = renderHook(() => useUpdateTodo(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        id: '1',
        data: { title: 'Updated Title' },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    const cachedTodos = queryClient.getQueryData<Todo[]>(['todos']);
    expect(cachedTodos?.[0].title).toBe('Original Title');
  });
});

describe('useDeleteTodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should delete a todo successfully', async () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Todo 1',
        description: '',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '2',
        title: 'Todo 2',
        description: '',
        completed: false,
        dueDate: '2026-01-15',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify(todos));

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useDeleteTodo(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate('1');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const remainingTodos = await todoService.getAll();
    expect(remainingTodos).toHaveLength(1);
    expect(remainingTodos[0].id).toBe('2');
  });

  it('should handle optimistic delete', async () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Todo 1',
        description: '',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '2',
        title: 'Todo 2',
        description: '',
        completed: false,
        dueDate: '2026-01-15',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(['todos'], todos);

    const { result } = renderHook(() => useDeleteTodo(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate('1');
    });

    const cachedTodos = queryClient.getQueryData<Todo[]>(['todos']);
    expect(cachedTodos).toHaveLength(1);
    expect(cachedTodos?.[0].id).toBe('2');
  });

  it('should rollback on error', async () => {
    const todos: Todo[] = [
      {
        id: '1',
        title: 'Todo 1',
        description: '',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(['todos'], todos);

    jest.spyOn(todoService, 'delete').mockRejectedValueOnce(new Error('Delete failed'));

    const { result } = renderHook(() => useDeleteTodo(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate('1');
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    const cachedTodos = queryClient.getQueryData<Todo[]>(['todos']);
    expect(cachedTodos).toHaveLength(1);
    expect(cachedTodos?.[0].id).toBe('1');
  });
});
