<template>
	<div>
		<h2 v-if="login">{{ $t("userHandling.loginTitle") }}:</h2>
		<h2 v-else>{{ $t("userHandling.registerTitle") }}:</h2>
		<br />
		<div class="login-container">
			<v-card v-if="login" class="login-card box box-third-color">
				<v-card-text>
					<h3 class="title">{{ $t("userHandling.loginWithEmailTitle") }}</h3>
					<v-form @submit.prevent="loginWithEmail">
						<v-text-field label="Email" v-model="email" type="email" required outlined hide-details></v-text-field>
						<br />
						<v-text-field label="Password" v-model="password" type="password" required outlined
							hide-details></v-text-field>
						<br />
						<v-btn class="login-btn" color="primary" dark @click="loginWithEmail">
							<v-icon left class="icon-spacing">mdi-login</v-icon>
							{{ $t("userHandling.loginWithEmail") }}
						</v-btn>
						<br /><br />
						<v-btn class="login-btn" color="secondary" dark @click="switchLoginRegister">
							<v-icon left class="icon-spacing">mdi-account-plus</v-icon>
							{{ $t("userHandling.registerWithEmail") }}
						</v-btn>
					</v-form>
				</v-card-text>
			</v-card>

			<v-card v-if="!login" class="register-card box box-third-color">
				<v-card-text>
					<h3 class="title">{{ $t("userHandling.registerWithEmailTitle") }}</h3>
					<v-form @submit.prevent="registerWithEmail">
						<v-text-field label="Name" v-model="name" type="text" required outlined hide-details autocomplete="name" />
						<br />

						<v-text-field label="Email" v-model="email" type="email" required outlined hide-details
							autocomplete="username" />
						<br />

						<v-text-field label="Password" v-model="password" type="password" required outlined hide-details
							autocomplete="new-password" />

						<v-btn class="login-btn" color="primary" dark @click="registerWithEmail">
							<v-icon left class="icon-spacing">mdi-account-plus</v-icon>
							{{ $t("userHandling.registerWithEmail") }}
						</v-btn>
						<br /><br />

						<v-btn class="login-btn" color="secondary" dark @click="switchLoginRegister">
							<v-icon left class="icon-spacing">mdi-login</v-icon>
							{{ $t("userHandling.loginWithEmail") }}
						</v-btn>
					</v-form>
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import { auth, provider } from "../../js/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // ✅ new imports for Realtime Database

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
	data() {
		return {
			name: "",
			email: "",
			password: "",
			login: true,
		};
	},
	methods: {
		switchLoginRegister() {
			this.login = !this.login;
		},
		async loginWithGoogle() {
			try {
				const result = await signInWithPopup(auth, provider);
				const user = result.user;

				this.$router.push("/profil");
			} catch (error) {
				console.error("Error during sign-in:", error);
			}
		},
		async loginWithEmail() {
			try {
				const email = this.email;
				const password = this.password;

				await signInWithEmailAndPassword(auth, email, password);
				this.$router.push("/profil");
			} catch (error) {
				console.error("Error during email sign-in:", error);
				toast.error("Login failed");
			}
		},
		async registerWithEmail() {
			try {
				const { email, password } = this;

				// 1️⃣ Create the user and get the user object immediately
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;

				// 2️⃣ Wait for Firebase to confirm that the session is ready
				await new Promise((resolve) => {
					const unsubscribe = auth.onAuthStateChanged((currentUser) => {
						if (currentUser) {
							unsubscribe();
							resolve(currentUser);
						}
					});
				});

				// 3️⃣ Safely create the user profile after the user is ready
				await this.createUserProfile(user);

				toast.success("Account created successfully!");
				this.$router.push("/profil");
			} catch (error) {
				console.error("Error during email registration:", error);
				toast.error("Registration failed");
			}
		},

		async createUserProfile(user) {
			try {
				const displayName = this.name;
				await updateProfile(user, { displayName });

				const db = getDatabase();
				await set(ref(db, "users/" + user.uid), {
					displayName: displayName,
					email: user.email,
				});
			} catch (error) {
				console.error("Error creating user profile:", error);
			}
		},
	},
};
</script>

<style scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.login-card {
	width: 400px;
	padding: 20px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
}

.register-card {
	width: 400px;
	padding: 20px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
}

.title {
	font-size: 24px;
	text-align: center;
	margin-bottom: 20px;
}

.login-btn {
	width: 100%;
	font-size: 16px;
}

.register-btn {
	width: 100%;
	font-size: 16px;
}

.icon-spacing {
	margin-right: 8px;
}

@media (max-width: 768px) {
	.login-card {
		width: 90%;
		align-items: center;
	}

	.login-card .login-btn {
		font-size: 90%;
		width: fit-content;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-spacing {
		margin-right: 4px;
	}
}
</style>
