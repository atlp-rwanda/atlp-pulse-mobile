import { View, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from './CustomButton'
import InputField from './InputField';

export interface CreateEventProps {
    isvisible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  }

const CreateEventCard = ({isvisible,onConfirm,onCancel}:CreateEventProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const colorScheme = useColorScheme();


  const handleStartDateConfirm = (date:any) => {
    setStartDate(date.toLocaleDateString()); 
    setStartDatePickerVisibility(false)
  };

  const handleEndDateConfirm = (date:any) => {
    setEndDate(date.toLocaleDateString());
    setEndDatePickerVisibility(false)
  };

  const handleStartTimeConfirm = (date:any) => {
    setStartTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setStartTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (date:any) => {
    setEndTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setEndTimePickerVisibility(false);
  };

  return (

    <View className={`${colorScheme === 'light' ? 'bg-[#F1F4FF]' : 'bg-[#202020]'} w-full rounded-md`}>
        <View className={`mx-5 gap-6`}>
            <View className=' py-10 border-b border-[#616161] items-center'>
                <Text className={`${colorScheme === 'light' ? 'text-black' : 'text-white'} text-lg font-Inter-Bold`}>Add Event</Text>
            </View>

            <View className='gap-6 px-2'>
                <View className=' gap-6'>
                    <InputField
                    placeholder = 'Event Title'
                    />

                    <InputField
                    placeholder = 'Host Name'
                    />
                </View>
                <View className='flex-row justify-between gap-2'>
                    <TouchableOpacity  onPress={()=>setStartDatePickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = 'start Date'
                        value ={startDate}
                        editable={false}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>setEndDatePickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = 'End Date'
                        value = {endDate}
                        editable = {false}
                        />
                    </TouchableOpacity>

                    <DateTimePickerModal
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    onConfirm={handleStartDateConfirm}
                    onCancel={()=> setStartDatePickerVisibility(false)}
                    />

                    <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={handleEndDateConfirm}
                    onCancel={()=> setEndDatePickerVisibility(false)}
                    />
                    
                </View>
                <View className='flex-row justify-between gap-2'>
                    <TouchableOpacity onPress = {()=>setStartTimePickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = '--:-- --'
                        value ={startTime}
                        editable = {false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {()=>setEndTimePickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = '--:-- --'
                        value ={endTime}
                        editable = {false}
                        />
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        onConfirm={handleStartTimeConfirm}
                        onCancel={() => setStartTimePickerVisibility(false)}
                    />

                    <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        onConfirm={handleEndTimeConfirm}
                        onCancel={() => setEndTimePickerVisibility(false)}
                    />
                    
                </View>
            </View>
            <View className=' flex-row justify-between items-center px-2 mb-10'>
                <CustomButton
                title = 'Cancel'
                containerstyle = 'bg-[#585757]'
                textstyle = ' text-white font-Inter-Regular'
                isloading = {false}
                handlepress = {onCancel}
                />
                <CustomButton
                title = 'Save'
                containerstyle = 'bg-violet'
                textstyle = ' text-white font-Inter-Regular'
                isloading = {false}
                handlepress = {onConfirm}
                />
            </View>
        </View>
    </View>

  )
}

export default CreateEventCard