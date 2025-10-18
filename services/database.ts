import { AdminCredentials } from '../types';
import storage from '../utils/storage';

const ADMIN_CREDS_KEY = 'adminCredentials';

const defaultCredentials: AdminCredentials = {
  username: 'admin',
  password: 'sarkari2025',
};

const authService = {
  getCredentials: (): AdminCredentials => {
    try {
        const creds = storage.getItem(ADMIN_CREDS_KEY);
        if (creds) {
            const parsed = JSON.parse(creds);
            // Basic validation
            if (parsed && typeof parsed.username === 'string' && typeof parsed.password === 'string') {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to parse credentials from storage", e);
    }
    
    // Set default credentials if none exist or are invalid
    try {
        storage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaultCredentials));
    } catch (e) {
        console.warn("Could not set default credentials in storage. Using temporary credentials.", e);
    }
    return defaultCredentials;
  },
  saveCredentials: (creds: AdminCredentials): void => {
    try {
      storage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
    } catch (e) {
        console.error("Failed to save credentials to storage", e);
    }
  },
};

export { authService };