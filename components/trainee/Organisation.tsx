

import React from 'react';
import { View, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { pulse } from '../icons/icons';
interface Profile {
  user?: {
	organizations?: string;
	role?: string;
	team?: {
	  cohort?: {
		program?: {
		  name?: string;
		};
		name?: string;
		phase?: {
		  name?: string;
		};
	  };
	  name?: string;
	};
  };
}

interface TraineeOrgProps {
  profile: Profile;
  bgColor: string;
  textColor: string;
}

const TraineeOrg: React.FC<TraineeOrgProps> = ({ profile, bgColor, textColor }) => {
  return (
	<>
	  <View className={`flex-row gap-5 bg-action-500 p-2 w-[100%] rounded-t-3xl`}>
		<View className="w-[50] h-[50] rounded-full bg-primary-light flex justify-center items-center">
		  <SvgXml xml={pulse} />
		</View>
		<View>
		  <Text className={`text-primary-light text-lg text-bold`}>Andela</Text>
		  <Text className={`text-primary-light text-lg text-bold`}>Andela.pulse.com</Text>
		</View>
	  </View>
	  <View className={`${bgColor} w-[100%] p-4 rounded-md mt-3 text-bold `}>
		<Text className={`${textColor} text-xl `}>YOUR ORGANISATION DETAILS</Text>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Organisation Name:</Text>
		  <Text className={`${textColor} text-lg`}>{profile.user?.organizations?.[0] || 'Unavailable'}</Text>
		</View>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Admin email:</Text>
		  <Text className={`${textColor} text-lg`}>devpulse@proton.me</Text>
		</View>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Role:</Text>
		  <Text className={`${textColor} text-lg`}>{profile.user?.role || 'Unavailable'}</Text>
		</View>
	  </View>
	  <View className={`${bgColor} w-[100%] p-4 rounded-md mt-3 text-bold mb-14`}>
		<Text className={`${textColor} text-xl `}>MANAGEMENT</Text>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Program:</Text>
		  <Text className={`${textColor} text-lg`}>{profile.user?.team?.cohort?.program?.name || 'Unavailable'}</Text>
		</View>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Cohort :</Text>
		  <Text className={`${textColor} text-lg`}>{profile.user?.team?.cohort?.name || 'Unavailable'}</Text>
		</View>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Team:</Text>
		  <Text className={`${textColor} text-lg`}>{profile.user?.team?.name || 'Unavailable'}</Text>
		</View>
		<View className="flex-row gap-5 m-1 ">
		  <Text className={`${textColor} text-lg`}>Phase:</Text>
		  <Text className={`${textColor} text-lg`}>{profile.user?.team?.cohort?.phase?.name || 'Unavailable'}</Text>
		</View>
	  </View>
	</>
  );
};

export default TraineeOrg;