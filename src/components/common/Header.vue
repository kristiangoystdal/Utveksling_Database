<template>
	<header>
		<div class="header-container">
			<router-link to="/" class="logo">
				<img src="../../assets/images/logo.png" alt="Site Logo" />
				<span class="site-name">{{ $t("common.siteName") }}</span>
			</router-link>
			<div class="nav-and-language">
				<nav :class="{ open: showMobileMenu }">
					<ul>
						<li>
							<router-link to="/">{{ $t("navbar.homeHeader") }}</router-link>
						</li>
						<li>
							<router-link to="/utvekslinger">{{
								$t("navbar.programHeader")
							}}</router-link>
						</li>
						<li>
							<router-link to="/min_utveksling">{{
								$t("navbar.myexchangeHeader")
							}}</router-link>
						</li>
						<li ref="profileSwitcher">
							<a @click="toggleProfileDropdown">{{ authButtonText }}</a>
							<div v-if="showProfileDropDown" class="profile-dropdown">
								<div class="profile-content">
									<div v-if="user != null">
										<div class="username">{{ userData.displayName }}</div>
										<v-btn @click="signOut">
											{{ $t("operations.signOut") }}
										</v-btn>
									</div>
									<div v-else>
										<div class="username">{{ $t("operations.signIn") }}</div>
										<v-btn
											class="login-btn"
											@click="loginWithGoogle"
											color="primary"
											dark
											style="
												display: flex;
												align-items: center;
												justify-content: center;
											"
										>
											<v-icon
												left
												class="icon-spacing"
												style="
													display: inline-flex;
													vertical-align: middle;
													margin-right: 8px;
												"
												>mdi-google</v-icon
											>
											<span
												style="
													display: inline-flex;
													align-items: center;
													vertical-align: middle;
													padding-top: 1px;
												"
												>{{ $t("userHandling.loginWithGoogle") }}</span
											>
										</v-btn>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</nav>
				<div
					ref="languageSwitcher"
					@click="toggleLanguageDropdown"
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
	import { auth, db, provider } from "../../js/firebaseConfig";
	import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
	import { ref as dbRef, get, set, update } from "firebase/database";

	export default {
		name: "Header",
		components: {
			VIcon,
		},
		data() {
			return {
				showLanguageDropdown: false,
				showMobileMenu: false,
				showProfileDropDown: false,
				userData: null,
				user: null,
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
			toggleProfileDropdown() {
				this.showProfileDropDown = !this.showProfileDropDown;
				if (this.showProfileDropDown) {
					this.showLanguageDropdown = false;
				}
			},
			toggleLanguageDropdown() {
				this.showLanguageDropdown = !this.showLanguageDropdown;
				if (this.showLanguageDropdown) {
					this.showProfileDropDown = false;
				}
			},
			changeLanguage(lang) {
				this.$i18n.locale = lang;
				localStorage.setItem("language", lang);
				this.showLanguageDropdown = false;
			},
			handleClickOutside(event) {
				if (
					this.$refs.languageSwitcher &&
					!this.$refs.languageSwitcher.contains(event.target) &&
					this.$refs.profileSwitcher &&
					!this.$refs.profileSwitcher.contains(event.target)
				) {
					this.showLanguageDropdown = false;
					this.showProfileDropDown = false;
				}
			},
			async signOut() {
				try {
					await signOut(auth);
					this.user = null;
					this.userData = null;
					this.$router.go();
				} catch (error) {
					console.error("Error signing out: ", error);
				}
			},
			async loginWithGoogle() {
				try {
					const result = await signInWithPopup(auth, provider);
					this.user = result.user;
					this.showProfileDropDown = false;
					this.$router.go();
				} catch (error) {
					console.error("Error during sign-in:", error);
				}
			},
		},
		mounted() {
			document.addEventListener("click", this.handleClickOutside);

			// Handle user authentication state
			onAuthStateChanged(auth, async (currentUser) => {
				if (currentUser) {
					this.user = currentUser;
					const userDocRef = dbRef(db, `users/${currentUser.uid}`);
					const userDoc = await get(userDocRef);
					if (userDoc.exists()) {
						this.userData = userDoc.val();
					} else {
						// If user does not exist, show edit dialog
						this.localEditData = {
							displayName: currentUser.displayName || "",
							email: currentUser.email || "",
						};

						// Create a new user record with initial values
						await set(userDocRef, {
							displayName: currentUser.displayName || "",
							email: currentUser.email,
						});
					}
				} else {
					this.user = null;
					this.userData = null;
				}
				this.loading = false;
			});
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

	.profile-dropdown {
		position: absolute;
		top: 48px;
		right: 50px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		padding: 1rem;
		width: 200px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		z-index: 1000;
	}

	.profile-content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.profile-content .username {
		margin-bottom: 1rem;
		font-weight: bold;
		color: var(--first-color);
		font-size: 1rem;
		text-align: left;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.profile-content button {
		width: 100%;
		background-color: var(--third-color);
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
		text-align: center;
	}

	.profile-content button:hover {
		background-color: var(--second-color);
	}
</style>
