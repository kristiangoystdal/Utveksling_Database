<template>
	<header>
		<div class="header-container">
			<router-link to="/" class="logo">
				<img src="../../assets/images/logo.png" alt="Site Logo" />
				<span class="site-name">{{ $t("common.siteName") }}</span>
			</router-link>
			<div class="nav-and-language">
				<!-- <div class="hamburger-menu" @click="toggleMobileMenu">
					<v-icon>mdi-menu</v-icon>
				</div> -->
				<nav :class="{ open: showMobileMenu }">
					<ul>
						<li>
							<router-link to="/" @click="closeMobileMenu">{{
								$t("navbar.homeHeader")
							}}</router-link>
						</li>
						<li>
							<router-link to="/utvekslinger" @click="closeMobileMenu">{{
								$t("navbar.programHeader")
							}}</router-link>
						</li>
						<li>
							<router-link to="/min_utveksling" @click="closeMobileMenu">{{
								$t("navbar.myexchangeHeader")
							}}</router-link>
						</li>
						<li>
							<a @click="handleAuthClick">{{ authButtonText }}</a>
						</li>
					</ul>
				</nav>
				<div
					ref="languageSwitcher"
					@click="toggleLanguage"
					class="language-switcher"
				>
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
			showMobileMenu: false,
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
			this.closeMobileMenu();
		},
		toggleLanguage() {
			this.showLanguageDropdown = !this.showLanguageDropdown;
		},
		changeLanguage(lang) {
			this.$i18n.locale = lang;
			localStorage.setItem("language", lang);
			this.showLanguageDropdown = false;
		},
		handleClickOutside(event) {
			if (
				this.$refs.languageSwitcher &&
				!this.$refs.languageSwitcher.contains(event.target)
			) {
				this.showLanguageDropdown = false;
			}
		},
		toggleMobileMenu() {
			this.showMobileMenu = !this.showMobileMenu;
		},
		closeMobileMenu() {
			this.showMobileMenu = false;
		},
	},
	mounted() {
		document.addEventListener("click", this.handleClickOutside);
	},
	beforeDestroy() {
		document.removeEventListener("click", this.handleClickOutside);
	},
};
</script>

<style scoped>
header {
	background-color: var(--fourth-color) !important;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
	width: 100% !important;
	top: 0 !important;
	left: 0;
	border-radius: 0 0 10px 10px;
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
	color: var(--second-color);
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
	color: var(--first-color);
	font-weight: normal;
	transition: 0.4s;
	padding: 0.5rem;
	cursor: pointer;
}

@media (hover: hover) {
	nav a:hover {
		background-color: var(--third-color);
		cursor: pointer;
	}

	.language-switcher:hover {
		background-color: var(--third-color);
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
	color: var(--second-color);
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
	color: var(--first-color);
	transition: background-color 0.3s;
}

.language-dropdown a:hover {
	background-color: var(--fourth-color);
}

.fi {
	font-size: 1rem;
	margin-right: 0.5rem;
}

.hamburger-menu {
	display: none;
	cursor: pointer;
}

@media (max-width: 768px) {
	.logo {
		margin-left: 0;
		width: 50vw;
		left: 0;
		padding: 0%;
	}
	.logo img {
		height: 40px;
		width: 40px;
		margin: 10px 0;
	}
	.logo .site-name {
		font-size: 1.1rem;
	}

	.hamburger-menu {
		display: flex;
		align-items: center;
	}

	nav {
		display: none;
		position: absolute;
		top: 60px;
		left: 0;
		background-color: var(--fourth-color);
		width: 100%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}

	nav.open {
		display: block;
	}

	nav ul {
		flex-direction: column;
		padding: 1rem 0;
	}

	nav li {
		display: block;
		text-align: center;
	}

	nav a {
		display: block;
		width: 100%;
	}

	.language-dropdown {
		top: 40px;
		right: 0;
		z-index: 10000;
	}

	.language-dropdown a {
		padding: 0.5rem 1rem;
		height: 3rem;
	}
}
</style>