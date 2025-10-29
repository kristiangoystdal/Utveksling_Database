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
  {  path: '/faq', name: 'FAQ', component: FAQ  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Navigation guard for authentication and admin access
  const isAuthenticated = store.getters.isAuthenticated; // Check if user is authenticated
  const adminUserId = import.meta.env.VITE_ADMIN_USER_ID; // Admin user ID from .env
  const currentUserId = store.getters.user?.uid; // Get the current user's ID

  // Admin gate: Only allow access to Admin route if user is authenticated and is the admin
  if (to.name === 'Admin' && (!isAuthenticated || currentUserId !== adminUserId)) {
    return next({ name: 'Home' }); // Redirect unauthorized users to the home page
  }

  // Redirect authenticated users away from the login page
  if (to.name === 'Login' && isAuthenticated) {
    return next({ name: 'Account' }); // Redirect to the Account page or Home page
  }

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    return next({ name: 'Login' }); // Redirect unauthenticated users to the login page
  }



  next(); // Proceed to the route if all checks pass
});

export default router;
