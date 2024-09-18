import { StyleSheet, Text, View } from 'react-native';
import { PropsWithChildren } from 'react';
import React from 'react';
export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;
const Dashboard = () => {
  return (
    <View>
      <CustomText>Dashboard.</CustomText>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
