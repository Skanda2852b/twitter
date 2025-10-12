// frontend/lib/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: "Home",
      post: "Post",
      like: "Like",
      retweet: "Retweet",
      // Add all other translations...
    }
  },
  es: {
    translation: {
      home: "Inicio",
      post: "Publicar",
      like: "Me gusta",
      retweet: "Retweet",
      // Spanish translations...
    }
  },
  hi: {
    translation: {
      home: "होम",
      post: "पोस्ट",
      like: "पसंद",
      retweet: "रीट्वीट",
      // Hindi translations...
    }
  },
  // Add other languages...
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;