import { View, Text, TextInput } from 'react-native'
import React from 'react'

const InputField = ({placeholder, value, editable}:any) => {
    
  return (
    <TextInput
    placeholder= {placeholder}
    value={value}
    placeholderTextColor='#7b7b8b'
    className='border border-violet py-1 pl-3 h-10 rounded-md items-center font-Inter-SemiBold text-white'
    editable= {editable}
    />
  )
}

export default InputField