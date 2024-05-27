<template>
	<div>
		<h1>{{ $t("userHandling.loginTitle") }}</h1>
		<v-btn @click="loginWithGoogle">{{
			$t("userHandling.loginWithGoogle")
		}}</v-btn>
	</div>
</template>

<script>
import { auth, provider } from "../../js/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

export default {
	methods: {
		async loginWithGoogle() {
			try {
				const result = await signInWithPopup(auth, provider);
				const user = result.user;

				this.$router.push("/account");
			} catch (error) {
				console.error("Error during sign-in:", error);
			}
		},
	},
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
