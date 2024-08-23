import { createApp } from "vue";
import App from "./App.vue";
import store from "./js/store";
import { auth } from "./js/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import vuetify from "./plugins/vuetify";
import router from "./js/router.js";
import { createI18n } from "vue-i18n";
import en from "./languages/en.json";
import no from "./languages/no.json";
import { i18nMixin } from "./mixins/i18nMixin"; // Import the mixin
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import "./assets/css/main.css";
import "./assets/css/bg.css";
import "./assets/css/btn.css";
import "./assets/css/card.css";
import "./assets/css/dialog.css";
import "./assets/css/footer.css";
import "./assets/css/form.css";
import "./assets/css/navbar.css";
import "./assets/css/txt.css";
import "./assets/css/boxes.css";
import "./assets/css/datatable.css";
import "./assets/css/expansion-panel.css";
import "./assets/css/profile-card.css";
import "./assets/css/custom-toastify.css";

// Set up messages for vue-i18n
const messages = {
	en,
	no,
};

// Create an i18n instance with the locale configuration
const i18n = createI18n({
	legacy: false,
	locale: localStorage.getItem("language") || "no", // default locale
	fallbackLocale: "no", // fallback locale
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
			.mixin(i18nMixin) // Register the mixin globally
			.use(Vue3Toastify, {
				closeOnClick: true,
				pauseOnHover: true,
				position: "bottom-right",
				hideProgressBar: false,
			})
			.mount("#app");
	}
	store.dispatch("fetchUser");
});
