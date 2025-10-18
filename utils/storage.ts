/**
 * A safe storage utility that falls back to in-memory storage if localStorage is not available.
 */

// A simple in-memory store that mimics the Storage API
const createInMemoryStorage = (): Storage => {
  const store: { [key: string]: string } = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    key: (index: number): string | null => Object.keys(store)[index] || null,
    get length(): number {
      return Object.keys(store).length;
    },
  };
};

const getSafeStorage = (): Storage => {
  try {
    const storage = window.localStorage;
    // Check if localStorage is actually usable. It can be disabled in some browsers/modes.
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch (e) {
    console.warn(
      'localStorage is not available due to security restrictions. ' +
      'Using temporary in-memory storage. Data will not be persisted across sessions.'
    );
    return createInMemoryStorage();
  }
};

const storage: Storage = getSafeStorage();

export default storage;
