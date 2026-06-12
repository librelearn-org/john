import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nlTranslation from "./locales/nl.json";
import config from "./utils/config";

export function initI18n(lang: string = config.lang) {
  const lng = "nl";

  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      lng,
      fallbackLng: "nl",
      resources: {
        nl: nlTranslation,
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      initImmediate: false,
    });
  } else {
    i18n.changeLanguage(lng);
  }

  return i18n;
}