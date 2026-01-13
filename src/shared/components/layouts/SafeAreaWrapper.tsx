import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

export const SafeAreaWrapper = React.memo<SafeAreaWrapperProps>(
  ({ children, edges = ['top', 'bottom', 'left', 'right'], style }) => {
    return (
      <SafeAreaView edges={edges} style={[{ flex: 1 }, style]}>
        {children}
      </SafeAreaView>
    );
  }
);

SafeAreaWrapper.displayName = 'SafeAreaWrapper';
