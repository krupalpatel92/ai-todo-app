import AsyncStorage from '@react-native-async-storage/async-storage';
import { todoService } from '@/features/todos/services/todo.service';
import type { TodoData, Todo } from '@/features/todos/types/todo.types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('TodoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('getAll', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await todoService.getAll();
      expect(todos).toEqual([]);
    });

    it('should return all todos sorted by date', async () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          title: 'Todo 1',
          description: '',
          completed: false,
          dueDate: '2026-01-15',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: '2',
          title: 'Todo 2',
          description: '',
          completed: false,
          dueDate: '2026-01-13',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify(mockTodos));

      const todos = await todoService.getAll();
      expect(todos).toHaveLength(2);
      expect(todos[0].dueDate).toBe('2026-01-13');
      expect(todos[1].dueDate).toBe('2026-01-15');
    });

    it('should throw error when storage fails', async () => {
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'));

      await expect(todoService.getAll()).rejects.toThrow('Failed to fetch todos');
    });
  });

  describe('create', () => {
    it('should create a new todo with correct properties', async () => {
      const todoData: TodoData = {
        title: 'New Todo',
        description: 'Test description',
        dueDate: '2026-01-15',
      };

      const createdTodo = await todoService.create(todoData);

      expect(createdTodo).toMatchObject({
        id: 'test-uuid-123',
        title: 'New Todo',
        description: 'Test description',
        completed: false,
        dueDate: '2026-01-15',
      });
      expect(createdTodo.createdAt).toBeDefined();
      expect(createdTodo.updatedAt).toBeDefined();
    });

    it('should add todo to existing todos in storage', async () => {
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

      const todoData: TodoData = {
        title: 'New Todo',
        description: 'Test',
        dueDate: '2026-01-15',
      };

      await todoService.create(todoData);

      const todos = await todoService.getAll();
      expect(todos).toHaveLength(2);
    });

    it('should throw error when storage fails', async () => {
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'));

      const todoData: TodoData = {
        title: 'New Todo',
        description: 'Test',
        dueDate: '2026-01-15',
      };

      await expect(todoService.create(todoData)).rejects.toThrow('Failed to create todo');
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
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

      const updatedTodo = await todoService.update('1', {
        title: 'Updated Title',
        description: 'Updated description',
      });

      expect(updatedTodo.title).toBe('Updated Title');
      expect(updatedTodo.description).toBe('Updated description');
      expect(updatedTodo.updatedAt).toBeGreaterThan(existingTodo.updatedAt);
    });

    it('should throw error when todo not found', async () => {
      await expect(todoService.update('nonexistent-id', { title: 'Test' })).rejects.toThrow(
        'Todo with id nonexistent-id not found'
      );
    });

    it('should preserve original properties when updating', async () => {
      const existingTodo: Todo = {
        id: '1',
        title: 'Original Title',
        description: 'Original description',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: 1234567890,
        updatedAt: 1234567890,
      };

      await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify([existingTodo]));

      const updatedTodo = await todoService.update('1', { title: 'Updated Title' });

      expect(updatedTodo.id).toBe('1');
      expect(updatedTodo.description).toBe('Original description');
      expect(updatedTodo.createdAt).toBe(1234567890);
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', async () => {
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

      await todoService.delete('1');

      const remainingTodos = await todoService.getAll();
      expect(remainingTodos).toHaveLength(1);
      expect(remainingTodos[0].id).toBe('2');
    });

    it('should throw error when todo not found', async () => {
      await expect(todoService.delete('nonexistent-id')).rejects.toThrow(
        'Todo with id nonexistent-id not found'
      );
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', async () => {
      const todo: Todo = {
        id: '1',
        title: 'Todo 1',
        description: '',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify([todo]));

      const toggledTodo = await todoService.toggleComplete('1');
      expect(toggledTodo.completed).toBe(true);

      const toggledAgain = await todoService.toggleComplete('1');
      expect(toggledAgain.completed).toBe(false);
    });

    it('should throw error when todo not found', async () => {
      await expect(todoService.toggleComplete('nonexistent-id')).rejects.toThrow(
        'Todo with id nonexistent-id not found'
      );
    });
  });

  describe('getById', () => {
    it('should return todo when found', async () => {
      const todo: Todo = {
        id: '1',
        title: 'Todo 1',
        description: '',
        completed: false,
        dueDate: '2026-01-14',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem('@paidy_todo:todos', JSON.stringify([todo]));

      const foundTodo = await todoService.getById('1');
      expect(foundTodo).toEqual(todo);
    });

    it('should return null when todo not found', async () => {
      const foundTodo = await todoService.getById('nonexistent-id');
      expect(foundTodo).toBeNull();
    });
  });

  describe('deleteAll', () => {
    it('should delete all todos', async () => {
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

      await todoService.deleteAll();

      const remainingTodos = await todoService.getAll();
      expect(remainingTodos).toEqual([]);
    });
  });
});
