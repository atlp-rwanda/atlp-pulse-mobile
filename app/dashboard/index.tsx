import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import TraineeRatings from '../../components/sprintRatings';
import PerformanceScores from '@/components/perfomanceStats';
import FeedbackModal from '@/components/feedbackModel';

export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const openFeedbackModal = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsModalVisible(true);
  };

  const closeFeedbackModal = () => {
    setIsModalVisible(false);
    setSelectedFeedback(null);
  };

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  return (
    <View style={{ flex: 1 }}>
      <PerformanceScores />

      <TraineeRatings openFeedbackModal={openFeedbackModal} />

      <FeedbackModal
        isVisible={isModalVisible}
        onClose={closeFeedbackModal}
        feedbacks={selectedFeedback?.feedbacks || []}
        textColor={textColor}
        bgColor={bgColor}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
