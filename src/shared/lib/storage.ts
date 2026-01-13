import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    throw new StorageError(`Failed to get item with key "${key}"`, error);
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    throw new StorageError(`Failed to set item with key "${key}"`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new StorageError(`Failed to remove item with key "${key}"`, error);
  }
}

export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    throw new StorageError('Failed to clear storage', error);
  }
}

export async function getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  } catch (error) {
    throw new StorageError('Failed to get all keys', error);
  }
}

export async function multiGet<T>(keys: string[]): Promise<Record<string, T | null>> {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};

    pairs.forEach(([key, value]: readonly [string, string | null]) => {
      if (value !== null) {
        try {
          result[key] = JSON.parse(value) as T;
        } catch {
          result[key] = null;
        }
      } else {
        result[key] = null;
      }
    });

    return result;
  } catch (error) {
    throw new StorageError('Failed to get multiple items', error);
  }
}
