import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlepress, containerstyle, textstyle, isloading}:any) => {
  return (
    <TouchableOpacity 
    className={`bg-secondary rounded-xl justify-center items-center  ${containerstyle} ${isloading ? 'opacity-50' : ''}`}
    onPress={handlepress}
    activeOpacity={0.7}
    disabled = {isloading}
    >
      <Text className={`${textstyle}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton