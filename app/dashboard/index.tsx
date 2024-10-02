import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PropsWithChildren } from 'react';
import React from 'react';
export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;
const Dashboard = () => {
  const colorScheme = useColorScheme();
  return (
    <View>
      <Text className={`ml-2 text-base ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}>Dashboard Coming soon</Text>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
