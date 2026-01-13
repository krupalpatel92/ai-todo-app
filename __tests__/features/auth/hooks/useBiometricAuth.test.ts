import { renderHook, act } from '@testing-library/react-native';
import { useBiometricAuth } from '@/features/auth/hooks/useBiometricAuth';
import * as LocalAuthentication from 'expo-local-authentication';

jest.mock('expo-local-authentication');

describe('useBiometricAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAvailability', () => {
    it('should check biometric availability successfully', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);

      const { result } = renderHook(() => useBiometricAuth());

      expect(result.current.isChecking).toBe(false);
      expect(result.current.availability).toBeNull();

      let availabilityResult;
      await act(async () => {
        availabilityResult = await result.current.checkAvailability();
      });

      expect(availabilityResult).toEqual({
        isAvailable: true,
        isEnrolled: true,
        error: undefined,
      });
      expect(result.current.availability).toEqual({
        isAvailable: true,
        isEnrolled: true,
        error: undefined,
      });
      expect(result.current.isChecking).toBe(false);
    });

    it('should handle no hardware available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);

      const { result } = renderHook(() => useBiometricAuth());

      let availabilityResult;
      await act(async () => {
        availabilityResult = await result.current.checkAvailability();
      });

      expect(availabilityResult).toEqual({
        isAvailable: false,
        isEnrolled: false,
        error: 'Biometric hardware not available',
      });
    });

    it('should handle not enrolled', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(false);

      const { result } = renderHook(() => useBiometricAuth());

      let availabilityResult;
      await act(async () => {
        availabilityResult = await result.current.checkAvailability();
      });

      expect(availabilityResult).toEqual({
        isAvailable: false,
        isEnrolled: false,
        error: 'No biometric credentials enrolled',
      });
    });

    it('should handle errors during availability check', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockRejectedValue(
        new Error('Check failed')
      );

      const { result } = renderHook(() => useBiometricAuth());

      let availabilityResult:
        | Awaited<ReturnType<typeof result.current.checkAvailability>>
        | undefined;
      await act(async () => {
        availabilityResult = await result.current.checkAvailability();
      });

      expect(availabilityResult?.isAvailable).toBe(false);
      expect(availabilityResult?.error).toBe('Check failed');
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useBiometricAuth());

      expect(result.current.isAuthenticating).toBe(false);

      let authResult;
      await act(async () => {
        authResult = await result.current.authenticate('Test authentication');
      });

      expect(authResult).toEqual({
        success: true,
        error: undefined,
      });
      expect(result.current.isAuthenticating).toBe(false);
    });

    it('should handle authentication failure', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Authentication failed',
      });

      const { result } = renderHook(() => useBiometricAuth());

      let authResult;
      await act(async () => {
        authResult = await result.current.authenticate();
      });

      expect(authResult).toEqual({
        success: false,
        error: 'Authentication failed',
      });
    });

    it('should handle authentication cancellation', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: false,
        error: 'user_cancel',
      });

      const { result } = renderHook(() => useBiometricAuth());

      let authResult: Awaited<ReturnType<typeof result.current.authenticate>> | undefined;
      await act(async () => {
        authResult = await result.current.authenticate();
      });

      expect(authResult?.success).toBe(false);
      expect(authResult?.error).toBe('user_cancel');
    });

    it('should handle authentication errors', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockRejectedValue(
        new Error('Auth service unavailable')
      );

      const { result } = renderHook(() => useBiometricAuth());

      let authResult: Awaited<ReturnType<typeof result.current.authenticate>> | undefined;
      await act(async () => {
        authResult = await result.current.authenticate();
      });

      expect(authResult?.success).toBe(false);
      expect(authResult?.error).toBe('Auth service unavailable');
    });

    it('should use custom prompt message', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useBiometricAuth());

      await act(async () => {
        await result.current.authenticate('Custom message');
      });

      expect(LocalAuthentication.authenticateAsync).toHaveBeenCalledWith({
        promptMessage: 'Custom message',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });
    });
  });

  describe('getAuthenticationMessage', () => {
    it('should return Face ID message when available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      ]);

      const { result } = renderHook(() => useBiometricAuth());

      let message;
      await act(async () => {
        message = await result.current.getAuthenticationMessage();
      });

      expect(message).toContain('Face ID');
    });

    it('should return fingerprint message when available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      ]);

      const { result } = renderHook(() => useBiometricAuth());

      let message;
      await act(async () => {
        message = await result.current.getAuthenticationMessage();
      });

      expect(message).toContain('Fingerprint');
    });

    it('should return generic message when no specific type available', async () => {
      (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useBiometricAuth());

      let message;
      await act(async () => {
        message = await result.current.getAuthenticationMessage();
      });

      expect(message).toBe('Authenticate to manage your todos');
    });

    it('should handle errors and return fallback message', async () => {
      (LocalAuthentication.supportedAuthenticationTypesAsync as jest.Mock).mockRejectedValue(
        new Error('Service unavailable')
      );

      const { result } = renderHook(() => useBiometricAuth());

      let message;
      await act(async () => {
        message = await result.current.getAuthenticationMessage();
      });

      expect(message).toBe('Authentication method unavailable');
    });
  });
});
