import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import PagerView from 'react-native-pager-view';

type Page = {
  image: any;
  content: string;
};

const pages: Page[] = [
  {
    image: require('@/assets/images/onboarding/1.png'),
    content: "Optimize your organization's potential with Performance Management/Analytics.",
  },
  {
    image: require('@/assets/images/onboarding/2.png'),
    content: 'Identify top performers, discover hidden talent, and optimize your workforce.',
  },
  {
    image: require('@/assets/images/onboarding/3.png'),
    content: 'Unlock the potential of a Continuous & Tight Feedback Loop.',
  },
];

export default function AppOnboarding() {
  const colorScheme = useColorScheme();
  const pagerViewRef = useRef<PagerView>(null);
  const [page, setPage] = useState<number>(0);

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  const getDotColor = (index: number) => (index === page ? 'bg-action-500' : 'bg-white');

  useEffect(() => {
    const interval = setInterval(() => {
      setPage(page === 2 ? 0 : page + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [page]);

  useEffect(() => {
    pagerViewRef.current?.setPage(page);
  }, [page]);

  return (
    <>
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
              className="mb-6 justify-center items-end"
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
      <View className={`flex-1 flex-row justify-center items-center gap-3 ${bgColor}`}>
        <View className={`rounded-full bg-action-500 w-4 h-4 ${getDotColor(0)}`}></View>
        <View className={`rounded-full w-4 h-4 ${getDotColor(1)}`}></View>
        <View className={`rounded-full w-4 h-4 ${getDotColor(2)}`}></View>
      </View>
      <View className={`flex-1 flex-row justify-center items-center ${bgColor}`}>
        <TouchableOpacity>
          <Text
            className="text-lg font-Inter-Medium dark:text-white"
            onPress={() => router.push('/redirect?path=/auth/login&dest=app')}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
