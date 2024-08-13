// src/i18n.js
import { createI18n } from 'vue-i18n';

// Import your JSON files
import no from '../languages/no.json';
import en from '../languages/en.json';

const messages = {
  no, // Norwegian language messages
  en, // English language messages
};

const i18n = createI18n({
  locale: 'no', // Default locale
  messages, // Messages for all locales
});

// Export the global i18n instance
export default i18n;

// Export a global translation function
export const translate = (key) => {
  return i18n.global.t(key);
};
