import React from 'react';
import { Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { buttonStyles } from './Button.styles';

interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}

export const Button = React.memo<ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    children,
    style,
    onPress,
    ...props
  }) => {
    const spinnerColor = variant === 'ghost' ? '#2563eb' : '#ffffff';
    const scale = useSharedValue(1);

    const handlePress = (): void => {
      if (onPress) {
        onPress();
      }
    };

    const tap = Gesture.Tap()
      .enabled(!disabled && !isLoading)
      .onBegin(() => {
        scale.value = withSpring(0.95, {
          damping: 10,
          stiffness: 400,
        });
      })
      .onFinalize(() => {
        scale.value = withSpring(1, {
          damping: 10,
          stiffness: 400,
        });
      })
      .onEnd(() => {
        runOnJS(handlePress)();
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <GestureDetector gesture={tap}>
        <Animated.View
          style={[
            buttonStyles.base,
            buttonStyles.variants[variant],
            buttonStyles.sizes[size],
            (disabled || isLoading) && buttonStyles.disabled,
            animatedStyle,
            style,
          ]}
          {...props}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
          ) : (
            <Text
              style={[
                buttonStyles.text.base,
                buttonStyles.text.variants[variant],
                buttonStyles.text.sizes[size],
              ]}
            >
              {children}
            </Text>
          )}
        </Animated.View>
      </GestureDetector>
    );
  }
);

Button.displayName = 'Button';
