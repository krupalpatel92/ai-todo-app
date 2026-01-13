import React from 'react';
import { View, ScrollView, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ScreenContainer.styles';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ScreenContainer = React.memo<ScreenContainerProps>(
  ({ children, scroll = false, padding = true, backgroundColor = '#ffffff', style }) => {
    const containerStyle = [
      styles.container,
      { backgroundColor },
      padding && styles.padding,
      style,
    ];

    return (
      <>
        {scroll && (
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.flex}
            >
              <ScrollView
                style={styles.flex}
                contentContainerStyle={containerStyle}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        )}

        {!scroll && (
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={containerStyle}>{children}</View>
          </SafeAreaView>
        )}
      </>
    );
  }
);

ScreenContainer.displayName = 'ScreenContainer';
