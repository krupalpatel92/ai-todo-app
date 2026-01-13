export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  warning?: string;
}

export interface BiometricAvailability {
  isAvailable: boolean;
  isEnrolled: boolean;
  biometricType?: 'faceId' | 'touchId' | 'fingerprint' | 'iris';
  error?: string;
}

export enum AuthErrorType {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  NOT_ENROLLED = 'NOT_ENROLLED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
}

export interface AuthSetupState {
  isSetupComplete: boolean;
  setupDate?: string;
}
