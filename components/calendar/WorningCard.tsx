import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

export interface WorningProps {
  isvisible: boolean;
  EventToDelete: string; 
  onCancel: () => void;
  onConfirm: () => void;
}

const WorningCard = ({ isvisible, EventToDelete, onCancel, onConfirm }:WorningProps) => {
  const colorScheme = useColorScheme();
  return (
  
    <View className={`${colorScheme === 'light' ? 'bg-[#F1F4FF]' : 'bg-[#030F26]'} w-[85vw] p-7 flex-col justify-between gap-7 rounded-md`}>
        <View className=''>
            <Text className={`text-start ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}>Are You Sure, You Want To Delete Event '{EventToDelete}'?</Text>
        </View>
        <View className=' flex-row justify-between items-center'>
            <CustomButton
            title = 'No, Cancel'
            containerstyle = 'bg-[#585757]'
            textstyle = ' text-white font-Inter-Regular'
            isloading = {false}
            handlepress={onCancel}
            />
            <CustomButton
            title = 'Yes, Delete'
            containerstyle = 'bg-violet'
            textstyle = ' text-white font-Inter-Regular'
            isloading = {false}
            handlepress={onConfirm}
            />
        </View>
    </View>
  
  )
}

export default WorningCard