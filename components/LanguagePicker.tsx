import React, { useState } from 'react';
import { View, Text,useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const colorScheme = useColorScheme();

  const changeLanguage = (lang:any) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-white';

  return (
    <View className={`p-4 rounded-lg ${bgColor}`}>
      <Picker
        testID="language-picker"
        selectedValue={language}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
        style={{ color: colorScheme === 'dark' ? 'white' : 'black', padding: 10 }}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Français" value="fr" />
        <Picker.Item label="Kinyarwanda" value="kin" />
      </Picker>
    </View>
  );
}
