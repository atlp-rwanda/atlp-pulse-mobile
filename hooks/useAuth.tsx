import React, { createContext, ReactNode, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getInitialState = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('auth');
    if (storedUser) return JSON.parse(storedUser);
  } catch (error) {
    console.error('Failed to load user from AsyncStorage:', error);
  }
  return { name: '', role: 'user', auth: false, notifications: [] };
};

interface User {
  name: string;
  role: string;
  auth: boolean;
  notifications: any[];
  email?: string;
  firstName?: string;
  id?: string;
  profileImage?: string;
  userId?: string;
}

interface UserContextType {
  user: User;
  setName: (name: string) => void;
  setProfileImage: (profileImage: string) => void;
  login: (data: any) => void;
  logout: (reason?: string) => void;
  setNotificationData: (data: any) => void;
  addNotification: (notification: any) => void;
}

interface Props {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: '',
    role: 'user',
    auth: false,
    notifications: [],
  });

  useEffect(() => {
    const loadUser = async () => {
      const initialUser = await getInitialState();
      setUser(initialUser);
    };
    loadUser();
  }, []);

  const login = async (data: any) => {
    const userData = {
      name: data.user?.profile?.name,
      firstName: data.user?.profile?.firstName,
      auth: true,
      role: data.user?.role,
      email: data.user.email,
      userId: data.user?.id,
      notifications: user.notifications,
    };

    try {
      await AsyncStorage.setItem('auth', JSON.stringify(userData));
      await AsyncStorage.setItem('auth_token', data.token);
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const logout = async (reason: string = '') => {
    try {
      await AsyncStorage.removeItem('auth');
      await AsyncStorage.removeItem('auth_token');
      if (reason !== 'expired') await AsyncStorage.setItem('loggedout', '1');
      setUser({ name: '', role: 'user', auth: false, notifications: [] });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const setName = (name: string) => {
    setUser((prevUser) => ({ ...prevUser, name }));
  };

  const setProfileImage = (profileImage: string) => {
    setUser((prevUser) => ({ ...prevUser, profileImage }));
  };

  const setNotificationData = (data: any) => {
    setUser((prevUser) => ({ ...prevUser, notifications: data }));
  };

  const addNotification = (notification: any) => {
    setUser((prevUser) => ({
      ...prevUser,
      notifications: [notification, ...prevUser.notifications],
    }));
  };

  const value = useMemo(
    () => ({
      user,
      setName,
      setProfileImage,
      login,
      logout,
      setNotificationData,
      addNotification,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
