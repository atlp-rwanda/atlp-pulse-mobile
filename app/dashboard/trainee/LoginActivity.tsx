import { GET_LOGIN_ACTIVITIES } from '@/graphql/queries/loginActivity';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';
import { useState, useEffect, Key } from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import SkeletonLoader from './LoginActivitySkeleton';
import { useTranslation } from 'react-i18next';

interface Profile {
  __typename: string;
  activity: any[];
}
interface Response {
  getProfile: Profile;
}
interface LoginActivity {
  date: string;
  country_name: string;
  city: string;
  state: string;
  IPv4: string;
  latitude: number;
  longitude: number;
  country_code: string;
  postal: string;
  failed: number;
}

export default function LoginActivity() {
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const toast = useToast();
  const [page, setPage] = useState(1);
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-gray-500' : 'bg-gray-500';
  const inputbg = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';
  // Fetch user token from AsyncStorage
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setUserToken(token);
      } else {
        toast.show(t('sprintRating.user_token_not_found'), { type: 'danger' });
      }
    };
    fetchToken();
  }, []);
  const { loading, data, error } = useQuery(GET_LOGIN_ACTIVITIES, {
    context: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
    skip: !userToken,
  });

  useEffect(() => {
    if (error) {
      setLoginActivities([]);
    }
  }, [error]);

  let fetchedData = data?.getProfile.activity || [];
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleGoBack = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  const pageSize = 12;
  const totalActivities = fetchedData.length;
  const totalPages = Math.ceil(totalActivities / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalActivities);
  const displayActivities = fetchedData.slice(startIndex, endIndex);

  return (
    <View>
      <Text className={`font-bold text-3xl text-center ${textColor}`}>
        {t('loginActivity.title')}
      </Text>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View className="pt-5 rounded-tl-sm rounded-tr-sm">
            <View className="flex flex-row bg-[#5856D6] h-12 rounded-tl-md rounded-tr-md">
              <Text className="w-52 border-r border-r-[#808080] p-2 text-white text-center font-bold">
              {t('loginActivity.Date')}
              </Text>
              <Text className="w-32 p-2 border-r border-r-[#808080] text-white  text-center font-bold">
              {t('loginActivity.CountryName')}
              </Text>
              <Text className="w-24 border-r border-r-[#808080] p-2 text-white text-center font-bold">
              {t('loginActivity.City')}
              </Text>
              <Text className="w-24 border-r border-r-[#808080] p-2 text-white text-center font-bold">
              {t('loginActivity.State')}
              </Text>
              <Text className="w-36 border-r border-r-[#808080] p-2 text-white text-center font-bold">
              {t('loginActivity.IPv4')}
              </Text>
              <Text className="w-28  p-2 text-white text-center font-bold">
              {t('loginActivity.Attempt')}
              </Text>
            </View>
            {displayActivities.length === 0 ? (
              <Text className={`${textColor} text-center font-bold p-10`}>
                {t('loginActivity.Nologinactivitiesyet')}
              </Text>
            ) : (
              displayActivities.map((item: any, index: Key | null | undefined) => (
                <View key={index} className="flex flex-row border-b border-b-[#808080]">
                  <Text
                    className={`${textColor} w-52 border-r border-r-[#808080] border-l border-l-[#808080] p-2  text-center`}
                  >
                    {new Date(Number(item.date)).toLocaleString()}
                  </Text>
                  <Text
                    className={` ${textColor} w-32 border-r border-r-[#808080] p-2  text-center`}
                  >
                    {item.country_name === null ? 'N/A' : item.country_name}
                  </Text>
                  <Text
                    className={`${textColor} w-24 border-r border-r-[#808080] p-2  text-center`}
                  >
                    {item.city === null ? 'N/A' : item.city}
                  </Text>
                  <Text
                    className={`${textColor} w-24 border-r border-r-[#808080] p-2  text-center`}
                  >
                    {item.state === null ? 'N/A' : item.state}
                  </Text>
                  <Text
                    className={`${textColor} w-36 border-r border-r-[#808080] p-2  text-center`}
                  >
                    {item.IPv4 === null ? 'N/A' : item.IPv4}
                  </Text>
                  <Text
                    className={`${textColor} w-28 border-r border-r-[#808080] p-2  text-center`}
                  >
                   {item.failed === 0 ? t('loginActivity.Failed') : t('loginActivity.Success')}

                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      <View className="flex flex-row justify-center gap-5 items-center pt-2">
        <Text className={`${textColor}`}>
        {t('loginActivity.Page{page}of{totalPages}', { page, totalPages })}

        </Text>
        {page > 1 && (
          <TouchableOpacity
            onPress={() => handleGoBack()}
            style={[{ padding: 8, borderRadius: 8, backgroundColor: '#6B7280' }]}
          >
            <Text style={{  color: '#FFFFFF' }}>{t('loginActivity.Previous')}
            </Text>
          </TouchableOpacity>
        )}
        {page < totalPages && (
          <TouchableOpacity
            onPress={() => handleLoadMore()}
            style={{ padding: 8, backgroundColor: '#3B82F6', borderRadius: 8 }}
          >
            <Text style={{ marginLeft: 2, color: textColor, backgroundColor: '#3B82F6' }}>
            {t('loginActivity.Next')}

            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
