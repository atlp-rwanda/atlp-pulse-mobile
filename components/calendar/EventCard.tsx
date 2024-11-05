import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import dayjs from 'dayjs';

interface EventCardProps {
  eventName: string;
  eventstarttime : string;
}

const EventCard = ({ eventName,eventstarttime}:EventCardProps) => {
  const colorScheme = useColorScheme();
  
  const todayDate = dayjs().format('YYYY-MM-DD');

  const fullDateTimeString = `${todayDate} ${eventstarttime}`;
  
  const timeToStart = dayjs(fullDateTimeString, 'YYYY-MM-DD HH:mm').format('hh:mm A');
  
  return (
    <View className={`${colorScheme === 'light' ? 'bg-[#F2F2F2]' : 'bg-[#030F26]'}  flex-row justify-between items-center mx-5 px-5 mb-3 rounded-md`}>
        <View className=' gap-[7px]'>
            <Text className={`${colorScheme === 'light' ? 'text-[ #666666]' : 'text-white'} mt-3 text-sm`}>{timeToStart}</Text>
            <Text className={`${colorScheme === 'light' ? 'text-[ #666666]' : 'text-white'} mb-3 text-lg font-Inter-SemiBold`}>{eventName}</Text>
        </View>
    </View>
  )
}

export default EventCard