import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const WorningCard = () => {
  return (
    <View className=' bg-slate-600 w-[85vw] p-7 flex-col justify-between gap-7 rounded-md'>
        <View className=''>
            <Text className=' text-start text-white'>Are You Sure, You Want To Delete Event 'Event 2'?</Text>
        </View>
        <View className=' flex-row justify-between items-center'>
            <CustomButton
            title = 'No, Cancel'
            containerstyle = 'bg-[#585757]'
            textstyle = ' text-white font-Inter-Regular'
            isloading = {false}
            />
            <CustomButton
            title = 'Yes, Delete'
            containerstyle = 'bg-violet'
            textstyle = ' text-white font-Inter-Regular'
            isloading = {false}
            />
        </View>
    </View>
  )
}

export default WorningCard