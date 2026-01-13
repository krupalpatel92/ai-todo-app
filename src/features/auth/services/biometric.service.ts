import * as LocalAuthentication from 'expo-local-authentication';
import {
  BiometricAuthResult,
  BiometricAvailability,
  AuthErrorType,
  AuthError,
} from '../types/auth.types';

class BiometricService {
  async checkAvailability(): Promise<BiometricAvailability> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      let biometricType: BiometricAvailability['biometricType'];

      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricType = 'faceId';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricType = 'fingerprint';
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        biometricType = 'iris';
      }

      return {
        isAvailable: compatible,
        isEnrolled: enrolled,
        biometricType,
      };
    } catch {
      return {
        isAvailable: false,
        isEnrolled: false,
        error: 'Failed to check biometric availability',
      };
    }
  }

  async authenticate(promptMessage?: string): Promise<BiometricAuthResult> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate to continue',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use device credentials',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
        };
      }

      if (result.error === 'user_cancel') {
        return {
          success: false,
          warning: 'Authentication canceled',
        };
      }

      if (result.error === 'lockout') {
        return {
          success: false,
          error: 'Too many failed attempts. Please try again later.',
        };
      }

      if (result.error === 'not_enrolled') {
        return {
          success: false,
          error: 'Device passcode not set. Please configure a passcode in Settings.',
        };
      }

      return {
        success: false,
        error: 'Authentication failed. Please try again.',
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Authentication error',
      };
    }
  }

  async getAuthenticationMessage(): Promise<string> {
    const availability = await this.checkAvailability();

    if (availability.isEnrolled && availability.biometricType) {
      const typeNames = {
        faceId: 'Face ID',
        touchId: 'Touch ID',
        fingerprint: 'Fingerprint',
        iris: 'Iris',
      };
      return `${typeNames[availability.biometricType]} is configured and ready`;
    }

    if (availability.isAvailable && !availability.isEnrolled) {
      return 'Biometric authentication is recommended but you can continue with PIN, Pattern, or Passcode';
    }

    return 'You can authenticate with your device PIN, Pattern, or Passcode';
  }

  createAuthError(type: AuthErrorType, customMessage?: string): AuthError {
    const messages: Record<AuthErrorType, string> = {
      [AuthErrorType.NOT_AVAILABLE]: 'Biometric authentication is not available on this device',
      [AuthErrorType.NOT_ENROLLED]: 'No biometrics enrolled. Please set up in Settings.',
      [AuthErrorType.FAILED]: 'Authentication failed. Please try again.',
      [AuthErrorType.CANCELED]: 'Authentication was canceled',
      [AuthErrorType.SYSTEM_ERROR]: 'A system error occurred',
    };

    return {
      type,
      message: customMessage || messages[type],
    };
  }
}

export const biometricService = new BiometricService();
