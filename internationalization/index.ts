import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from './locales/en.json';
import fr from './locales/fr.json';
import kin from './locales/kin.json';

const resources: Resource = {
  en: { translation: en },
  fr: { translation: fr },
  kin: { translation: kin },
};

const initI18n = async () => {
  const deviceLocale = Localization.locale.split("-")[0];
  let savedLanguage = await AsyncStorage.getItem("language") ?? deviceLocale;

  
  const supportedLanguages = ['en', 'fr', 'kin'];
  if (!supportedLanguages.includes(savedLanguage)) {
    savedLanguage = 'en';
    await AsyncStorage.setItem("language", savedLanguage);
  }

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      resources,
      lng: savedLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
};

export const changeLanguage = async (newLanguage: string) => {
  const supportedLanguages = ['en', 'fr', 'kin'];
  
  if (supportedLanguages.includes(newLanguage)) {
    await AsyncStorage.setItem("language", newLanguage); 
    i18n.changeLanguage(newLanguage);
  }
};

initI18n();

export default i18n;
