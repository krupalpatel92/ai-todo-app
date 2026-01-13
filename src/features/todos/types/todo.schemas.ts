import { z } from 'zod';

export const todoDataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
});

export const updateTodoDataSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .optional(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  completed: z.boolean().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional(),
});

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  completed: z.boolean(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type TodoDataInput = z.infer<typeof todoDataSchema>;
export type UpdateTodoDataInput = z.infer<typeof updateTodoDataSchema>;
