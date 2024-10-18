import { Text, View } from '@/components/Themed';
import { Href, Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';

type RedirectParams = {
  path: string;
  dest: 'app' | 'web';
};

export default function Redirect() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const { path, dest } = useLocalSearchParams<RedirectParams>();

  useEffect(() => {
    (async () => {
      if (!path) {
        router.replace('/');
        return;
      }

      if (dest === 'web') {
        try {
          const url = path.startsWith('http') ? path : `https://${path}`;
          await Linking.openURL(url);
        } catch (error) {
          toast.show(t('error.unable_to_open_link'), {
            type: 'danger',
            duration: 5000,
            placement: 'top',
          });
        }
      } else {
        router.replace(path as Href);
      }
    })();
  }, [path, dest]);

  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-xl dark:text-white">{t('redirecting')}...</Text>
      <Link href="/" className="mt-12">
        <View className="px-4 py-3 rounded-full bg-action-500">
          <Text className="text-lg text-white">{t('go_to_home_screen')}</Text>
        </View>
      </Link>
    </View>
  );
}
