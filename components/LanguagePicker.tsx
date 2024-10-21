import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import CountryFlag from 'react-native-country-flag';
import { changeLanguage } from '@/internationalization';

const LANGUAGES = [
  { code: 'kin', labelKey: 'languages.kinyarwanda', flagCode: 'RW' },
  { code: 'en', labelKey: 'languages.english', flagCode: 'GB' },
  { code: 'fr', labelKey: 'languages.french', flagCode: 'FR' },
];

export default function LanguagePicker() {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

  const getCurrentLanguageLabel = () => {
    return t(LANGUAGES.find(lang => lang.code === i18n.language)?.labelKey || 'languages.english');
  };

  const handleLanguageChange = async (code: string) => {
    await changeLanguage(code);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.6}
        className="p-2 bg-white rounded dark:bg-primary-dark"
      >
        <View className="flex-row items-center p-4">
          <CountryFlag 
            isoCode={LANGUAGES.find(lang => lang.code === i18n.language)?.flagCode || 'GB'} 
            size={24} 
          />
          <Text className="flex-1 ml-3 text-lg font-medium text-gray-900 dark:text-white">
            {getCurrentLanguageLabel()}
          </Text>
          <Text className="ml-2 text-xs text-gray-600 opacity-50 dark:text-gray-300">▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          className="items-center justify-center flex-1 bg-black bg-opacity-50"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className="w-4/5 p-6 bg-white rounded-lg dark:bg-gray-800">
            <TouchableOpacity 
              className="w-full"
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
            >
              <Text className="mb-4 text-xl font-semibold text-center text-gray-900 dark:text-white">
                {t('selectLanguage')}
              </Text>

              <View>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    className={`flex-row items-center p-3 rounded mb-2 ${
                      i18n.language === lang.code ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onPress={() => handleLanguageChange(lang.code)}
                  >
                    <CountryFlag isoCode={lang.flagCode} size={24} />
                    <Text className={`text-lg ml-3 text-gray-900 dark:text-white ${
                      i18n.language === lang.code ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
                    }`}>
                      {t(lang.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                className="p-3 mt-4 bg-blue-600 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-lg font-semibold text-center text-white">{t('close')}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
