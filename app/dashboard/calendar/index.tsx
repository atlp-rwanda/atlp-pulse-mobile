import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarBody from '@/components/calendar/CalendarBody'

const Calendar = () => {
  return (
    <SafeAreaView>
        <ScrollView>
            <CalendarBody/>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Calendar