//@ts-nocheck
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import CountryFlag from 'react-native-country-flag';


const LANGUAGES = [
  { code: 'kin', label: 'Kinyarwanda', flagCode: 'RW' },
  { code: 'en', label: 'English', flagCode: 'GB' },
  { code: 'fr', label: 'Français', flagCode: 'FR' },
];

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setModalVisible(false);
  };

  const getCurrentLanguageLabel = () => {
    return LANGUAGES.find(lang => lang.code === language)?.label || 'English';
  };

  const bgColor = colorScheme === 'dark' ? '#1a1a1a' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.6}
          style={styles.selectorWrapper}
        >
          <View style={styles.languageOption}>
            <View style={styles.flagWrapper}>
              <CountryFlag 
                isoCode={LANGUAGES.find(lang => lang.code === language)?.flagCode || 'GB'} 
                size={24} 
              />
            </View>
            <Text style={[styles.selectedLanguageText, { color: textColor }]}>
              {getCurrentLanguageLabel()}
            </Text>
            <Text style={[styles.chevron, { color: textColor }]}>▼</Text>
          </View>
        </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalView, { backgroundColor: bgColor }]}>
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
              onPress={e => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Select Language
              </Text>
              
              <View style={styles.pickerContainer}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      language === lang.code && styles.selectedOption
                    ]}
                    onPress={() => changeLanguage(lang.code)}
                  >
                    <CountryFlag isoCode={lang.flagCode} size={24} />
                    <Text style={[
                      styles.languageOptionText,
                      { color: textColor },
                      language === lang.code && styles.selectedOptionText
                    ]}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor:"white"
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  flagWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedLanguageText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  selectedLanguageText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    width: '100%',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  languageOptionText: {
    fontSize: 18,
    marginLeft: 12,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#2196F3',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});