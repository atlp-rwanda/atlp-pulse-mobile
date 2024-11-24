import { useState, useEffect, useContext } from 'react';
import { useSubscription } from '@apollo/client';
import{ View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
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
NotificationSubscription,
TICKETS_NOTS_SUB,
PUSH_NOTIFICATION_SUB,
} from '@/graphql/mutations/notificationMutation';
import { jwtDecode } from 'jwt-decode';
import { NotificationContext } from '@/hooks/useNotification';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { enUS, fr, es, de } from 'date-fns/locale';
import { useRouter } from 'expo-router';
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
  type: string;
  referenceId?: string;
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

const Notifications = () => {
  const router = useRouter();
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
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { markRead , markAllRead, Delete } = useContext(NotificationContext);
  const [activeTab,setActiveTab] = useState('All')
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

  useSubscription(TICKETS_NOTS_SUB, {
    onData: ({ data }) => {
      const newNotification = data?.data?.sendNotsOnTickets;
      if (newNotification) {
        setNotifications((prevNotifications) => {
          const updatedNotifications = [newNotification, ...prevNotifications];
          updateUnreadCount(updatedNotifications);
          return updatedNotifications;
        });
      }
    },
  });
  
  useSubscription(PUSH_NOTIFICATION_SUB, {
    onData: (data) => {
      const newNotification = data.data.data.pushNotification;
      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        updateUnreadCount(updatedNotifications);
        return updatedNotifications;
      });
    },
    variables: {
      receiverId: userId,
    },
  });


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setUserToken(token);
        } else {
          toast.show('Token Not found.', { type: 'danger', placement: 'top', duration: 3000 });
        }
      } catch (error) {
        toast.show('Failed to retrieve token.', { type: 'danger', placement: 'top', duration: 3000 });
      } 
    };
    fetchToken();
  }, []);

  interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
  }
  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(userToken as string);
          setUserId(decoded.userId);
      } catch (error) {
        toast.show(`Failed to decode token.${error}`, { type: 'danger', placement: 'top', duration: 3000 });
      }
    }
  }, [userToken]);
  
  useSubscription(NotificationSubscription, {
    onData: (data) => {
      const newNotification = data.data.data.newRating;
      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        updateUnreadCount(updatedNotifications);
        return updatedNotifications;
      });
    },
    variables: {
      receiver: userId,
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

  const handleNotificationPress = async (notification: Notification) => {
    try {
      if (!notification.read) {
        await readNotification({
          variables: { markAsReadId: notification.id },
          context: {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}`,
            },
          },
        });
        markRead(notification.id);
      }
  
      if (
        notification.message.includes('New ticket assigned to you. Ticket ID:')
      ) {
        router.push(`/dashboard/trainee/tickets`);
        return;
      }
  
      switch (notification.type?.toLowerCase()) {
        case 'ticket':
          router.push('/dashboard/trainee/tickets');
          break;
        case 'attendance':
          router.push('/dashboard/trainee/Attendance');
          break;
        case 'performance':
        case 'rating':
          router.push('/dashboard/perfomance');
          break;
        case 'calendar':
          router.push('/dashboard/calendar');
          break;
        case 'docs':
          router.push('/dashboard/trainee/documentation');
          break;
        case 'help':
          router.push('/dashboard/trainee');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      toast.show(t('notifications.errorNavigating'), { 
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
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
       const notificationToDelete = notifications.find((notification) => notification.id === id);
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount((prevCount) => prevCount - 1);
        Delete(id);
      }
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
        onPress={() => handleNotificationPress(item)}
        className={`flex-row items-start p-4 border-b border-gray-200 ${
          !item.read 
            ? `border-l-4 border-l-primary ${bgColor}`
            : `${bgColor}`
        }`}
      >
        <View className={`justify-center items-center p-2 rounded-md w-10 h-10 ${
          !item.read 
            ? `${bgColor}`
            : `${bgColor}`
        }`}>
          {item.sender.profile.avatar && (
            <Image
              source={{ uri: item.sender.profile.avatar }}
              className="w-8 h-8 rounded-full"
            />
          )}
        </View>
        
        <View className="flex-1 ml-3">
          <Text className={`${textColor}`}>
            {item.message.split(/"([^"]+)"/g).map((part, i) => {
              if (i % 2 === 0) {
                return part;
              }
              return <Text key={i} className="font-bold">{part}</Text>;
            })}
          </Text>
          <View className="flex-row items-center mt-1 space-x-1">
            <Text className="text-xs text-gray-500 italic">
              {item.sender.profile.name || item.sender.email}
            </Text>
            <Text className="text-xs text-gray-500">-</Text>
            <Text className="text-xs text-gray-500 italic">
              {formatDistanceToNowStrict(new Date(Number(item.createdAt)), {
                addSuffix: true,
                locale: getDateLocale(),
              })}
            </Text>
          </View>
        </View>
        
        {!item.read && (
          <View className="w-3 h-3 rounded-full bg-primary ml-2" />
        )}
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
      markAllRead();

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
  const filteredNotifications =
    activeTab === 'All' ? notifications : notifications.filter((notification) => !notification.read);

  return (
    <SafeAreaView className={`flex ${bgColor}`}>
          <View>
        <Text className={`text-lg font-semibold ${textColor}`}>{t('notifications.notifications')}</Text>
        </View>
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <View className="flex-row gap-4 space-x-4">
          <TouchableOpacity onPress={() => setActiveTab('All')}>
            <Text className={`text-lg  ${activeTab === 'All' ? 'text-action-400 font-semibold' : textColor}`}>{t('notifications.all')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() =>  setActiveTab('Unread')}>
            <Text className={`text-lg  ${activeTab === 'Unread' ? 'text-action-400 font-semibold' : textColor}`}>
              {t('notifications.unread')} ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text className="text-blue-500 text-sm">{t('notifications.markAllAsRead')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredNotifications.length === 0 ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-500">{t('notifications.noNotifications')}</Text>
          </View>
        ) : (
          filteredNotifications.map((item) => <View key={item.id}>{renderNotification({ item })}</View>)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
