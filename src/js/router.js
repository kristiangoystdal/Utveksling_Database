// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/home/Home.vue';
import Exchanges from '../components/exchanges/Exchanges.vue';
import EditExchange from '../components/exchanges/EditExchange.vue';
import Contact from '../components/windows/Contact.vue';
import Account from '../components/profile/Account.vue';
import Login from '../components/profile/Login.vue';
import NotFound from '../components/error/NotFound.vue';

import store from './store.js'; 

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/utvekslinger', name: 'Exchanges', component: Exchanges },
  { path: '/min_utveksling', name: 'EditExchange', component: EditExchange },
  { path: '/kontakt', name: 'Contact', component: Contact },
  { path: '/profil', name: 'Account', component: Account, meta: { requiresAuth: true } },
  { path: '/logg_inn', name: 'Login', component: Login },
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
