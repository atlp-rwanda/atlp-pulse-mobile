import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PropsWithChildren } from 'react';
import TraineeRatings from '../../components/sprintRatings';
export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;
const Dashboard = () => {
  return (
    <View>
      <TraineeRatings />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
