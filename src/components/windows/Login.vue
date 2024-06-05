<template>
	<div>
		<h2>{{ $t("userHandling.loginTitle") }}:</h2>
		<br />
		<div class="login-container">
			<v-card class="login-card box box-third-color">
				<v-card-text>
					<v-btn
						class="login-btn"
						@click="loginWithGoogle"
						color="primary"
						dark
					>
						<v-icon left class="icon-spacing">mdi-google</v-icon>
						{{ $t("userHandling.loginWithGoogle") }}
					</v-btn>
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import { auth, provider } from "../../js/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default {
	methods: {
		async loginWithGoogle() {
			try {
				const result = await signInWithPopup(auth, provider);
				const user = result.user;

				this.$router.push("/profil");
			} catch (error) {
				console.error("Error during sign-in:", error);
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

.title {
	font-size: 24px;
	text-align: center;
	margin-bottom: 20px;
}

.login-btn {
	width: 100%;
	font-size: 16px;
}

.icon-spacing {
	margin-right: 8px;
}
</style>
