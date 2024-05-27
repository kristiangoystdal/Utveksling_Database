// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/windows/Home.vue';
import Exchanges from '../components/windows/Exchanges.vue';
import EditExchange from '../components/windows/EditExchange.vue';
import Contact from '../components/windows/Contact.vue';
import Account from '../components/windows/Account.vue';
import Login from '../components/windows/Login.vue';
import NotFound from '../components/NotFound.vue';
import CreditsTable from '../components/CreditsTable.vue';
import store from './store.js'; // Assuming your Vuex store is in src/store

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/exchanges', name: 'Exchanges', component: Exchanges },
  { path: '/myexchange', name: 'EditExchange', component: EditExchange },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/account', name: 'Account', component: Account, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  // { path: "/credits", name: "Credits", component: CreditsTable}, 
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
