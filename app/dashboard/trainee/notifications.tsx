import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllNotification } from '@/graphql/queries/Notifications.queries';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  deleteNotification,
  markAsRead,
  markAllAsRead,
} from '@/graphql/mutations/notificationMutation';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { enUS, fr, es, de } from 'date-fns/locale';

const rw = {
  code: 'rw',
  formatDistance: (token: string, count: number, options: any) => {
    const translations: { [key: string]: string } = {
      xSeconds: `amasegonda ${count}`,
      xMinutes: `iminota ${count}`,
      xHours: `amasaha ${count}`,
      xDays: `iminsi ${count}`,
      xMonths: `amezi ${count}`,
      xYears: `imyaka ${count}`,
    };

    let result = translations[token] || token;

    if (options?.addSuffix) {
      result = `hashize ${result}`;
    }

    return result;
  },
  formatLong: enUS.formatLong,
  formatRelative: enUS.formatRelative,
  localize: enUS.localize,
  match: enUS.match,
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  },
};

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  read: boolean;
  createdAt: string;
  receiver: string;
  sender: {
    id: string;
    email: string;
    role: string;
    profile: {
      name: string;
      avatar: string | null;
    };
  };
}

export const TICKETS_NOTS_SUB = gql`
  subscription OnTicket {
    sendNotsOnTickets {
      id
      message
      createdAt
      read
      receiver
      sender {
        id
        email
        role
        profile {
          name
          avatar
        }
      }
    }
  }
`;

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [delNotification] = useMutation(deleteNotification);
  const [readNotification] = useMutation(markAsRead);
  const [readAllNotification] = useMutation(markAllAsRead);
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'fr':
        return fr;
      case 'es':
        return es;
      case 'de':
        return de;
      case 'rw':
        return rw;
      default:
        return enUS;
    }
  };

  const [fetchNotifications] = useLazyQuery(getAllNotification, {
    context: {
      headers: {
        Authorization: `Bearer ${AsyncStorage.getItem('authToken')}`,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setIsLoading(false);
      if (data?.getAllNotification) {
        setNotifications(data.getAllNotification);
        updateUnreadCount(data.getAllNotification);
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.show(t('notifications.errorLoadingNotifications'), {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }
        await fetchNotifications({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } catch (error) {
        setIsLoading(false);
        toast.show(t('notifications.errorLoadingNotifications'), {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    };

    initializeNotifications();
  }, []);

  const updateUnreadCount = (notificationsList: Notification[]) => {
    const count = notificationsList.filter((notification) => !notification.read).length;
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token is missing');

      await readNotification({
        variables: { markAsReadId: id },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );

      updateUnreadCount(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      toast.show(t('notifications.errorMarkingAsRead'), { type: 'danger' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token is missing');

      await delNotification({
        variables: { deleteNotificationsId: id },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });

      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      toast.show(t('notifications.deleteSuccess'), { type: 'success' });
    } catch (error) {
      toast.show(t('notifications.deleteFailed'), { type: 'danger' });
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity className="bg-red-500 justify-center px-4" onPress={() => handleDelete(id)}>
      <Text className="text-white">{t('notifications.delete')}</Text>
    </TouchableOpacity>
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      onSwipeableOpen={() => handleDelete(item.id)}
    >
      <TouchableOpacity
        onPress={() => !item.read && handleMarkAsRead(item.id)}
        className="flex-row items-start p-4 border-b border-gray-200"
      >
        {item.sender.profile.avatar && (
          <Image
            source={{ uri: item.sender.profile.avatar }}
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <View className="flex-1">
          <View>
            <Text className={`font-bold ${textColor}`}>{item.sender.profile.name}</Text>
            <Text className={`font-bold ${textColor}`}>
              <Text className={`font-normal ${textColor}`}>{item.message}</Text>
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className={`text-xs ${textColor}`}>
            {formatDistanceToNowStrict(new Date(Number(item.createdAt)), {
              addSuffix: true,
              locale: getDateLocale(),
            })}
          </Text>
          {!item.read && <View className="w-4 h-4 bg-red-500 rounded-full" />}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const handleMarkAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token is missing');

      await readAllNotification({
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      setUnreadCount(0);

      toast.show(t('notifications.markAllAsReadSuccess'), { type: 'success' });
    } catch (error) {
      toast.show(t('notifications.errorMarkingAllAsRead'), { type: 'danger' });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className={`mt-2.5 text-xl ${textColor}`}>{t('notifications.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
          <View>
        <Text className={`text-lg font-semibold ${textColor}`}>{t('notifications.notifications')}</Text>
        </View>
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <View className="flex-row gap-4 space-x-4">
          <TouchableOpacity>
            <Text className={`text-lg font-semibold ${textColor}`}>{t('notifications.all')}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className={`text-lg ${textColor}`}>
              {t('notifications.unread')} ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text className="text-blue-500 text-sm">{t('notifications.markAllAsRead')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-500">{t('notifications.noNotifications')}</Text>
          </View>
        ) : (
          notifications.map((item) => <View key={item.id}>{renderNotification({ item })}</View>)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
