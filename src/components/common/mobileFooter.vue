<template>
	<div>
		<div class="footer-icons">
			<router-link class="footer-icon" to="/">
				<v-icon size="30px">mdi-home</v-icon>
			</router-link>
			<router-link class="footer-icon" to="/utvekslinger">
				<v-icon size="30px">mdi-airplane-search</v-icon>
			</router-link>
			<router-link class="footer-icon" to="/min_utveksling">
				<v-icon size="30px">mdi-airplane-edit</v-icon>
			</router-link>
			<a class="footer-icon" @click="toggleProfileDropdown">
				<v-icon size="30px">mdi-account</v-icon>
			</a>
		</div>

		<!-- Profile Dropdown -->
		<div v-if="showProfileDropDown" class="profile-dropdown">
			<div class="profile-content">
				<div v-if="user != null">
					<div class="username">{{ userData.displayName }}</div>
					<v-btn @click="signOut" color="primary" class="login-btn" dark>
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
						style="display: flex; align-items: center; justify-content: center"
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
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import { auth, db, provider } from "../../js/firebaseConfig";
	import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
	import { ref as dbRef, get, set } from "firebase/database";

	export default {
		name: "MobileFooter",
		data() {
			return {
				showProfileDropDown: false,
				userData: null, // Assume this is populated with user data from your Vuex store or API
			};
		},
		computed: {
			...mapGetters(["isAuthenticated"]),
		},
		methods: {
			toggleProfileDropdown() {
				this.showProfileDropDown = !this.showProfileDropDown;
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
	};
</script>

<style scoped>
	.footer-icons {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: var(--third-color);
		padding: 10px;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 10vh;
		z-index: 1000;
	}

	.footer-icon {
		display: flex;
		align-items: center;
		color: var(--second-color);
		height: 7vh;
		text-decoration: none;
	}

	.footer-icon v-icon {
		margin-bottom: 5px;
	}

	.footer-icon span {
		font-size: 20px;
	}

	.profile-dropdown {
		position: fixed;
		bottom: 11vh;
		right: 10px;
		background-color: white;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		z-index: 1001;
		padding: 10px;
		width: 200px;
	}

	.profile-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.username {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.login-btn {
		width: 100%;
	}
</style>
