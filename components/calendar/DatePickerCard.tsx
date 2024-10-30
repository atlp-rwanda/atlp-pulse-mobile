import { View, Text } from 'react-native'
import React from 'react'
import { Calendar } from 'react-native-calendars';
import CalendarHeader from './CalendarHeader';

const DatePickerCard = () => {
  return (
    <View className='mx-4 pb-3 mb-10 border-b-2 border-[#616161]'>
      <Calendar
        theme={{
          calendarBackground: "#020917",
          textSectionTitleColor: "#C5C5C5",   
          dayTextColor: "#C5C5C5",
          todayTextColor: "#fff",
          selectedDayBackgroundColor: "#020917",
          selectedDayTextColor: "#fff",
          textDisabledColor: "#D6C7A1",
        }}
        customHeader={()=>(<CalendarHeader/>)}
        onDayPress={(day) => console.log(day.dateString)}
        hideExtraDays={true}
        hideDayNames={false}
        hideArrows={true}
      />
    </View>
  )
}

export default DatePickerCard