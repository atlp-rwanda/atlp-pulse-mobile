// ActionsDropdown.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { copy, eye } from '@/assets/Icons/dashboard/Icons';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard';

interface ActionsDropdownProps {
  ticketId: string;
  onView: () => void;
  onClose: () => void;
}

export default function ActionsDropdown({ ticketId, onView, onClose }: ActionsDropdownProps) {
  const toast = useToast();
  const { t } = useTranslation();
  const handleCopyId = () => {
    try {
      if (ticketId) {
        Clipboard.setString(ticketId);
        toast.show(t('tickets.copySuccess'), { type: 'success' });
        onClose();
      } else {
        toast.show(t('tickets.idNotFound'), { type: 'danger' });
      }
    } catch (error) {
      toast.show(t('tickets.copyFail'), { type: 'danger' });
    }
  };

  return (
    <View className="absolute right-0 bg-white border border-gray-300 rounded-md shadow-md p-2 w-24">
      <TouchableOpacity
        onPress={() => {
          onView();
          onClose();
        }}
        className="py-2 flex-row items-center gap-1"
      >
        <SvgXml xml={eye} />
        <Text className="text-black">{t('tickets.view')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCopyId} className="py-2 flex-row items-center gap-1">
        <SvgXml xml={copy} />
        <Text className="text-black">{t('tickets.copy')}</Text>
      </TouchableOpacity>
    </View>
  );
}
