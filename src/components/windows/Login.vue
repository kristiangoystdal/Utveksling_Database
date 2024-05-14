<template>
	<div>
		<h1>Login</h1>
		<button @click="loginWithGoogle">Login with Google</button>
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

				console.log("User ID:", user.uid);
				console.log("User Name:", user.displayName);
				console.log("User Email:", user.email);
				console.log("User Photo URL:", user.photoURL);
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
