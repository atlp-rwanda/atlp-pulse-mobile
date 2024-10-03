import { logo } from "@/components/icons/auth/icons";
import { avatar, avatarlight, burger_menu, gitdark, gitlight, homedark, homelight, messagedark, messagelight, notifications_black, notifications_white, phonedark, phonelight, pulse, toggle_dark, toggle_light } from "@/components/icons/icons";
import { View, Text } from "@/components/Themed";
import { Pressable, ScrollView, TouchableOpacity, useColorScheme ,Image  } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Svg, SvgXml } from "react-native-svg";
// import { Image } from "expo-image";
import ExpoImage from "expo-image/build/ExpoImage";
import { useContext, useEffect, useState } from "react";
import { GET_PROFILE, GET_TRAINEE_PROFILE } from "@/graphql/mutations/user";
import { useLazyQuery, useQuery } from "@apollo/client";
import { UserContext } from "@/hooks/useAuth";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useToast } from 'react-native-toast-notifications'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

type TabKey = "About" | "Organisation";
export default function Profile(){
    const colorScheme = useColorScheme();
    const [selectedType, setSelectedType] = useState<TabKey>("About");
    const [type, setType] = useState<string[]>(["About", "Organisation"]);
    const [userToken, setUserToken] = useState<string | null>(null);
    const params = useLocalSearchParams();
    const toast = useToast();
    const handleTypeChange = (type: string) => {
        setSelectedType(type as TabKey);
      };
    const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';

 useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setUserToken(token);
      } else {
        toast.show('User token not found.', {type: 'danger', placement: 'top', duration: 3000});
      }
    };
    fetchToken();
  }, []);
  
    console.log('userToken', userToken);

    const { data, loading, error } = useQuery(GET_PROFILE, {
        context: {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
        skip: !userToken, 
      });
    
      console.log('data', data);

    return(
        
        < View className="flex-1 ">
         <><View className="items-center w-[100%] h-[30%] mb-16">

                            <Image
                                source={require('@/assets/images/andela.jpeg')}
                                resizeMode="cover"
                                style={{ width: '100%', height: '100%', borderRadius: 15 }} />

                            <View
                                className="items-center w-40 h-40 "
                                style={{
                                    position: 'absolute',
                                    bottom: -40,
                                    alignSelf: 'flex-start',
                                    left: 20,
                                }}
                            >
                                <Image
                                    source={require('@/assets/images/avatar.png')}
                                    resizeMode="cover"
                                    style={{ width: '100%', height: '100%', borderRadius: 100, borderColor: 'white', borderWidth: 3 }} />
                            </View>
                        </View><View className="flex-row justify-between items-center p-1  w-[100%] h-[8%] ">
                                {type.map((tabType, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => handleTypeChange(tabType)}
                                        className={`border-b-2 border-action-500 h-[70%] w-[49%] items-center shadow-s shadow-action-500 justify-center rounded-lg 

              ${colorScheme === 'dark' ? 'text-primary-dark bg-secondary-dark-700' : 'text-secondary-light bg-secondary-light-200'}
              ${selectedType === tabType ? 'border-action-500' : 'border-transparent'}`}

                                    >
                                        <Text
                                            className={`text-xl
        ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark'}
        ${selectedType === tabType ? 'text-action-500 font-bold' : ''}`}
                                        >
                                            {tabType}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View></>

            {
            selectedType === 'About'?(
            <>
            <View className={`${bgColor} h-[38%] w-[100%] p-6 rounded-md `}>
                <Text className={`${textColor} text-xl `}>BASIC INFORMATION</Text>
                <View className="flex-row gap-5 m-2 ">
                    {
                        colorScheme === 'dark'?
                        <SvgXml xml={avatarlight} width={20} height={20} />:
                        <SvgXml xml={avatar} width={20} height={20} />}
                    <Text className={`${textColor} text-lg`}>{
                    data.getProfile?.name?
                    data.getProfile?.name:'Unavailable'
                    }</Text>
                </View>
                <View className="flex-row gap-5 m-2 ">
                    {
                        colorScheme === 'dark'?
                        <SvgXml xml={messagelight} width={20} height={20} />:
                        <SvgXml xml={messagedark} width={20} height={20} />}
                    <Text className={`${textColor} text-lg`}>{
                    data.getProfile?.email?
                    data.getProfile?.email:'Unavailable'
                    }</Text>
                </View>
                <View className="flex-row gap-5 m-2 ">
                    {
                        colorScheme === 'dark'?
                        <SvgXml xml={phonelight} width={20} height={20} />:
                        <SvgXml xml={phonedark} width={20} height={20} />}
                    <Text className={`${textColor} text-lg`}>{
                    data.getProfile?.phoneNumber?
                    data.getProfile?.phoneNumber:'Unavailable'
                    }</Text>
                </View>
                <View className="flex-row gap-5 m-2 ">
                    {
                        colorScheme === 'dark'?
                        <SvgXml xml={homelight} width={20} height={20} />:
                        <SvgXml xml={homedark} width={20} height={20} />}
                    <Text className={`${textColor} text-lg`}>{
                    data.getProfile?.address?
                    data.getProfile?.address:'Unavailable'
                    }</Text>
                </View>
                <View className="flex-row gap-5 m-2 ">
                    {
                        colorScheme === 'dark'?
                        <SvgXml xml={gitlight} width={20} height={20} />:
                        <SvgXml xml={gitdark} width={20} height={20} />}
                    <Text className={`${textColor} text-lg`}>{
                    data.getProfile?.resume?
                    data.getProfile?.resume:'Unavailable'
                    }</Text>
                </View>
                
                <Text className={`${textColor} text-xl `}>RESUME</Text>
                <Text className={`${textColor} text-md m-2 `}>{
                    data.getProfile?.resume?
                    data.getProfile?.resume:'No Resume uploaded yet'
                    }</Text>
                </View>

                <View className={`${bgColor} h-[10%] w-[100%] p-6 rounded-md mt-5 `}>
                <Text className={`${textColor} text-xl `}>BIOGRAPHY</Text>
                <Text className={`${textColor} text-md m-2`}>{
                    data.getProfile?.biography?
                    data.getProfile?.biography:'No Biography uploaded yet'
                    }</Text>
                </View>
                </>
             ) :('')
            }
                {
            selectedType === 'Organisation'?
            <>
                <View className={`flex-row gap-5  bg-action-500 p-2 w-[100%] h-[10%] rounded-t-3xl`} >
                    <View className="w-[15%] h-[90%] rounded-full bg-primary-light flex justify-center items-center">
                        <SvgXml xml={pulse}/>
                    </View>
                    <View>
                    <Text className={`text-primary-light text-lg text-bold`}>Andela</Text>
                    <Text className={`text-primary-light text-lg text-bold`}>Andela.pulse.com</Text>
                    </View>
                </View>
                <View className={`${bgColor} h-[20%] w-[100%] p-4 rounded-md mt-3 text-bold `}>
                <Text className={`${textColor} text-xl `}>YOUR ORGANISATION DETAILS</Text>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Organisation Name:</Text>
                    <Text className={`${textColor} text-lg`}>Andela</Text>
                </View>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Admin email:</Text>
                <Text className={`${textColor} text-lg`}>devpulse@proton.me</Text>
                </View>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Role:</Text>
                <Text className={`${textColor} text-lg`}>trainee</Text>
                </View>
                </View>
                <View className={`${bgColor} h-[22%] w-[100%] p-4 rounded-md mt-3 text-bold `}>
                <Text className={`${textColor} text-xl `}>MANAGEMENT</Text>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Program:</Text>
                    <Text className={`${textColor} text-lg`}>ATLP 1</Text>
                </View>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Cohort :</Text>
                <Text className={`${textColor} text-lg`}>Cohort 1</Text>
                </View>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Team:</Text>
                <Text className={`${textColor} text-lg`}>Team 1</Text>
                </View>
                <View className="flex-row gap-5 m-1 ">
                <Text className={`${textColor} text-lg`}>Phase:</Text>
                <Text className={`${textColor} text-lg`}>Phase 1</Text>
                </View>
                </View>

            </>
            :''
        }
     
        </View>
    )
}

