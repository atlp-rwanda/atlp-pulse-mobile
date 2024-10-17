import PerformanceScores from '@/components/perfomanceStats';
import { View } from '@/components/Themed';
import TraineeRatings from '@/components/trainee/ratings/TraineeRatings';

export default function TraineeRatingsDashboard() {
  return (
    <View>
      <PerformanceScores />
      <TraineeRatings />
    </View>
  );
}
