import { getItem, setItem } from '@/shared/lib/storage';
import { AuthSetupState } from '../types/auth.types';

const AUTH_SETUP_KEY = '@paidy_todo:auth_setup_complete';

class AuthSetupService {
  async getSetupState(): Promise<AuthSetupState> {
    try {
      const state = await getItem<AuthSetupState>(AUTH_SETUP_KEY);
      if (!state) {
        return {
          isSetupComplete: false,
        };
      }
      return state;
    } catch {
      return {
        isSetupComplete: false,
      };
    }
  }

  async markSetupComplete(): Promise<void> {
    const state: AuthSetupState = {
      isSetupComplete: true,
      setupDate: new Date().toISOString(),
    };
    await setItem(AUTH_SETUP_KEY, state);
  }

  async resetSetup(): Promise<void> {
    const state: AuthSetupState = {
      isSetupComplete: false,
    };
    await setItem(AUTH_SETUP_KEY, state);
  }
}

export const authSetupService = new AuthSetupService();
