import { ReactElement, cloneElement } from 'react';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { BiometricAuthResult } from '../types/auth.types';

interface AuthGuardProps {
  children: ReactElement;
  onAuthenticated: () => void | Promise<void>;
  onAuthenticationFailed?: (error: string) => void;
  onAuthenticationCanceled?: () => void;
  promptMessage?: string;
}

export const AuthGuard = ({
  children,
  onAuthenticated,
  onAuthenticationFailed,
  onAuthenticationCanceled,
  promptMessage,
}: AuthGuardProps): ReactElement => {
  const { authenticate, isAuthenticating } = useBiometricAuth();

  const handlePress = async (): Promise<void> => {
    const result: BiometricAuthResult = await authenticate(promptMessage);

    if (result.success) {
      await onAuthenticated();
    } else if (result.warning) {
      onAuthenticationCanceled?.();
    } else if (result.error) {
      onAuthenticationFailed?.(result.error);
    }
  };

  return cloneElement(children, {
    onPress: handlePress,
    disabled: isAuthenticating || (children.props as { disabled?: boolean }).disabled,
  } as unknown as Partial<typeof children.props>);
};
