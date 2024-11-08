import { View, Text, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import DatePickerCard from './DatePickerCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_EVENTS } from '@/graphql/queries/event';
import { useQuery } from '@apollo/client';
import CalendarSkeleton from './CalendarSkeleton';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
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

  if (loading) return <CalendarSkeleton />;
  if (error) return <Text>Error fetching events: {error.message}</Text>;

  const events = data?.getEvents || [];

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const eventsForSelectedDate = events.filter((event: Event) => {
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    return dayjs(selectedDate).isSameOrAfter(start, 'day') && dayjs(selectedDate).isSameOrBefore(end, 'day');
  });

  return (
    <View className='justify-center items-center mb-10'>
      <View className='w-full flex-row justify-between items-center mb-8'>
        <Text className={`text-xl font-Inter-Bold px-1 rounded ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}>
          Calendar
        </Text>
      </View>
      <View>
        <DatePickerCard
          onDateChange={handleDateChange}
          events={events}
        />
      </View>

      <View className='w-full'>
        {eventsForSelectedDate.map((event: Event) => (
          <EventCard
            key={event.id}
            eventstarttime={event.timeToStart}
            eventName={event.title}
          />
        ))}
      </View>
    </View>
  );
};

export default CalendarBody;
