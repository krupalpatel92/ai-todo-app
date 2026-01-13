export const APP_CONFIG = {
  APP_NAME: 'Paidy Todo',
  APP_VERSION: '1.0.0',
} as const;

export const STORAGE_KEYS = {
  TODOS: '@paidy_todo:todos',
  USER_PREFERENCES: '@paidy_todo:preferences',
} as const;

export const QUERY_KEYS = {
  TODOS: ['todos'] as const,
  TODO_DETAIL: (id: string) => ['todos', id] as const,
  TODOS_BY_CATEGORY: (category: string) => ['todos', 'category', category] as const,
  TODOS_CATEGORIZED: ['todos', 'categorized'] as const,
} as const;
