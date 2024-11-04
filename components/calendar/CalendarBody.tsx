import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import EventCard from './EventCard';
import DatePickerCard from './DatePickerCard';
import WorningCard from './WorningCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_EVENTS} from '@/graphql/queries/event';
import { useQuery } from '@apollo/client';

type Event = {
  id: string;
  title: string;
  hostName: string;
  start: string;
  end: string;
  timeToStart: string;
  timeToEnd: string;
};

const CalendarBody = () => {
  const [isWarningVisible, setWarningVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState('');
  const colorScheme = useColorScheme();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setAuthToken(token);
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    getAuthToken();
  }, []);
  
  const { loading, error, data } = useQuery(GET_EVENTS, {
    variables: { authToken },
    skip: !authToken,
  });


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
      </View>
      <View className='w-full'>
        <DatePickerCard/>
      </View>

      <View className='w-full'>
      {data?.getEvents?.map((event: Event) => (
        <EventCard
        key={event.id}
        eventName={event.title}
        onDelete={handleDeleteEvent}
        />
      ))}
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

    </View>
  )
}

export default CalendarBody

