import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HOME_EN from "@/locales/en/translation.json";
import HOME_VI from "@/locales/vi/translation.json";

export const locales = {
  en: "en",
  vi: "vi",
} as const;

export const resources = {
  en: {
    translation: HOME_EN,
  },
  vi: {
    translation: HOME_VI,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    ns: ["translation"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
