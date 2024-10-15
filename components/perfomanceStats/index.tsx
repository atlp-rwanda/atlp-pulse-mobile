import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, useColorScheme, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAINEE_RATING } from '@/graphql/queries/rating';
import { useQuery } from '@apollo/client';
import styles from './styles';
import { LineChart } from 'react-native-chart-kit';
import CircularIndicator from './circleIndicator';
import { useTranslation } from 'react-i18next';

const PerformanceScores = () => {
  const { t } = useTranslation();
  const colors = {
    quality: 'rgba(160, 132, 244, 1)',
    quantity: 'rgba(184, 161, 69, 1)',
    professionalism: 'rgba(76, 175, 80, 1)',
  };

  const theme = useColorScheme();

  const backgroundColor = theme === 'dark' ? '#020917' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  const chartConfig = {
    backgroundGradientFrom: theme === 'dark' ? '#020917' : '#ffffff',
    backgroundGradientTo: theme === 'dark' ? '#020917' : '#ffffff',
    color: (opacity = 1) => gridColor,
    strokeWidth: 2,
    decimalPlaces: 1,
  };

  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setUserToken(token);
        } else {
          Alert.alert('Error', 'User token not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch token.');
      }
    };
    fetchToken();
  }, []);

  const { data, loading, error, refetch } = useQuery(TRAINEE_RATING, {
    context: {
      headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
    },
    skip: !userToken,
  });

  useEffect(() => {
    if (userToken) {
      refetch();
    }
  }, [userToken]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  let fetchedData = data?.fetchRatingsTrainee || [];

  if (fetchedData.length === 0) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        <Text style={[styles.header, { color: textColor }]}>{t("performance.performance_scores")}</Text>
        <View style={styles.scoresContainer}>
          <View style={styles.scoreItem}>
            <CircularIndicator value={0} color={colors.quality} label="Quality" />
            <Text style={[styles.scoreLabel, { color: textColor }]}>{t("performance.quality")}</Text>
           
          </View>

          <View style={styles.scoreItem}>
            <CircularIndicator value={0} color={colors.quantity} label="Quantity" />
            <Text style={[styles.scoreLabel, { color: textColor }]}>{t("performance.quantity")}</Text>
            
          </View>

          <View style={styles.scoreItem}>
            <CircularIndicator
              value={0}
              color={colors.professionalism}
              label="Profesionalism"
            />

            <Text style={[styles.scoreLabel, { color: textColor }]}>{t("performance.professionalism")}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  const dataQuality = fetchedData.map((item: any) => parseInt(item.quality) || 0);
  const dataQuantity = fetchedData.map((item: any) => parseInt(item.quantity) || 0);
  const dataProfessionalism = fetchedData.map(
    (item: any) => parseInt(item.professional_Skills) || 0
  );

  const qualityAverage =
    dataQuality.reduce((a: number, b: number) => a + b, 0) / dataQuality.length;
  const quantityAverage =
    dataQuantity.reduce((a: number, b: number) => a + b, 0) / dataQuantity.length;
  const professionalismAverage =
    dataProfessionalism.reduce((a: number, b: number) => a + b, 0) / dataProfessionalism.length;
  const sprintData = fetchedData
    .map((item: any) => {
      return {
        sprint: `Sprint ${item.sprint}`,
        quality: parseFloat(item.quality),
        quantity: parseFloat(item.quantity),
        professionalism: parseFloat(item.professional_Skills),
      };
    })
    .reverse();

  const lineGraph = {
    labels: sprintData.map((sprint: any) => sprint.sprint),
    datasets: [
      {
        data: sprintData.map((sprint: any) => sprint.quality),
        color: (opacity = 1) => `${colors.quality})`,
        strokeWidth: 2,
      },
      {
        data: sprintData.map((sprint: any) => sprint.quantity),
        color: (opacity = 1) => `${colors.quantity})`,
        strokeWidth: 2,
      },
      {
        data: sprintData.map((sprint: any) => sprint.professionalism),
        color: (opacity = 1) => `${colors.professionalism})`,
        strokeWidth: 2,
      },
    ],
    legend: [t("performance.quality"), t("performance.quantity"), t("performance.professionalism")],
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]} >
      <Text style={[styles.header, { color: textColor }]}>{t("performance.performance_scores")}</Text>
      <View style={styles.scoresContainer}>
        <View style={styles.scoreItem}>
          <CircularIndicator value={qualityAverage} color={colors.quality} label={t("performance.quality")} />
          <Text style={[styles.scoreLabel, { color: textColor }]}>{t("performance.quality")}</Text>
          <Text style={[styles.statusText, { color: qualityAverage > 1 ? '#4CAF50' : '#f44336' }]}>
            {qualityAverage > 1 ? t("performance.very_good") : t("performance.need_to_improve")}
          </Text>
        </View>

        <View style={styles.scoreItem}>
          <CircularIndicator value={quantityAverage} color={colors.quantity} label={t("performance.quantity")} />
          <Text style={[styles.scoreLabel, { color: textColor }]}>{t("performance.quantity")}</Text>
          <Text style={[styles.statusText, { color: quantityAverage > 1 ? '#4CAF50' : '#f44336' }]}>
            {quantityAverage > 1 ? t("performance.very_good") : t("performance.need_to_improve")}
          </Text>
        </View>

        <View style={styles.scoreItem}>
          <CircularIndicator
            value={professionalismAverage}
            color={colors.professionalism}
            label={t("performance.professionalism")}
          />

          <Text style={[styles.scoreLabel, { color: textColor }]}>{t("performance.professionalism")}</Text>
          <Text
            style={[
              styles.statusText,
              { color: professionalismAverage > 1 ? '#4CAF50' : '#f44336' },
            ]}
          >
            {professionalismAverage > 1 ? t("performance.very_good") : t("performance.need_to_improve")}
          </Text>
        </View>
      </View>
      <Text style={[styles.chartHeader, { color: textColor }]}>{t("performance.stats")}</Text>
      <View style={{ height: 200, paddingVertical: 16, marginLeft: -40, marginBottom: 50}}>
        <LineChart
          data={lineGraph}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          yAxisSuffix=""
          fromZero
          yAxisInterval={0.6}
          segments={4}
          style={{ height: '100%', width: '100%' }}
        />
      </View>
    </ScrollView>
  );
};

export default PerformanceScores;
