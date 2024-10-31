import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'

interface EventCardProps {
  eventName: string;
  onDelete: (eventName: string) => void;
}

const EventCard = ({ eventName, onDelete }:EventCardProps) => {
  const colorScheme = useColorScheme();
  
  return (
    <View className={`${colorScheme === 'light' ? 'bg-[#F2F2F2]' : 'bg-[#030F26]'}  flex-row justify-between items-center mx-5 px-5 h-[60px] mb-3 rounded-md`}>
        <View className=' gap-[7px]'>
            <Text className={`${colorScheme === 'light' ? 'text-[ #666666]' : 'text-white'} text-sm`}>8:00 AM</Text>
            <Text className={`${colorScheme === 'light' ? 'text-[ #666666]' : 'text-white'} text-lg font-Inter-SemiBold`}>{eventName}</Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(eventName)}>
             <AntDesign name="delete" size={16} color={colorScheme === 'light' ? 'black' : 'white'} />
        </TouchableOpacity>
    </View>
  )
}

export default EventCard