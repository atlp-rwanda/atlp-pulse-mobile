import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from './CustomButton'
import InputField from './InputField';

const CreateEventCard = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);


  const handleStartDateConfirm = (date:any) => {
    setStartDate(date.toLocaleDateString()); 
    setStartPickerVisibility(false)
  };

  const handleEndDateConfirm = (date:any) => {
    setEndDate(date.toLocaleDateString());
    setEndPickerVisibility(false)
  };

  const handleStartTimeConfirm = (date:any) => {
    setStartTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setStartPickerVisibility(false);
  };

  const handleEndTimeConfirm = (date:any) => {
    setEndTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setEndPickerVisibility(false);
  };

  return (
    <View className='w-full'>
        <View className='mx-5 gap-6'>
            <View className=' py-10 border-b-2 border-[#616161] items-center'>
                <Text className='text-white text-lg'>Add Event</Text>
            </View>

            <View className='gap-6 px-2'>
                <View className=' gap-6'>
                    <InputField
                    placeholder = 'Event Title'
                    value = ''
                    editable = {true}
                    />

                    <InputField
                    placeholder = 'Host Name'
                    value = ''
                    editable = {true}
                    />
                </View>
                <View className='flex-row justify-between gap-2'>
                    <TouchableOpacity  onPress={()=>setStartPickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = 'start Date'
                        value ={startDate}
                        editable={false}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>setEndPickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = 'End Date'
                        value = {endDate}
                        editable = {false}
                        />
                    </TouchableOpacity>

                    <DateTimePickerModal
                    isVisible={isStartPickerVisible}
                    mode="date"
                    onConfirm={handleStartDateConfirm}
                    onCancel={()=> setStartPickerVisibility(false)}
                    />

                    <DateTimePickerModal
                    isVisible={isEndPickerVisible}
                    mode="date"
                    onConfirm={handleEndDateConfirm}
                    onCancel={()=> setEndPickerVisibility(false)}
                    />
                    
                </View>
                <View className='flex-row justify-between gap-2'>
                    <TouchableOpacity onPress = {()=>setStartTimePickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = '----:-- --'
                        value ={startTime}
                        editable = {false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {()=>setEndTimePickerVisibility(true)} className='w-44'>
                        <InputField
                        placeholder = '----:-- --'
                        value ={endTime}
                        editable = {false}
                        />
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isStartPickerVisible}
                        mode="time"
                        onConfirm={handleStartTimeConfirm}
                        onCancel={() => setStartPickerVisibility(false)}
                    />

                    <DateTimePickerModal
                        isVisible={isEndPickerVisible}
                        mode="time"
                        onConfirm={handleEndTimeConfirm}
                        onCancel={() => setEndPickerVisibility(false)}
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