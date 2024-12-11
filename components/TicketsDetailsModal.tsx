import { BlurView } from 'expo-blur';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, View, TouchableOpacity, useColorScheme } from 'react-native';

interface TicketDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    subject: string;
    message: string;
    status: string;
    user: { email: string };
    assignee: { email: string };
  } | null;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ visible, onClose, ticket }) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  if (!ticket) return null;

  return (
    <>
      <BlurView
        className="bg-primary-light dark:bg-primary-dark absolute justify-center items-center w-full h-full"
        intensity={90}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      ></BlurView>
      <Modal visible={visible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center ">
          <View className="w-4/5 p-5 rounded-lg bg-white dark:bg-primary-dark">
            <Text className="text-black dark:text-white text-xl font-bold mb-4">
              {t('tickets.ticketDetails')}
            </Text>
            <Text className="text-black dark:text-white">{t('tickets.ticketId')}</Text>
            <Text className="text-black dark:text-white font-bold mb-2">{ticket.id}</Text>
            <Text className="text-black dark:text-white">{t('tickets.sub')}</Text>
            <Text className="text-black dark:text-white font-bold mb-2">{ticket.subject}</Text>
            <Text className="text-black dark:text-white">{t('tickets.mess')}</Text>
            <Text className="text-black dark:text-white font-bold mb-2">{ticket.message}</Text>
            <Text className="text-black dark:text-white">{t('tickets.status')}</Text>
            <Text className="text-black dark:text-white font-bold mb-2">{ticket.status}</Text>
            <Text className="text-black dark:text-white">{t('tickets.assignedUser')}</Text>
            <Text className="text-black dark:text-white font-bold mb-2">{ticket.user?.email}</Text>
            <View className="flex flex-row">
              <TouchableOpacity
                onPress={onClose}
                className=" mt-4 border border-[#fff] dark:border-black bg-red-600 px-4 py-2 rounded ml-auto"
              >
                <Text className="text-white dark:text-black">{t('tickets.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TicketDetailsModal;
