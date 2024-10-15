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
    let savedLanguage = await AsyncStorage.getItem("language");
    if (!savedLanguage) {
      savedLanguage = Localization.locale;
      await AsyncStorage.setItem("language",savedLanguage)
    }
  
    i18n.use(initReactI18next).init({
      compatibilityJSON: "v3",
      resources,
      lng: savedLanguage,
      fallbackLng: "pt-BR",
      interpolation: {
        escapeValue: false,
      },
    });
  };
  
  initI18n();
  
  export default i18n;