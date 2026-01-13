import { format, parse, addDays, isToday, isTomorrow, compareAsc } from 'date-fns';
import type { DateCategory, Todo, TodosByCategory } from '../types/todo.types';

const DATE_FORMAT = 'yyyy-MM-dd';

export const formatDate = (date: Date): string => {
  return format(date, DATE_FORMAT);
};

export const formatDateToYYYYMMDD = (date: Date): string => {
  return formatDate(date);
};

export const parseDateFromYYYYMMDD = (dateString: string): Date => {
  return parse(dateString, DATE_FORMAT, new Date());
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const getTomorrowDate = (): string => {
  return formatDate(addDays(new Date(), 1));
};

export const getDateCategory = (dueDate: string): DateCategory => {
  const date = parseDateFromYYYYMMDD(dueDate);

  if (isToday(date)) {
    return 'today';
  }
  if (isTomorrow(date)) {
    return 'tomorrow';
  }
  return 'other';
};

export const categorizeTodos = (todos: Todo[]): TodosByCategory => {
  const categorized: TodosByCategory = {
    today: [],
    tomorrow: [],
    other: [],
  };

  todos.forEach(todo => {
    const category = getDateCategory(todo.dueDate);
    categorized[category].push(todo);
  });

  return categorized;
};

export const sortTodosByDate = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    const dateA = parseDateFromYYYYMMDD(a.dueDate);
    const dateB = parseDateFromYYYYMMDD(b.dueDate);

    const comparison = compareAsc(dateA, dateB);

    if (comparison !== 0) {
      return comparison;
    }

    return a.createdAt - b.createdAt;
  });
};
