// src/js/store.js
import { createStore } from 'vuex';
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    fetchUser({ commit }) {
      onAuthStateChanged(auth, user => {
        commit('setUser', user ? { uid: user.uid, email: user.email } : null);
      });
    }
  },
  getters: {
    user: state => state.user,
    isAuthenticated: state => !!state.user,
  }
});
