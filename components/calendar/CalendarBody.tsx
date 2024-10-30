import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from './CustomButton'
import EventCard from './EventCard';
import DatePickerCard from './DatePickerCard';
import WorningCard from './WorningCard';
import CreateEventCard from './CreateEventCard';

const CalendarBody = () => {
  const handlecreate = async()=>{

  }
  return (
    <View className=' justify-center items-center mb-10'>
      <View className='w-full flex-row justify-between items-center px-5 mb-8'>
        <Text className='text-xl font-Inter-Bold text-white rounded'>Calender</Text>
        <CustomButton
        title = 'Add Event'
        handlepress = {handlecreate}
        containerstyle = 'bg-violet'
        textstyle = ' text-white font-Inter-Regular'
        isloading = {false}
        />
      </View>
      <View className='w-full'>
        <DatePickerCard/>
      </View>

      <View className='w-full'>
        <EventCard/>
        <EventCard/>
      </View>
      <View className=''>
        <WorningCard/>
      </View>
      <View className='w-full'>
        <CreateEventCard/>
      </View>
    </View>
  )
}

export default CalendarBody