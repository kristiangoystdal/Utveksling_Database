// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/home/Home.vue';
import Exchanges from '../components/exchanges/Exchanges.vue';
import EditExchange from '../components/exchanges/EditExchange.vue';
import Contact from '../components/windows/Contact.vue';
import Account from '../components/profile/Account.vue';
import Login from '../components/profile/Login.vue';
import FAQ from '../components/windows/FAQ.vue';
import Admin from '../components/admin/Admin.vue';
import NotFound from '../components/error/NotFound.vue';

import store from './store.js';
import { translate } from './i18n';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/utvekslinger', name: 'Exchanges', component: Exchanges },
  { path: '/min_utveksling', name: 'EditExchange', component: EditExchange },
  { path: '/kontakt', name: 'Contact', component: Contact },
  { path: '/profil', name: 'Account', component: Account, meta: { requiresAuth: true } },
  { path: '/logg_inn', name: 'Login', component: Login },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/faq', name: 'FAQ', component: FAQ },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Navigation guard for authentication
  const isAuthenticated = store.getters.isAuthenticated;
  const adminUserId = import.meta.env.VITE_ADMIN_USER_ID; // Load the admin user ID from .env file
  const currentUserId = store.getters.user.uid; // Assuming you have a getter for the current user ID

  if (to.name === 'Login' && isAuthenticated) {
    return next({ name: 'Account' }); // Redirect to Home or another page (e.g., Account)
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to the login page if not authenticated
    return next({ name: 'Login' });
  }

  if (to.name === 'Admin' && currentUserId !== adminUserId) {
    // Redirect to the home page if the user is not the admin
    return next({ name: 'Home' });
  }

  next();
});

export default router;
