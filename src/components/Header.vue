<template>
	<header>
		<div class="header-container">
			<router-link to="/" class="logo">
				<img src="../assets/images/ntnu.png" alt="Site Logo" />
				<span class="site-name">{{ $t("common.siteName") }}</span>
			</router-link>
			<div class="nav-and-language">
				<nav>
					<ul>
						<li>
							<router-link to="/">{{ $t("navbar.homeHeader") }}</router-link>
						</li>
						<li>
							<router-link to="/programs">{{
								$t("navbar.programHeader")
							}}</router-link>
						</li>
						<li>
							<router-link to="/myexchange">{{
								$t("navbar.myexchangeHeader")
							}}</router-link>
						</li>
						<li>
							<router-link to="/contact">{{
								$t("navbar.contactHeader")
							}}</router-link>
						</li>
						<li>
							<a @click="handleAuthClick">{{ authButtonText }}</a>
						</li>
					</ul>
				</nav>
				<div @click="toggleLanguage" class="language-switcher">
					<span :class="currentFlag" class="fi"></span>
					<v-icon>mdi-earth</v-icon>
					<div v-if="showLanguageDropdown" class="language-dropdown">
						<a @click="changeLanguage('en')">
							<span class="fi fi-gb"></span> English
						</a>
						<a @click="changeLanguage('no')">
							<span class="fi fi-no"></span> Norsk
						</a>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
import { mapGetters } from "vuex";
import { VIcon } from "vuetify/components";
import "flag-icons/css/flag-icons.min.css";

export default {
	name: "Header",
	components: {
		VIcon,
	},
	data() {
		return {
			showLanguageDropdown: false,
		};
	},
	computed: {
		...mapGetters(["isAuthenticated"]),
		authButtonText() {
			return this.isAuthenticated
				? this.$t("navbar.profileHeader")
				: this.$t("navbar.loginHeader");
		},
		currentFlag() {
			return this.$i18n.locale === "en" ? "fi-gb" : "fi-no";
		},
	},
	methods: {
		handleAuthClick() {
			if (this.isAuthenticated) {
				this.$router.push({ name: "Account" });
			} else {
				this.$router.push({ name: "Login" });
			}
		},
		toggleLanguage() {
			this.showLanguageDropdown = !this.showLanguageDropdown;
		},
		changeLanguage(lang) {
			this.$i18n.locale = lang;
			localStorage.setItem("language", lang);
			this.showLanguageDropdown = false;
		},
	},
};
</script>

<style scoped>
header {
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	width: 100%;
	top: 0;
	left: 0;
}

.header-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0 1rem;
}

.logo {
	display: flex;
	align-items: center;
	text-decoration: none;
	color: hsla(160, 100%, 37%, 1);
}

.logo img {
	height: 50px;
	width: 50px;
}

.site-name {
	margin-left: 0.5rem;
	font-size: 1.5rem;
	font-weight: bold;
}

.nav-and-language {
	display: flex;
	align-items: center;
}

nav ul {
	list-style-type: none;
	display: flex;
	gap: 1rem;
	padding: 0;
	margin: 0;
}

nav li {
	display: inline;
}

nav a {
	text-decoration: none;
	color: hsla(160, 100%, 37%, 1);
	font-weight: normal;
	transition: 0.4s;
	padding: 0.5rem;
}

@media (hover: hover) {
	nav a:hover {
		background-color: hsla(160, 100%, 37%, 0.2);
		cursor: pointer;
	}

	.language-switcher:hover {
		background-color: hsla(160, 100%, 37%, 0.2);
	}
}

.language-switcher {
	position: relative;
	display: flex;
	align-items: center;
	margin-left: 0.5rem;
	cursor: pointer;
	padding: 0.5rem;
}

.language-switcher .v-icon {
	cursor: pointer;
	font-size: 1.5rem;
	color: hsla(160, 100%, 37%, 1);
	margin-left: 0.5rem;
}

.language-dropdown {
	position: absolute;
	top: 100%;
	right: 0;
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	overflow: hidden;
}

.language-dropdown a {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	text-decoration: none;
	color: hsla(160, 100%, 37%, 1);
	transition: background-color 0.3s;
}

.language-dropdown a:hover {
	background-color: hsla(160, 100%, 37%, 0.2);
}

.fi {
	font-size: 1rem;
	margin-right: 0.5rem;
}
</style>
