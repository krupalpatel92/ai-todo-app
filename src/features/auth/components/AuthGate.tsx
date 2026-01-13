import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Text, Button } from '@/shared/components/primitives';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { authSessionService } from '../services/authSession.service';
import { styles } from './AuthGate.styles';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate = ({ children }: AuthGateProps): React.JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authSessionService.getAuthenticated();
  });
  const { authenticate, isAuthenticating, checkAvailability, getAuthenticationMessage } =
    useBiometricAuth();
  const [authMessage, setAuthMessage] = useState<string>('');
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    loadAuthMessage();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return (): void => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus): void => {
    // Only clear session when coming back from background (not inactive)
    // inactive -> active happens during biometric prompt, ignore it
    if (appState.current === 'background' && nextAppState === 'active') {
      authSessionService.clearSession();
      setIsAuthenticated(false);
    }
    appState.current = nextAppState;
  };

  const loadAuthMessage = async (): Promise<void> => {
    await checkAvailability();
    const message = await getAuthenticationMessage();
    setAuthMessage(message);
  };

  const handleUnlock = async (): Promise<void> => {
    const result = await authenticate('Authenticate to access your TODOs');

    if (result.success) {
      authSessionService.setAuthenticated(true);
      setIsAuthenticated(true);
    }
  };

  return (
    <>
      {isAuthenticated && <>{children}</>}

      {!isAuthenticated && isAuthenticating && (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.content}
          >
            <ActivityIndicator size="large" color="#2563eb" />
            <Text variant="body" style={styles.text}>
              Authenticating...
            </Text>
          </Animated.View>
        </SafeAreaView>
      )}

      {!isAuthenticated && !isAuthenticating && (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            style={styles.content}
          >
            <View style={styles.header}>
              <Text variant="heading" style={styles.title}>
                Secure TODOs
              </Text>
              <Text variant="body" style={styles.subtitle}>
                Your tasks are protected with authentication
              </Text>
            </View>

            <View style={styles.messageContainer}>
              <Text variant="body" style={styles.message}>
                {authMessage || 'Authentication is available on this device'}
              </Text>
            </View>

            <View style={styles.benefitsContainer}>
              <Text variant="body" style={styles.benefitsTitle}>
                Authentication is required to:
              </Text>
              <View style={styles.benefitItem}>
                <Text variant="body" style={styles.benefitText}>
                  • Access the app
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Text variant="body" style={styles.benefitText}>
                  • Create, update, or delete TODOs
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Text variant="body" style={styles.benefitText}>
                  • Every time the app comes to foreground
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button variant="primary" size="lg" onPress={handleUnlock}>
                Unlock
              </Button>
            </View>
          </Animated.View>
        </SafeAreaView>
      )}
    </>
  );
};
