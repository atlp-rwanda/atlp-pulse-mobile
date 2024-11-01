import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';
import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface CalendarHeaderProps {
  currentDate: string;
  onChangeMonth: (newDate: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onChangeMonth }) => {
  const DaysName = [
    { name: 'Mo' },
    { name: 'Tu' },
    { name: 'We' },
    { name: 'Th' },
    { name: 'Fr' },
    { name: 'Sa' },
    { name: 'Su' },
  ];
  const colorScheme = useColorScheme();

  const formattedDate = dayjs(currentDate).format('MMM, YYYY');

  const handlePreviousMonth = () => {
    const newDate = dayjs(currentDate).subtract(1, 'month').format('YYYY-MM-DD');
    onChangeMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = dayjs(currentDate).add(1, 'month').format('YYYY-MM-DD');
    onChangeMonth(newDate);
  };

  return (
    <View className="flex-col">
      <View className="flex-row justify-between items-center">
        <Text
          className={`text-xl font-Inter-Medium ${colorScheme === 'light' ? 'text-[#585757]' : 'text-white'}`}
        >
          {formattedDate}
        </Text>
        <View className=" flex-row gap-4">
          <TouchableOpacity>
            <CustomButton
              title="Today"
              containerstyle="bg-violet"
              textstyle=" text-white font-Inter-Regular"
              isloading={false}
              handlepress={() => onChangeMonth(dayjs(new Date()).format('YYYY-MM-DD'))}
            />
          </TouchableOpacity>

          <View className="flex-row justify-center items-center text-white gap-3">
            <TouchableOpacity className={``} onPress={handlePreviousMonth}>
              <AntDesign
                name="left"
                size={16}
                color={colorScheme === 'light' ? '#585757' : 'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity className="" onPress={handleNextMonth}>
              <AntDesign
                name="right"
                size={16}
                color={colorScheme === 'light' ? '#585757' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex-row px-4 gap-9 mt-5">
        {DaysName.map((Day, index) => (
          <Text
            key={index}
            className={`${colorScheme === 'light' ? 'text-[#333333]' : 'text-white'}`}
          >
            {Day.name}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default CalendarHeader;
