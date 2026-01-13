import { useEffect, useState, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { biometricService } from '../services/biometric.service';

interface UseAppAuthGateReturn {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  retry: () => Promise<void>;
}

export const useAppAuthGate = (): UseAppAuthGateReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const appState = useRef(AppState.currentState);

  const performAuthentication = useCallback(async (): Promise<void> => {
    setIsAuthenticating(true);
    const result = await biometricService.authenticate('Authenticate to access your TODOs');

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsAuthenticating(false);
  }, []);

  const authenticateOnMount = useCallback(async (): Promise<void> => {
    await performAuthentication();
  }, [performAuthentication]);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus): Promise<void> => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setIsAuthenticated(false);
        await performAuthentication();
      }
      appState.current = nextAppState;
    },
    [performAuthentication]
  );

  useEffect(() => {
    authenticateOnMount();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return (): void => {
      subscription.remove();
    };
  }, [authenticateOnMount, handleAppStateChange]);

  const retry = useCallback(async (): Promise<void> => {
    await performAuthentication();
  }, [performAuthentication]);

  return {
    isAuthenticated,
    isAuthenticating,
    retry,
  };
};
