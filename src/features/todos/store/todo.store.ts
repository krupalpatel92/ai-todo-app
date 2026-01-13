import { create } from 'zustand';
import type { DateCategory } from '../types/todo.types';

interface CollapsedSections {
  today: boolean;
  tomorrow: boolean;
  other: boolean;
}

type BottomSheetMode = 'preview' | 'edit' | null;

interface TodoStoreState {
  collapsedSections: CollapsedSections;
  selectedTodoId: string | null;
  bottomSheetMode: BottomSheetMode;
  quickAddValue: string;

  toggleSection: (category: DateCategory) => void;
  setSelectedTodo: (id: string | null) => void;
  openPreviewSheet: (todoId: string) => void;
  openEditSheet: (todoId?: string) => void;
  closeBottomSheet: () => void;
  setQuickAddValue: (value: string) => void;
  clearQuickAddValue: () => void;
}

export const useTodoStore = create<TodoStoreState>(set => ({
  collapsedSections: {
    today: false,
    tomorrow: false,
    other: false,
  },
  selectedTodoId: null,
  bottomSheetMode: null,
  quickAddValue: '',

  toggleSection: (category): void =>
    set(state => ({
      collapsedSections: {
        ...state.collapsedSections,
        [category]: !state.collapsedSections[category],
      },
    })),

  setSelectedTodo: (id): void =>
    set({
      selectedTodoId: id,
    }),

  openPreviewSheet: (todoId): void => {
    set({
      bottomSheetMode: 'preview',
      selectedTodoId: todoId,
    });
  },

  openEditSheet: (todoId): void => {
    set({
      bottomSheetMode: 'edit',
      selectedTodoId: todoId || null,
    });
  },

  closeBottomSheet: (): void => {
    set({
      bottomSheetMode: null,
      selectedTodoId: null,
    });
  },

  setQuickAddValue: (value): void =>
    set({
      quickAddValue: value,
    }),

  clearQuickAddValue: (): void =>
    set({
      quickAddValue: '',
    }),
}));
