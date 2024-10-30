import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'

const EventCard = () => {
  return (
    <View className='bg-[#030F26] flex-row justify-between items-center mx-5 px-5 h-[60px] mb-3 rounded'>
        <View className=' gap-[7px]'>
            <Text className='text-white text-sm'>8:00 AM</Text>
            <Text className='text-white text-lg font-Inter-SemiBold'>Event 2</Text>
        </View>
        <TouchableOpacity>
             <AntDesign name="delete" size={16} color="white" />
        </TouchableOpacity>
    </View>
  )
}

export default EventCard