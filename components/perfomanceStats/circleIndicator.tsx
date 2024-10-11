import Svg, { Circle } from 'react-native-svg';
import { View, Text, useColorScheme } from 'react-native';
import styles from './styles';
const CircularIndicator = ({ value, color, label }: any) => {
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / 2) * circumference;
  const theme = useColorScheme();
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <View style={styles.indicatorContainer}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.indicatorTextContainer}>
        <Text style={[styles.indicatorValue, { color: textColor }]}>{value.toFixed(1)}</Text>
      </View>
    </View>
  );
};
export default CircularIndicator;
