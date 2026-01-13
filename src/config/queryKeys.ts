export const QUERY_KEYS = {
  TODOS: ['todos'] as const,
  TODO: (id: string) => ['todos', id] as const,
} as const;
