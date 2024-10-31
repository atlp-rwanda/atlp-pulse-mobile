import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from './CustomButton'
import EventCard from './EventCard';
import DatePickerCard from './DatePickerCard';
import WorningCard from './WorningCard';
import CreateEventCard from './CreateEventCard';


const CalendarBody = () => {
  const [isWarningVisible, setWarningVisible] = useState(false);
  const [isCreateEventVisible, setCreateEventVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState('');
  const colorScheme = useColorScheme();

  const handleDeleteEvent = (eventName:any) => {
    setEventToDelete(eventName);
    setWarningVisible(true);
  };

  const handleConfirmDelete = () => {
    // Handle event deletion logic here
    console.log(`Deleting event: ${eventToDelete}`);
    setWarningVisible(false);
  };


  return (
    <View className=' justify-center items-center mb-10'>
      <View className='w-full flex-row justify-between items-center px-5 mb-8'>
        <Text className={`text-xl font-Inter-Bold rounded ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}>Calender</Text>
        <CustomButton
        title = 'Add Event'
        handlepress = {()=>setCreateEventVisible(true)}
        containerstyle = 'bg-violet'
        textstyle = ' text-white font-Inter-Regular'
        isloading = {false}
        />
      </View>
      <View className='w-full'>
        <DatePickerCard/>
      </View>

      <View className='w-full'>
        <EventCard
        eventName='Event 1' 
        onDelete={handleDeleteEvent}
        />
        <EventCard
        eventName='Event 1' 
        onDelete={handleDeleteEvent}
        />
      </View>
      {isWarningVisible && (
        <View className='absolute flex justify-center items-center bg-opacity-50'>
          <WorningCard
            isvisible={isWarningVisible}
            EventToDelete={eventToDelete}
            onCancel={()=>setWarningVisible(false)}
            onConfirm={handleConfirmDelete}
          />
        </View>
      )}

      {/* Centering the Create Event Card */}
      {isCreateEventVisible && (
        <View className='absolute bg-primary-light flex justify-center items-center bg-opacity-50 rounded-md'>
          <CreateEventCard
            isvisible={isCreateEventVisible}
            onCancel={()=>setCreateEventVisible(false)}
            onConfirm={handleConfirmDelete}
          />
        </View>
      )}
    </View>
  )
}

export default CalendarBody