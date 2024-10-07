import { Link } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';

export default function NotFoundScreen() {
  return (
    <>
      <View className="flex-1 justify-center items-center p-8">
        <View className="h-60 w-full mb-10">
          <Image
            source={require('@/assets/images/page_not_found.svg')}
            contentFit="contain"
            className="mb-6 justify-center items-end"
            style={{ width: '100%', flex: 1 }}
          />
        </View>
        <Text className="text-2xl font-Inter-Bold dark:text-white text-center max-w-64">
          Oops! We can't find the page you're looking for.
        </Text>

        <Link href="/" className="mt-12">
          <View className="py-4 px-6 bg-action-500 rounded-full">
            <Text className="text-lg text-white">Go to home screen!</Text>
          </View>
        </Link>
      </View>
    </>
  );
}
