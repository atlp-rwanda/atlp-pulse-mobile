import FeedbackModal from '@/components/feedbackModel';
import PerformanceScores from '@/components/performanceStats';
import TraineeRatings from '@/components/sprintRatings';
import { View } from '@/components/Themed';
import { useState } from 'react';
import { useColorScheme } from 'react-native';

export default function TraineeDashboard() {
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
}
