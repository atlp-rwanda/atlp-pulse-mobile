import { View, useColorScheme, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import CalendarHeader from './CalendarHeader';
import dayjs from 'dayjs';

type Event = {
  id: string;
  start: string;
  end: string;
};

type DatePickerCardProps = {
  onDateChange: (date: string) => void;
  events: Event[];
};

const DatePickerCard: React.FC<DatePickerCardProps> = ({ onDateChange, events }) => {
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const todayDate = dayjs().format('YYYY-MM-DD');

  const handleMonthChange = (newDate: string) => {
    setCurrentDate(newDate);
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    onDateChange(day.dateString);
  };

  const handleBlur = () => {
    setSelectedDate(null);
  };

  const getMarkedDates = () => {
    const markedDates: { [key: string]: any } = {};

    events.forEach((event) => {
      const startDate = dayjs(event.start);
      const endDate = dayjs(event.end);

      for (
        let date = startDate;
        date.isBefore(endDate) || date.isSame(endDate, 'day');
        date = date.add(1, 'day')
      ) {
        const dateString = date.format('YYYY-MM-DD');
        if (!markedDates[dateString]) {
          markedDates[dateString] = {
            marked: true,
            dotColor: '#8667F2',
            textColor: colorScheme === 'light' ? '#333333' : '#FFFFFF',
          };
        }
      }
    });

    markedDates[todayDate] = {
      ...markedDates[todayDate],
      selected: true,
      selectedColor: colorScheme === 'light' ? '#8667F24D' : '#8667F24D',
      selectedTextColor: '#FFFFFF',
    };

    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: colorScheme === 'light' ? '#FFFFFF' : '#8667F2',
        selectedTextColor: colorScheme === 'light' ? '#585757' : '#FFFFFF',
        dotColor: '#FFFFFF',
        customStyles: {
          container: {
            borderWidth: 2.3,
            borderColor: '#8667F2',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0.5,
          },
        },
      };
    }
    return markedDates;
  };

  return (
    <TouchableWithoutFeedback onPress={handleBlur}>
      <View className="pb-3 mb-10 border-b border-[#616161]">
        <Calendar
          key={currentDate}
          current={currentDate}
          onMonthChange={(month) => handleMonthChange(dayjs(month.dateString).format('YYYY-MM-DD'))}
          theme={{
            calendarBackground: colorScheme === 'light' ? '#FFFFFF' : '#020917',
            textSectionTitleColor: colorScheme === 'light' ? '#C5C5C5' : '#585757',
            dayTextColor: colorScheme === 'light' ? '#585757' : '#C5C5C5',
            todayTextColor: '#8667F24D',
            selectedDayBackgroundColor: '#020917',
            selectedDayTextColor: '#fff',
            textDisabledColor: '#D6C7A1',
          }}
          markingType="custom"
          markedDates={getMarkedDates()}
          customHeader={() => (
            <CalendarHeader currentDate={currentDate} onChangeMonth={handleMonthChange} />
          )}
          onDayPress={handleDayPress}
          hideExtraDays={true}
          hideDayNames={false}
          hideArrows={true}
          displayLoadingIndicator={true}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DatePickerCard;
