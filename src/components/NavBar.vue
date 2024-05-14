<template>
	<nav>
		<ul>
			<li><a @click="$emit('navClick', 'Home')">Home</a></li>
			<li><a @click="$emit('navClick', 'Programs')">Programs</a></li>
			<li><a @click="$emit('navClick', 'About')">About</a></li>
			<li><a @click="$emit('navClick', 'Contact')">Contact</a></li>
			<li>
				<a @click="handleAuthClick">{{ authButtonText }}</a>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { auth } from "../js/firebase";
import { signOut } from "firebase/auth";

const store = useStore();
const emit = defineEmits(["navClick"]);

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const authButtonText = computed(() =>
	isAuthenticated.value ? "Account" : "Login"
);

function handleAuthClick() {
	if (isAuthenticated.value) {
		emit("navClick", "Account");
	} else {
		emit("navClick", "Login");
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
../js/firebaseConfig
