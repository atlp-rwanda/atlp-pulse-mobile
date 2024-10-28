import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from './CustomButton'

const CalendarBody = () => {
  const handlecreate = async()=>{

  }
  return (
    <View className=''>
      <View className=' flex-row justify-between items-center px-5 mb-8'>
        <Text className='text-xl font-Inter-Bold text-white'>Calender</Text>
        <CustomButton
        title = 'Add Event'
        handlepress = {handlecreate}
        containerstyle = 'bg-violet h-[30px] w-[95px] rounded-[3px]'
        textstyle = ' text-white font-Inter-Regular'
        isloading = {false}
        />
      </View>
      <View className='flex-row justify-between items-center px-5'>
        <Text className='text-xl font-Inter-Medium text-white'>Aug, 2024</Text>
        <View className=' flex-row'>
          <CustomButton
          title = 'Today'
          handlepress = {handlecreate}
          containerstyle = 'bg-violet h-[30px] w-[70px] rounded-[3px]'
          textstyle = ' text-white font-Inter-Regular'
          isloading = {false}
          />
          <View className='flex-row justify-center items-center text-white gap-1'>
            <TouchableOpacity className=''>
               <AntDesign name="left" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className=''>
               <AntDesign name="right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CalendarBody