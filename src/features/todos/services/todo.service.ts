import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from '@/shared/lib/storage';
import type {
  Todo,
  TodoData,
  UpdateTodoData,
  TodosByCategory,
  DateCategory,
} from '../types/todo.types';
import { categorizeTodos, sortTodosByDate } from '../lib/date.utils';

const STORAGE_KEY = '@paidy_todo:todos';

class TodoService {
  async getAll(): Promise<Todo[]> {
    try {
      const todos = await getItem<Todo[]>(STORAGE_KEY);
      if (!todos) return [];
      return sortTodosByDate(todos);
    } catch {
      throw new Error('Failed to fetch todos');
    }
  }

  async getByCategory(category: DateCategory): Promise<Todo[]> {
    try {
      const todos = await this.getAll();
      const categorized = categorizeTodos(todos);
      return categorized[category];
    } catch {
      throw new Error(`Failed to fetch todos for category: ${category}`);
    }
  }

  async getAllCategorized(): Promise<TodosByCategory> {
    try {
      const todos = await this.getAll();
      return categorizeTodos(todos);
    } catch {
      throw new Error('Failed to categorize todos');
    }
  }

  async getById(id: string): Promise<Todo | null> {
    try {
      const todos = await this.getAll();
      return todos.find(todo => todo.id === id) || null;
    } catch {
      throw new Error(`Failed to fetch todo with id: ${id}`);
    }
  }

  async create(data: TodoData): Promise<Todo> {
    try {
      const todos = await this.getAll();
      const now = Date.now();

      const newTodo: Todo = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        completed: false,
        dueDate: data.dueDate,
        createdAt: now,
        updatedAt: now,
      };

      const updatedTodos = [...todos, newTodo];
      await setItem(STORAGE_KEY, updatedTodos);

      return newTodo;
    } catch (error) {
      console.error('[TodoService.create] Error creating todo:', error);
      throw new Error('Failed to create todo');
    }
  }

  async update(id: string, data: UpdateTodoData): Promise<Todo> {
    try {
      const todos = await this.getAll();
      const todoIndex = todos.findIndex(todo => todo.id === id);

      if (todoIndex === -1) {
        throw new Error(`Todo with id ${id} not found`);
      }

      const updatedTodo: Todo = {
        ...todos[todoIndex],
        ...data,
        updatedAt: Date.now(),
      };

      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = updatedTodo;

      await setItem(STORAGE_KEY, updatedTodos);

      return updatedTodo;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update todo');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const todos = await this.getAll();
      const filteredTodos = todos.filter(todo => todo.id !== id);

      if (filteredTodos.length === todos.length) {
        throw new Error(`Todo with id ${id} not found`);
      }

      await setItem(STORAGE_KEY, filteredTodos);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete todo');
    }
  }

  async toggleComplete(id: string): Promise<Todo> {
    try {
      const todo = await this.getById(id);
      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }

      return await this.update(id, { completed: !todo.completed });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to toggle todo completion');
    }
  }

  async updateDueDate(id: string, dueDate: string): Promise<Todo> {
    try {
      return await this.update(id, { dueDate });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update todo due date');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await setItem(STORAGE_KEY, []);
    } catch {
      throw new Error('Failed to delete all todos');
    }
  }
}

export const todoService = new TodoService();
