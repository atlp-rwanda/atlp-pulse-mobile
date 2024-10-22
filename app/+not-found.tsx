import { Link } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next'; 

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
      <View className="items-center justify-center flex-1 p-8">
        <View className="w-full mb-10 h-60">
          <Image
            source={require('@/assets/images/page_not_found.svg')}
            contentFit="contain"
            className="items-end justify-center mb-6"
            style={{ width: '100%', flex: 1 }}
          />
        </View>
        <Text className="text-2xl text-center font-Inter-Bold dark:text-white max-w-64">
        {t('notFound.title')}
        </Text>

        <Link href="/" className="mt-12">
          <View className="px-6 py-4 rounded-full bg-action-500">
            <Text className="text-lg text-white">{t('notFound.goHome')}</Text>
          </View>
        </Link>
      </View>
  );
}
