import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '@/components/LanguagePicker';


type Page = {
  image: any;
  content: string;
};

export default function AppOnboarding() {
  const { t, i18n } = useTranslation(); 
  const colorScheme = useColorScheme();
  const pagerViewRef = useRef<PagerView>(null);
  const [page, setPage] = useState<number>(0);

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  
  const getDotColor = (index: number) => (index === page ? 'bg-action-500' : 'bg-white');
  const [token, setToken] = useState<string | null>(null);
  

  useEffect(() => {
    
    const interval = setInterval(() => {
      setPage(page === 2 ? 0 : page + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [page]);

  useEffect(() => {
    pagerViewRef.current?.setPage(page);
  }, [page]);

  const pages: Page[] = [
    {
      image: require('@/assets/images/onboarding/1.png'),
      content: t('onboarding.page1'), 
    },
    {
      image: require('@/assets/images/onboarding/2.png'),
      content: t('onboarding.page2'),
    },
    {
      image: require('@/assets/images/onboarding/3.png'),
      content: t('onboarding.page3'),
    },
  ];

  return (
    <>
      {/* Pager View for Onboarding Screens */}
      <PagerView
        initialPage={page}
        style={{ minHeight: 580 }}
        onPageSelected={(p) => setPage(p.nativeEvent.position)}
        ref={pagerViewRef}
      >
        
        {pages.map((page, index) => (
          <View key={index} className={`flex-1 px-8 py-12 ${bgColor}`}>
            <Image
              source={page.image}
              contentFit="contain"
              className="items-end justify-center mb-6"
              style={{ width: '100%', flex: 1 }}
            />
            <Text
              style={{ fontSize: 24 }}
              className={`font-Inter-SemiBold text-center leading-9 ${textColor}`}
            >
              {page.content}
            </Text>
          </View>
        ))}
      </PagerView>

      {/* Pagination Dots */}
      <View className={`flex-1 flex-row justify-center items-center gap-3 ${bgColor}`}>
        <View className={`rounded-full w-4 h-4 ${getDotColor(0)}`}></View>
        <View className={`rounded-full w-4 h-4 ${getDotColor(1)}`}></View>
        <View className={`rounded-full w-4 h-4 ${getDotColor(2)}`}></View>
      </View>
      
      {/* Language Switcher */}
      <View className="mb-4">
        <LanguagePicker />
      </View>


      {/* Get Started Button */}
      <View className={`flex-1 flex-row justify-center items-center ${bgColor}`}>
        <TouchableOpacity>
          <Text
            className="text-lg font-Inter-Medium dark:text-white"
            onPress={() => router.push('/auth/login')}
          >
            {t('onboarding.getStarted')} 
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
