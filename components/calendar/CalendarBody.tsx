import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import EventCard from './EventCard';
import DatePickerCard from './DatePickerCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_EVENTS} from '@/graphql/queries/event';
import { useQuery } from '@apollo/client';
import dayjs,{ Dayjs } from 'dayjs'

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
  const [selectedDate, setSelectedDate] = useState<string | null>(dayjs().format('YYYY-MM-DD'));
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

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching events: {error.message}</Text>;

  // Get today's date in the format of your events' start dates
  const today = dayjs().format('YYYY-MM-DD');

  // Filter events to only include today's events
  const todayEvents = data?.getEvents?.filter((event: Event) => {
    const eventDate = dayjs(event.start).format('YYYY-MM-DD'); // Assuming start holds the date
    return eventDate === today;
  });

  const handleDateChange = (date: string) => {
    setSelectedDate(date); // Update the selected date based on user's choice
  };

  return (
    <View className=' justify-center items-center mb-10'>
      <View className='w-full flex-row justify-between items-center px-5 mb-8'>
        <Text className={`text-xl font-Inter-Bold rounded ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}>Calender</Text>
      </View>
      <View className='w-full'>
        <DatePickerCard
        onDateChange={handleDateChange}
        />
      </View>

      <View className='w-full'>
      {todayEvents?.map((event: Event) => (
          <EventCard
            key={event.id}
            eventstarttime={event.timeToStart}
            eventName={event.title}
          />
        ))}
      </View>
    </View>
  )
}

export default CalendarBody

