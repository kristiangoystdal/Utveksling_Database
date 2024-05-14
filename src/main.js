import './assets/css/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from './js/store';
import { auth } from './js/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import vuetify from './plugins/vuetify'; // Import Vuetify

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(vuetify) // Use Vuetify
      .mount('#app');
  }
  store.dispatch('fetchUser');
});
