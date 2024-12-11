import { PUSH_NOTIFICATION_SUB, TICKETS_NOTS_SUB } from '@/graphql/mutations/notificationMutation';
import { getAllNotification } from '@/graphql/queries/Notifications.queries';
import { useLazyQuery, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useToast } from 'react-native-toast-notifications';

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
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}
interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  Delete: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  notifications: [],
  markRead: async () => {},
  markAllRead: async () => {},
  Delete: async () => {},
  deleteAll: async () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const toast = useToast();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fetchNotifications] = useLazyQuery(getAllNotification, {
    context: {
      headers: {
        Authorization: `Bearer ${AsyncStorage.getItem('authToken')}`,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getAllNotification) {
        setNotifications(data.getAllNotification);
        updateUnreadCount(data.getAllNotification);
      }
    },
    onError: (error) => {
      console.error('Failed to fetch notifications:', error);
      toast.show('Failed to fetch notifications', {
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
          setUnreadCount(unreadCount + 1);
          return updatedNotifications;
        });
      }
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
        toast.show('Failed to retrieve token.', {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(userToken as string);
        setUserId(decoded.userId);
      } catch (error) {
        toast.show(`Failed to decode token.${error}`, {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    }
  }, [userToken]);

  useSubscription(PUSH_NOTIFICATION_SUB, {
    onData: (data) => {
      const newNotification = data.data.data.pushNotification;
      setNotifications((prevNotifications) => {
        const updatedNotifications = [newNotification, ...prevNotifications];
        setUnreadCount(unreadCount + 1);
        return updatedNotifications;
      });
    },
    variables: {
      receiverId: userId,
    },
  });

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
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
        console.error('Error initializing notifications:', error);
        toast.show('Error loading notifications', {
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
  const handleMarkAsRead = async () => {
    setUnreadCount(unreadCount - 1);
  };

  const handleMarkAllAsRead = async () => {
    setUnreadCount(0);
  };

  const handleDelete = async () => {
    setUnreadCount(unreadCount - 1);
  };

  const handleDeleteAll = async () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        markRead: handleMarkAsRead,
        markAllRead: handleMarkAllAsRead,
        Delete: handleDelete,
        deleteAll: handleDeleteAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
