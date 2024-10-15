import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
const UserProfile = () => {

  return (
    <ScrollView className="flex-1 bg-gray-900">

      <View className="mt-8 px-4">
        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-purple-500 w-42 py-4 p-4 rounded-lg">
            <Text className="text-white text-center">Upload from your phone</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-purple-500 w-40 py-4 rounded-lg">
            <Text className="text-white text-center">Add external link</Text>
          </TouchableOpacity>
        </View>
        
        <View className="bg-gray-800 mt-10 p-4 rounded-lg h-64">
          <Text className="text-white text-center">Additional Content Section</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
