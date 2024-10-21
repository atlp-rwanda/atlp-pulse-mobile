import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';

interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  feedbacks: any[];
  textColor: string;
  bgColor: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isVisible,
  onClose,
  feedbacks,
  textColor,
  bgColor,
}) => {
  if (!isVisible) return null;

  return (
    <>
      <BlurView
        intensity={100} // You can increase intensity for a more blurred background
        tint="dark"
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {/* This TouchableOpacity handles outside click */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 70% opacity
          }}
        />
      </BlurView>

      {/* Modal content */}
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          margin: 'auto',
          width: '100%',
        }}
      >
        <View className="m-auto flex-col rounded-lg  p-4 shadow-lg w-5/6 top-96  h-60 bg-[#c7d2fe] relative">
          {/* Close Icon */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10, // Ensure it's on top
            }}
          >
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
