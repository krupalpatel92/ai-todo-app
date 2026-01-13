import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from '@/shared/components/primitives';
import { styles } from './CollapsibleSection.styles';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = React.memo<CollapsibleSectionProps>(
  ({ title, count, collapsed, onToggle, children }) => {
    const rotation = useSharedValue(collapsed ? 0 : 90);
    const contentHeight = useSharedValue(collapsed ? 0 : 1);

    useEffect(() => {
      rotation.value = withTiming(collapsed ? 0 : 90, { duration: 300 });
      contentHeight.value = withTiming(collapsed ? 0 : 1, { duration: 300 });
    }, [collapsed]);

    const arrowStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
      opacity: contentHeight.value,
      height: contentHeight.value === 0 ? 0 : undefined,
      overflow: 'hidden',
    }));

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.7}>
          <Animated.Text style={[styles.arrow, arrowStyle]}>▶</Animated.Text>
          <Text variant="body" style={styles.title}>
            {title}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.count}>{count}</Text>
          </View>
        </TouchableOpacity>

        <Animated.View style={[styles.content, contentStyle]}>{children}</Animated.View>
      </View>
    );
  }
);

CollapsibleSection.displayName = 'CollapsibleSection';
