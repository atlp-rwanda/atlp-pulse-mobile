import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  feedbacks: any[];
  textColor: string;
  bgColor: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, onClose, feedbacks }) => {
  if (!isVisible) return null;

  const colorScheme = useColorScheme();

  return (
    <>
      <BlurView
        className="bg-primary-light dark:bg-primary-dark absolute justify-center items-center w-full h-full"
        intensity={70}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      ></BlurView>

      {/* Modal content */}
      <View className="absolute justify-center items-center w-full h-full">
        <View className="m-auto flex-col rounded-lg p-4 shadow-lg w-5/6 h-60 bg-secondary-light-300 relative">
          {/* Close Icon */}
          <TouchableOpacity className="absolute top-6 right-4 z-10" onPress={onClose}>
            <AntDesign name="closecircle" size={30} color="#8667F2" />
          </TouchableOpacity>

          <ScrollView>
            {/* Render feedback data */}
            {feedbacks && feedbacks.length > 0 ? (
              feedbacks.map((feedback, idx) => (
                <View key={idx} className="mt-3">
                  <Text className="text-lg font-bold">From: {feedback.sender.role}</Text>
                  <Text className="text-sm mt-2"> {feedback.content}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500">No feedback available for this rating.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default FeedbackModal;
