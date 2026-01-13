import { useState, useCallback } from 'react';
import { biometricService } from '../services/biometric.service';
import { BiometricAuthResult, BiometricAvailability } from '../types/auth.types';

interface UseBiometricAuthReturn {
  isAuthenticating: boolean;
  availability: BiometricAvailability | null;
  isChecking: boolean;
  authenticate: (promptMessage?: string) => Promise<BiometricAuthResult>;
  checkAvailability: () => Promise<BiometricAvailability>;
  getAuthenticationMessage: () => Promise<string>;
}

export const useBiometricAuth = (): UseBiometricAuthReturn => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<BiometricAvailability | null>(null);

  const checkAvailability = useCallback(async (): Promise<BiometricAvailability> => {
    setIsChecking(true);
    try {
      const result = await biometricService.checkAvailability();
      setAvailability(result);
      return result;
    } catch (error) {
      const errorResult: BiometricAvailability = {
        isAvailable: false,
        isEnrolled: false,
        error: error instanceof Error ? error.message : 'Failed to check availability',
      };
      setAvailability(errorResult);
      return errorResult;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const authenticate = useCallback(async (promptMessage?: string): Promise<BiometricAuthResult> => {
    setIsAuthenticating(true);
    try {
      const result = await biometricService.authenticate(promptMessage);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const getAuthenticationMessage = useCallback(async (): Promise<string> => {
    try {
      return await biometricService.getAuthenticationMessage();
    } catch {
      return 'Authentication method unavailable';
    }
  }, []);

  return {
    isAuthenticating,
    availability,
    isChecking,
    authenticate,
    checkAvailability,
    getAuthenticationMessage,
  };
};
