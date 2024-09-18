import React from 'react';
import { ActivityIndicator, Pressable, Text, useColorScheme } from 'react-native';
interface Props {
  title?: string;
  size?: 'sm' | 'lg';
  state?: 'Default' | 'Pressed' | 'Outlined' | 'Hover' | 'Disabled' | 'Loading';
  onPress: () => void;
  className?: string;
}

export default function Button({
  title,
  state = 'Default',
  onPress,
  size = 'lg',
  className,
}: Props) {
  let baseClasses = 'flex flex-row justify-center items-center rounded';
  let sizeClasses = size === 'sm' ? 'px-3 py-4 ' : 'px-4 py-4 ';
  let textClasses = 'text-primary-light font-inter';

  let stateClasses = 'bg-action-500 text-primary-light';
  if (state === 'Loading') {
  }
  if (state === 'Hover') {
    stateClasses = 'bg-action-600 text-primary-light';
  }
  if (state === 'Pressed') {
    stateClasses = 'bg-action-700 text-primary-light';
  }
  if (state === 'Disabled') {
    stateClasses = 'bg-action-900 text-primary-light';
    textClasses = 'text-secondary-light-700 font-inter';
  }
  if (state === 'Outlined') {
    stateClasses = 'bg-transparent border-2 border-action-600';
    textClasses = 'text-action-700 font-inter';
  }

  let buttonClasses = `${baseClasses} ${sizeClasses} ${stateClasses} ${className || ''}`;

  return (
    <Pressable className={buttonClasses} onPress={onPress} disabled={state === 'Disabled'}>
      <Text className={textClasses}>
        {state === 'Loading' ? (
          <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />
        ) : (
          title
        )}
      </Text>
    </Pressable>
  );
}
