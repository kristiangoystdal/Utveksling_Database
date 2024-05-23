import { createApp } from 'vue';
import App from './App.vue';
import store from './js/store';
import { auth } from './js/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import vuetify from './plugins/vuetify'; // Import Vuetify
import router from './js/router.js'; // Import Vue Router
import { createI18n } from 'vue-i18n';
import en from './languages/en.json';
import no from './languages/no.json';

// Set up messages for vue-i18n
const messages = {
  en,
  no
};

// Create an i18n instance with the locale configuration
const i18n = createI18n({
  legacy: false, 
  locale: localStorage.getItem('language') || 'no', // default locale
  fallbackLocale: 'no', // fallback locale
  messages,
});

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(vuetify) // Use Vuetify
      .use(router) // Use Vue Router
      .use(i18n) // Use vue-i18n
      .mount('#app');
  }
  store.dispatch('fetchUser');
});
