<template>
	<nav>
		<ul>
			<li><router-link to="/">Home</router-link></li>
			<li><router-link to="/programs">Programs</router-link></li>
			<li><router-link to="/myexchange">My Exchange</router-link></li>
			<li><router-link to="/contact">Contact</router-link></li>
			<li>
				<a @click="handleAuthClick">{{ authButtonText }}</a>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const authButtonText = computed(() =>
	isAuthenticated.value ? "Account" : "Login"
);

function handleAuthClick() {
	if (isAuthenticated.value) {
		router.push({ name: "Account" });
	} else {
		router.push({ name: "Login" });
	}
}
</script>

<style scoped>
nav {
	margin-top: 1rem;
}

nav ul {
	list-style-type: none;
	padding: 0;
	display: flex;
	justify-content: center;
	gap: 1rem;
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
}
</style>
