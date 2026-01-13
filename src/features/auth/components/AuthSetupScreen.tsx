import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text, Button } from '@/shared/components/primitives';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { authSetupService } from '../services/authSetup.service';
import { authSessionService } from '../services/authSession.service';
import { styles } from './AuthSetupScreen.styles';

export const AuthSetupScreen = (): React.JSX.Element => {
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('Checking...');
  const [canUseBiometric, setCanUseBiometric] = useState<boolean>(false);
  const { checkAvailability, authenticate, isAuthenticating } = useBiometricAuth();

  useEffect(() => {
    checkDeviceCapabilities();
  }, []);

  const checkDeviceCapabilities = async (): Promise<void> => {
    const availability = await checkAvailability();

    if (availability.isEnrolled && availability.biometricType) {
      const typeNames = {
        faceId: 'Face ID',
        touchId: 'Touch ID',
        fingerprint: 'Fingerprint',
        iris: 'Iris',
      };
      setAvailabilityMessage(
        `${typeNames[availability.biometricType]} is available and will be used to protect your TODOs.`
      );
      setCanUseBiometric(true);
    } else if (availability.isAvailable && !availability.isEnrolled) {
      setAvailabilityMessage(
        'Biometric authentication is available but not configured on your device. You can use your device PIN, Pattern, or Passcode to protect your TODOs.'
      );
      setCanUseBiometric(true);
    } else {
      setAvailabilityMessage(
        'Biometric authentication is not available. You can use your device PIN, Pattern, or Passcode to protect your TODOs.'
      );
      setCanUseBiometric(true);
    }
  };

  const handleEnableAuth = async (): Promise<void> => {
    const result = await authenticate('Authenticate to access your TODOs');

    if (result.success) {
      await authSetupService.markSetupComplete();
      authSessionService.setAuthenticated(true);
      router.replace('/');
    } else if (result.warning) {
      Alert.alert(
        'Authentication Required',
        'You must authenticate to access the app. Please try again.',
        [{ text: 'OK' }]
      );
    } else if (result.error) {
      Alert.alert('Authentication Failed', result.error, [{ text: 'Try Again' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="heading" style={styles.title}>
            Secure Your TODOs
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Protect your TODO list with authentication
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text variant="body" style={styles.message}>
            {availabilityMessage}
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
          <Button
            variant="primary"
            size="lg"
            onPress={handleEnableAuth}
            isLoading={isAuthenticating}
            disabled={!canUseBiometric}
          >
            Authenticate to Continue
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
