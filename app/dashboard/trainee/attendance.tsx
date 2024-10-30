import { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql, useQuery } from '@apollo/client';
import { GET_TRAINEE_ATTENDANCE } from '@/graphql/queries/Attendance';
import { useColorScheme } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

interface DayStatus {
  [x: string]: any;
  date: string;
  score?: number;
}

interface WeekData {
  week: string | null;
  daysStatus: Record<string, DayStatus>;
}

interface PhaseData {
  phase: { name: string };
  weeks: WeekData[];
}

interface TraineeAttendanceData {
  teamName: string;
  traineeId: string;
  phases: PhaseData[];
}

export default function TraineeAttendance() {
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const toast = useToast();

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';
  const nthbgColor = colorScheme === 'dark' ? 'bg-[#0C121C]' : 'bg-gray-200';
  const Color = colorScheme === 'dark' ? 'white' : 'black';

  const thbg = colorScheme === 'dark' ? 'bg-[#323432]' : 'bg-[#C3D5C5]';

  useEffect(() => {
    const loadTokenFromAsyncStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setAuthToken(token);
        }
      } catch (error) {
        toast.show(
          'Error fetching authToken from AsyncStorageError fetching authToken from AsyncStorage',
          {
            type: 'error',
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
          }
        );
      }
    };
    loadTokenFromAsyncStorage();
  }, []);

  const { data, loading, error } = useQuery<{ getTraineeAttendance: TraineeAttendanceData }>(
    GET_TRAINEE_ATTENDANCE,
    {
      skip: !authToken,
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    }
  );

  useEffect(() => {
    if (data && data.getTraineeAttendance && data.getTraineeAttendance.phases.length > 0) {
      setSelectedWeek(data.getTraineeAttendance.phases[0].weeks[0].week || null);
    }
    if (error) {
      toast.show(error.toString(), {
        type: 'error',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  }, [data, error]);

  if (loading) return <Text>Loading...</Text>;

  const selectedWeekData = data?.getTraineeAttendance?.phases
    .flatMap((phase) => phase.weeks)
    .find((weekData) => weekData.week === selectedWeek);

  const selectedPhaseData = data?.getTraineeAttendance?.phases.find((phase) =>
    phase.weeks.some((weekData) => weekData.week === selectedWeek)
  );

  const phaseName = selectedPhaseData?.phase?.name;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <ScrollView className={`${bgColor}`}>
      <View className="m-4">
        <Text className={`${textColor} font-bold text-xl`}>Your Attendance</Text>
        <View className="flex-row items-baseline justify-between">
          <Text className={`${textColor} font-bold text-xl`}>{phaseName}</Text>
          <TouchableOpacity
            className={`border w-32 mt-5 ${nthbgColor} rounded-lg p-2 flex-row justify-between items-center`}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text className={`${textColor} font-bold text-xl`}>Week:</Text>
            <Text className={`${textColor} font-bold text-xl`}>{selectedWeek}</Text>
            <AntDesign name="down" size={18} color={Color} />
          </TouchableOpacity>

          {dropdownVisible && (
            <View className="absolute bg-white border-spacing-1 rounded shadow w-16 right-0 top-16 z-10">
              {data?.getTraineeAttendance?.phases.flatMap((phase) =>
                phase.weeks.map((weekData) => (
                  <TouchableOpacity
                    key={weekData.week}
                    onPress={() => {
                      setSelectedWeek(weekData.week);
                      setDropdownVisible(false);
                    }}
                    className={`p-2 ${selectedWeek === weekData.week ? 'bg-[#C3D5C5]' : ''} items-end `}
                  >
                    <Text className={`font-bold`}>{weekData.week}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        <View className="border mt-5">
          <View className={`flex-row justify-around  h-10 ${thbg}  `}>
            <Text className={`pt-2 flex-1 h-10 text-center font-bold ${textColor}`}>Day</Text>
            <Text className={`pt-2 flex-1 h-10 text-center font-bold ${textColor}`}>Date</Text>
            <Text className={`pt-2 flex-1 h-10 text-center font-bold ${textColor}`}>Score</Text>
          </View>

          {selectedWeekData ? (
            Object.entries(selectedWeekData.daysStatus).map(
              ([day, status], index) =>
                status.__typename && (
                  <View
                    key={day}
                    className={`flex-row justify-around  h-12 items-center ${index % 2 === 0 ? `${nthbgColor}` : `${bgColor}`}`}
                  >
                    <Text className={`${textColor} flex-1  text-center`}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <Text className={`${textColor} flex-1  text-center`}>
                      {formatDate(status.date)}
                    </Text>
                    <Text className={`${textColor} flex-1  text-center`}>
                      {status.score == 2 ? (
                        <AntDesign name="checkcircle" size={21} color="green" />
                      ) : status.score == 1 ? (
                        <View>
                          <Image source={require('../../../assets/images/attend.png')} />
                        </View>
                      ) : status.score == 0 ? (
                        <AntDesign name="closecircle" size={21} color="red" />
                      ) : (
                        <AntDesign name="minus" size={18} color={Color} />
                      )}
                    </Text>
                  </View>
                )
            )
          ) : (
            <Text className={`${textColor} text-center p-4`}>
              You don't have an attendance record in the system at the moment..
            </Text>
          )}
        </View>
        <View className="p-3 gap-3">
          <View className="flex-row gap-2">
            <AntDesign name="checkcircle" size={21} color="green" />
            <Text className={`${textColor}`}>= [2] Attended and Communicated</Text>
          </View>
          <View className="flex-row gap-2">
            <Image source={require('../../../assets/images/attend.png')} />
            <Text className={`${textColor}`}>= [1] Didn't attend but communicated</Text>
          </View>
          <View className="flex-row gap-2">
            <AntDesign name="closecircle" size={21} color="red" />
            <Text className={`${textColor}`}>= [0] Didn't attend and didn't communicate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
