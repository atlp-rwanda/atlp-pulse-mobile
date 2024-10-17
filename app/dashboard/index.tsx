import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PropsWithChildren } from 'react';
import TraineeRatings from '../../components/sprintRatings';
import PerformanceScores from '@/components/perfomanceStats';
export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;
const Dashboard = () => {
  return (
    <View>
      <PerformanceScores />
      <TraineeRatings />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
