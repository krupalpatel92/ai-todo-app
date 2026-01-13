export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  createdAt: number;
  updatedAt: number;
}

export type DateCategory = 'today' | 'tomorrow' | 'other';

export interface TodoData {
  title: string;
  description?: string;
  dueDate: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

export interface TodosByCategory {
  today: Todo[];
  tomorrow: Todo[];
  other: Todo[];
}
