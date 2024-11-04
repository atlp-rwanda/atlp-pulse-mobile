import { View, Text, useColorScheme, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars';
import CalendarHeader from './CalendarHeader';
import dayjs,{ Dayjs } from 'dayjs'


type DatePickerCardProps = {
  onDateChange: (date: string) => void;
};

const DatePickerCard :React.FC<DatePickerCardProps> = ({ onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const todayDate = dayjs().format('YYYY-MM-DD');
  
  const handleMonthChange = (newDate:string | Dayjs) => {
    const formattedDate = typeof newDate === 'string' ? newDate : newDate.format('YYYY-MM-DD');
    setCurrentDate(formattedDate)
    console.log(newDate)
  }

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    onDateChange(day.dateString);
  };

  const handleBlur = () => {
    setSelectedDate(null);
  };

  return (
    <TouchableWithoutFeedback onPress={handleBlur}>
      <View className='mx-4 pb-3 mb-10 border-b border-[#616161]'>
        <Calendar
          key={currentDate}
          current={currentDate}
          onMonthChange={(month) => handleMonthChange(dayjs(month.dateString).format('YYYY-MM-DD'))}
          theme={{
            calendarBackground: colorScheme === 'light' ? '#FFFFFF' : '#020917',
            textSectionTitleColor: colorScheme === 'light' ? '#C5C5C5' : ' #585757',   
            dayTextColor: colorScheme === 'light' ? '#585757' : '#C5C5C5',
            todayTextColor: "#8667F24D",
            selectedDayBackgroundColor: "#020917",
            selectedDayTextColor: "#fff",
            textDisabledColor: "#D6C7A1",
          }}
          markingType="custom"
          markedDates={{
            [todayDate]: {
              selected: true,
              selectedColor: colorScheme === 'light' ? '#8667F24D' : '#8667F24D',
              selectedTextColor: '#FFFFFF',
            },
            ...(selectedDate && {
            [selectedDate]: {
              customStyles: {
                container: {
                  borderWidth: 3,
                  borderColor: '#8667F2',
                  borderRadius: 16, 
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 0.5,
                },
                text: {
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                },
              },
            },
          }),
          }}
          customHeader={()=>(
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
  )
}

export default DatePickerCard