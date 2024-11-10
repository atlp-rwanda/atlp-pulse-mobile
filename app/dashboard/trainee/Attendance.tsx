import { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@apollo/client';
import { GET_TRAINEE_ATTENDANCE } from '@/graphql/queries/Attendance';
import { useColorScheme } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';


interface DayStatus {
  date: string;
  score?: number;
}

interface WeekData {
  week: string | null;
  daysStatus: {
    mon?: DayStatus;
    tue?: DayStatus;
    wed?: DayStatus;
    thu?: DayStatus;
    fri?: DayStatus;
  };
  weekAverage: number;
}

interface PhaseData {
  phase: { _id: string; name: string };
  phaseAverage: number;
  weeks: WeekData[];
}

interface TraineeAttendanceData {
  teamName: string;
  traineeId: string;
  allPhasesAverage: number;
  phases: PhaseData[];
}

const staticDays = ['mon', 'tue', 'wed', 'thu', 'fri'];

export default function TraineeAttendance() {
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [traineeId, setTraineeId] = useState<string | null>(null);
  const [selectedWeekAverage, setSelectedWeekAverage] = useState<string | null>(null);


  const toast = useToast();
  const {t} = useTranslation ();

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
          const decodedToken = jwtDecode<{ userId: string }>(token);
          setTraineeId(decodedToken.userId);
        }
      } catch (error) {
        toast.show('Error fetching authToken from AsyncStorage', {
          type: 'error',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    };
    loadTokenFromAsyncStorage();
  }, []);

  const { data, loading, error } = useQuery(GET_TRAINEE_ATTENDANCE, {
    skip: !authToken || !traineeId,
    variables: { traineeId },
    context: { headers: { Authorization: `Bearer ${authToken}` } },
  });

  useEffect(() => {
    if (data?.getTraineeAttendance?.phases.length > 0) {
      setSelectedWeek(data.getTraineeAttendance.phases[0].weeks[0]?.week || null);
    }
    if (error) {
      toast.show(error.message, {
        type: 'error',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  }, [data, error]);

  if (loading) <Text>Loading...</Text>;

  const selectedWeekData = data?.getTraineeAttendance?.phases
    .flatMap((phase: { weeks: any }) => phase.weeks)
    .find((weekData: { week: string | null }) => weekData.week === selectedWeek);

  const selectedPhaseData = data?.getTraineeAttendance?.phases.find((phase: { weeks: any[] }) =>
    phase.weeks.some((weekData: { week: string | null }) => weekData.week === selectedWeek)
  );

  const phaseName = selectedPhaseData?.phase.name;
  const phaseAverage = selectedPhaseData?.phaseAverage;
  const allPhasesAverageData = data?.getTraineeAttendance.allPhasesAverage;
  

 
  useEffect(() => {
    const selectedWeekNumber = selectedWeek ? parseInt(selectedWeek, 10) : null;

    if (selectedWeekNumber !== null && !isNaN(selectedWeekNumber)) {
      data?.getTraineeAttendance?.phases?.forEach(
        (phase: { phase: { name: any }; phaseAverage: any; weeks: any[] }) => {
          const selectedWeekData = phase.weeks?.[selectedWeekNumber - 1];

          if (selectedWeekData) {
            setSelectedWeekAverage(selectedWeekData.weekAverage);
          } else {
            toast.show(`Week ${selectedWeekNumber} data not found in phase ${phase.phase.name}`, {
              type: 'error',
              placement: 'top',
              duration: 4000,
              animationType: 'slide-in',
            });
          }
        }
      );
    }
  }, [selectedWeek, data]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <ScrollView className={`${bgColor}`}>
      <View className="m-4">
        <Text className={`${textColor} font-bold text-xl`}>{t('attendance.attendance')}</Text>
        <View className="flex-row items-baseline justify-between">
          <Text className={`${textColor} font-bold text-xl`}>{phaseName}</Text>
          <TouchableOpacity
            className={`border w-fit mt-5 ${nthbgColor} rounded-lg p-2 flex-row justify-between items-center`}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text className={`${textColor} font-bold text-xl`}>{t('attendance.week')}</Text>
            <Text className={`${textColor} font-bold text-xl`}>{selectedWeek}</Text>
            <AntDesign name="down" size={18} color={Color} />
          </TouchableOpacity>

          {dropdownVisible && (
            <View className="absolute bg-white rounded shadow w-16 right-0 top-16 z-10">
              {data?.getTraineeAttendance?.phases.flatMap((phase: { weeks: any[] }) =>
                phase.weeks.map((weekData: { week: string }) => (
                  <TouchableOpacity
                    key={weekData.week}
                    onPress={() => {
                      setSelectedWeek(weekData.week);
                      setDropdownVisible(false);
                    }}
                    className={`p-2 ${selectedWeek === weekData.week ? 'bg-[#C3D5C5]' : ''}`}
                  >
                    <Text className="font-bold">{weekData.week}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        <View className="border mt-5">
          <View className={`flex-row justify-around h-10 ${thbg}`}>
            <Text className={`pt-2 flex-1 h-10 text-center font-bold ${textColor}`}>{t('attendance.day')}</Text>
            <Text className={`pt-2 flex-1 h-10 text-center font-bold ${textColor}`}>{t('attendance.date')}</Text>
            <Text className={`pt-2 flex-1 h-10 text-center font-bold ${textColor}`}>{t('attendance.score')}</Text>
          </View>

          {selectedWeekData ? (
            staticDays.map((day, index) => {
              const { date, score } = selectedWeekData.daysStatus[day.toLowerCase()] || {};
              return (
                <View
                  key={day}
                  className={`flex-row justify-around h-12 items-center ${index % 2 === 0 ? nthbgColor : bgColor}`}
                >
                  <Text className={`${textColor} flex-1 text-center`}>{t(`days.${day}`)}</Text>
                  <Text className={`${textColor} flex-1 text-center`}>
                    {date ? formatDate(date) : '-'}
                  </Text>
                  <Text className={`${textColor} flex-1 text-center`}>
                    {score == 2 ? (
                      <AntDesign name="checkcircle" size={21} color="green" />
                    ) : score == 1 ? (
                      <View className='flex-1 items-center'>
                          <Image source={require('../../../assets/images/attend.png')} />
                        </View>
                    ) : score == 0 ? (
                      <AntDesign name="closecircle" size={21} color="red" />
                    ) : (
                      <AntDesign name="minus" size={18} color={Color} />
                    )}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text className={`${textColor} text-center p-4`}>
              {t('attendance.youDontHaveAttendance')}
            </Text>
          )}
        </View>
        <View className="flex flex-col gap-y-8 xmd:flex-row justify-between xmd:items-end list-inside py-5 pl-0 pr-1 md:px-10 md:py-5 text-[.8rem] xmd:text-[.83rem] md:text-sm">
          <View>
            <Text className={`uppercase font-semibold mb-3 ${textColor}`}>{t('attendance.attendanceAverages')}</Text>
            <View className="flex flex-col gap-y-2 list-disc font-medium pl-3">
            <Text className={`${textColor} font-bold`}>{t('attendance.week')} {selectedWeekAverage !== undefined ? selectedWeekAverage : 0.0}</Text>

              <Text className={`${textColor} font-bold`}>
                {phaseName !== undefined ? phaseName : t('attendance.phaseName')}: {phaseAverage !== undefined ? phaseAverage : 0.0}
              </Text>
              <Text className={`${textColor} font-bold`}>{t('attendance.allPhasesAverage')} {allPhasesAverageData}</Text>
            </View>
          </View>
        </View>

        <View className="p-3 gap-3">
          <View className="flex-row gap-2">
            <AntDesign name="checkcircle" size={21} color="green" />
            <Text className={`${textColor}`}>= {t('attendance.attendedAndCommunicated')}</Text>
          </View>
          <View className="flex-row gap-2">
            <Image source={require('../../../assets/images/attend.png')} />
            <Text className={`${textColor}`}>= {t('attendance.didntAttendButCommunicated')}</Text>
          </View>
          <View className="flex-row gap-2">
            <AntDesign name="closecircle" size={21} color="red" />
            <Text className={`${textColor}`}>= {t('attendance.didntAttendAndCommunicate')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
