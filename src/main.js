import './assets/css/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from './js/store';
import { auth } from './js/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import vuetify from './plugins/vuetify'; // Import Vuetify
import router from './js/router.js'; // Import Vue Router

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
      .use(store)
      .use(vuetify) // Use Vuetify
      .use(router) // Use Vue Router
      .mount('#app');
  }
  store.dispatch('fetchUser');
});
