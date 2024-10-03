import { useState, useEffect, Key } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAINEE_RATING } from '../graphql/mutations/ratings';
import { useColorScheme } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

export default function TraineeRatings() {
  const [inputValue, setInputValue] = useState('');
  const [sprintFilter, setSprintFilter] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('Phase I');
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-[#E0E7FF]';
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

  const toggleModel = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsOpenModel(!isOpenModel);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

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

  return (
    <View>
      <ScrollView className={`relative ${bgColor} w-fit`}>
        <View className="pt-5 h-auto">
          <Text className={`font-bold p-3 text-2xl ${textColor}`}>Recent feedback</Text>

          {/* Phase Selection */}
          <View className="p-3 flex-row justify-between items-center">
            <View className={`flex-row gap-2`}>
              <TouchableOpacity onPress={() => handlePhaseSelection('Phase I')}>
                <Text
                  className={`${
                    selectedPhase === 'Phase I' ? 'font-bold border-b-2 border-[#8667F2]' : ''
                  } ${textColor}`}
                >
                  Phase I
                </Text>
              </TouchableOpacity>
              <View className="w-1 h-6 bg-[#8667F2]"></View>

              <TouchableOpacity
                onPress={() => handlePhaseSelection('Phase II')}
                className={`${textColor}`}
              >
                <Text
                  className={`${
                    selectedPhase === 'Phase II' ? 'font-bold border-b-2 border-[#8667F2]' : ''
                  } ${textColor}`}
                >
                  Phase II
                </Text>
              </TouchableOpacity>
              <View className="w-1 h-6 bg-[#8667F2]"></View>

              <TouchableOpacity onPress={() => handlePhaseSelection('Phase III')}>
                <Text
                  className={`${
                    selectedPhase === 'Phase III' ? 'font-bold border-b-2 border-[#8667F2]' : ''
                  } ${textColor}`}
                >
                  Phase III
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className={`border-[#8667F2] rounded pl-1 bg-white ${inputbg}`}
              placeholder="Filter by Sprint"
              value={sprintFilter}
              onChangeText={handleSprintFilterChange}
              keyboardType="numeric" // Sprint is a number, so use numeric input
              returnKeyType="done"
            />
          </View>

          <View className={`p-3 rounded h-auto mb-5 shadow-lg ${bgColor} ${textColor}`}>
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
                        <View className="w-16 bg-[#8667F2] p-1 rounded-lg justify-end">
                          <View className="flex-row justify-center items-center">
                            <TouchableOpacity
                              onPress={() => toggleModel(item.feedbacks)}
                              className="flex-row items-center"
                            >
                              <AntDesign name="eyeo" size={15} color="white" />
                              <Text className="text-white text-sm">View</Text>
                            </TouchableOpacity>
                          </View>
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

      {isOpenModel && (
        <>
          <TouchableOpacity
            onPress={() => setIsOpenModel(false)}
            className="absolute inset-0 flex-col items-center align-middle justify-center bg-[#8667F2]/80 blur-2xl h-screen w-full"
          >
            {/* Empty View to handle background touch */}
          </TouchableOpacity>

          {/* Modal content */}
          <View className="absolute pt-24 pl-5  inset-0 flex items-center w-11/12 justify-center z-20 ">
            <View className={`rounded-lg p-4 shadow-lg w-11/12  h-60 ${bgColor} relative`}>
              <TouchableOpacity
                onPress={() => setIsOpenModel(false)}
                className="absolute right-3 top-3"
              >
                <Fontisto name="close" size={15} color="#8667F2" />
              </TouchableOpacity>

              {/* Render feedback data */}
              {selectedFeedback && selectedFeedback.length > 0 ? (
                selectedFeedback.map((feedback: any, idx: number) => (
                  <View key={idx} className="mt-3">
                    <Text className={`${textColor} text-lg font-bold`}>
                      From: {feedback.sender.role}
                    </Text>
                    <Text className={`${textColor} text-sm mt-2`}>
                      Feedback: {feedback.content}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className={`${textColor} text-gray-500`}>
                  No feedback available for this rating.
                </Text>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
