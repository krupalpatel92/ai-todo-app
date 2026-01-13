import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

export default function NotFound(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>404 - Page Not Found</Text>
      <Link href="/">Go to Home</Link>
    </View>
  );
}
