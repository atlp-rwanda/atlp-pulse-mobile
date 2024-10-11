import { useState, useEffect, Key } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAINEE_RATING } from '../graphql/mutations/ratings';
import { useColorScheme } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TraineeRatings({ openFeedbackModal }: { openFeedbackModal: (feedback: any) => void }) {
  const [sprintFilter, setSprintFilter] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('Phase I');
  const [userToken, setUserToken] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';
  const inputbg = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';

  // Fetch user token from AsyncStorage
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setUserToken(token);
      } else {
        Alert.alert('Error', 'User token not found.');
      }
    };
    fetchToken();
  }, []);

  // Fetch trainee ratings from the backend using the TRAINEE_RATING query
  const { data, loading, error } = useQuery(TRAINEE_RATING, {
    context: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
    skip: !userToken,
  });

  const handleSprintFilterChange = (text: string) => {
    setSprintFilter(text);
  };

  const handlePhaseSelection = (phase: string) => {
    setSelectedPhase(phase);
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', `Error loading ratings`);
    }
  }, [loading, error]);

  let fetchedData = data?.fetchRatingsTrainee || [];

  fetchedData = fetchedData.filter((item: any) => item.phase === selectedPhase);

  if (sprintFilter) {
    fetchedData = fetchedData.filter((item: any) => String(item.sprint).includes(sprintFilter));
  }

  fetchedData = fetchedData.sort((a: any, b: any) => a.sprint - b.sprint);

  // Get the phase name from the first item (assuming phase is consistent across all data)
  const phaseName = fetchedData.length > 0 ? fetchedData[0].phase : 'No Phase';

  return (
    <View>
      <ScrollView className={`relative ${bgColor} w-fit`}>
        <View className="pt-5 h-auto">
          <Text className={`font-bold p-3 text-2xl ${textColor}`}>Recent feedback</Text>

          {/* Phase Name Display */}
          <View className="p-3">
            <Text className={`font-bold text-xl ${textColor} pb-2`}>{phaseName}</Text>

            <TextInput
              className={`border border-[#8667F2] rounded-md pl-1 bg-white ${inputbg}`}
              placeholder="Filter by Sprint"
              value={sprintFilter}
              onChangeText={handleSprintFilterChange}
              keyboardType="numeric" // Sprint is a number, so use numeric input
              returnKeyType="done"
            />
          </View>

          <View className={`p-3 rounded h-auto mb-5  ${textColor}`}>
            <View className="">
              {/* Horizontal Scroll for Table */}
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <View className="w-screen">
                  {/* Table heading */}
                  <View className="flex-row text-sm justify-between bg-[#c7d2fe] p-1 pt-4 pb-4 border-b border-[#b1b1b1] mt-5 rounded-tl-lg rounded-tr-lg">
                    <Text className="text-xs w-16 font-bold text-center">SPRINT</Text>
                    <Text className="text-xs w-16 font-bold text-center">QUANTITY</Text>
                    <Text className="text-xs w-16 font-bold text-center">QUALITY</Text>
                    <Text className="text-xs w-28 font-bold text-center">PROFESSIONALISM</Text>
                    <Text className="text-xs w-20 font-bold text-center">COMMENT</Text>
                  </View>

                  {/* Dynamic rows based on sorted data */}
                  {fetchedData.length === 0 ? (
                    <Text className={`${textColor} text-center font-bold p-10`}>
                      No Ratings Available
                    </Text>
                  ) : (
                    fetchedData.map((item: any, index: Key | null | undefined) => (
                      <View
                        key={index}
                        className="flex-row justify-around border-b border-[#b1b1b1] p-2"
                      >
                        <Text className={`w-16  ${textColor} text-center`}>{item.sprint}</Text>
                        <Text className={`w-16 ${textColor} text-center`}>{item.quantity}</Text>
                        <Text className={`w-16 ${textColor} text-center`}>{item.quality}</Text>
                        <Text className={`w-28 ${textColor} text-center`}>
                          {item.professional_Skills}
                        </Text>
                        <View className="w-16 bg-[#8667F2] rounded-full justify-center align-middle p-1">
                          <TouchableOpacity
                            onPress={() => openFeedbackModal(item)}
                            className="text-white flex-row items-center"
                          >
                            <AntDesign name="eye" size={15} color="white" />
                            <Text className="text-white">View</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
