import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { AntDesign } from '@expo/vector-icons'

const CalendarHeader = () => {
  const DaysName = [{name:'Mo'},{name:'Tu'},{name:'We'},{name:'Th'},{name:'Fr'},{name:'Sa'},{name:'Su'}]
  return (
    <View className='flex-col'>
        <View className='flex-row justify-between items-center'>
            <Text className='text-xl font-Inter-Medium text-white'>Aug, 2024</Text>
            <View className=' flex-row gap-4'>
            <CustomButton
            title = 'Today'
            containerstyle = 'bg-violet'
            textstyle = ' text-white font-Inter-Regular'
            isloading = {false}
            />
            <View className='flex-row justify-center items-center text-white gap-3'>
                <TouchableOpacity className=''>
                <AntDesign name="left" size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className=''>
                <AntDesign name="right" size={16} color="white" />
                </TouchableOpacity>
            </View>
            </View>
        </View>
        <View className='flex-row px-4 gap-9 mt-5'>
            {DaysName.map((Day,index)=>(
                <Text key={index} className='text-white'>{Day.name}</Text>
            ))}
        </View>
    </View>
  )
}

export default CalendarHeader