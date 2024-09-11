import { StyleSheet, Text, View } from 'react-native';
import { PropsWithChildren } from 'react';

export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;

const index = () => {
  return (
    <View>
      <CustomText>Trainee.</CustomText>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
