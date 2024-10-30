import { View, Text, TextInput } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const CreateEventCard = () => {
  return (
    <View className='w-full'>
        <View className='mx-5 gap-6'>
            <View className=' py-10 border-b-2 border-[#616161] items-center'>
                <Text className='text-white text-lg'>Add Event</Text>
            </View>

            <View className='gap-6 px-2'>
                <View className=' gap-6'>
                    <TextInput
                    placeholder='Event Title'
                    placeholderTextColor='#7b7b8b'
                    className=' border border-violet py-1 pl-3 h-10 rounded-md items-center font-Inter-SemiBold text-white'
                    />

                    <TextInput
                    placeholder='Host Name'
                    placeholderTextColor='#7b7b8b'
                    className=' border border-violet py-1 pl-3 h-10 rounded-md font-Inter-SemiBold text-white'
                    />
                </View>
                <View className='flex-row justify-between gap-2'>
                    <TextInput
                        placeholder='Start Date'
                        placeholderTextColor='#7b7b8b'
                        className='w-44 border border-violet py-1 pl-3 h-10 rounded-md items-center font-Inter-SemiBold text-white'
                    />
                    <TextInput
                        placeholder='End Date'
                        placeholderTextColor='#7b7b8b'
                        className='w-44 border border-violet py-1 pl-3 h-10 rounded-md items-center font-Inter-SemiBold text-white'
                    />
                </View>
                <View className='flex-row justify-between gap-2'>
                    <TextInput
                        placeholder='----:-- --'
                        placeholderTextColor='#7b7b8b'
                        className='w-44 border border-violet py-1 pl-3 h-10 rounded-md items-center font-Inter-SemiBold text-white'
                    />
                    <TextInput
                        placeholder='----:-- --'
                        placeholderTextColor='#7b7b8b'
                        className='w-44 border border-violet py-1 pl-3 h-10 rounded-md items-center font-Inter-SemiBold text-white'
                    />
                </View>
            </View>
            <View className=' flex-row justify-between items-center px-2'>
                <CustomButton
                title = 'Cancel'
                containerstyle = 'bg-[#585757]'
                textstyle = ' text-white font-Inter-Regular'
                isloading = {false}
                />
                <CustomButton
                title = 'Save'
                containerstyle = 'bg-violet'
                textstyle = ' text-white font-Inter-Regular'
                isloading = {false}
                />
            </View>
        </View>
    </View>
  )
}

export default CreateEventCard