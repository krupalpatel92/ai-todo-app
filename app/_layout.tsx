import 'react-native-get-random-values';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { AppProviders } from '@/providers/AppProviders';
import { authSetupService } from '@/features/auth';

function RootLayoutNav(): React.JSX.Element {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuthSetup();
  }, []);

  useEffect(() => {
    if (isSetupComplete === null) return;

    const inAuthGroup = segments[0] === 'auth-setup';

    if (!isSetupComplete && !inAuthGroup) {
      router.replace('/auth-setup');
    } else if (isSetupComplete && inAuthGroup) {
      router.replace('/');
    }
  }, [isSetupComplete, segments]);

  const checkAuthSetup = async (): Promise<void> => {
    const setupState = await authSetupService.getSetupState();
    setIsSetupComplete(setupState.isSetupComplete);
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}

export default function RootLayout(): React.JSX.Element {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
