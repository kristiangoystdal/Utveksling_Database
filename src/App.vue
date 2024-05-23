<template>
	<header>
		<Header></Header>
	</header>
	<br />
	<br />
	<div id="app">
		<div v-if="isDesktop">
			<router-view></router-view>
		</div>
		<div v-else class="mobile-warning">
			This website is only optimized for desktop. Please switch to a larger
			screen for the best experience.
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Header from "./components/Header.vue";
import { useRouter } from "vue-router";

import { useDisplay } from "vuetify/lib/framework.mjs";

const router = useRouter();
const isDesktop = ref(window.innerWidth >= 769);

const handleResize = () => {
	isDesktop.value = window.innerWidth >= 769;
};

onMounted(() => {
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
#app {
	margin: auto;
	padding: 0 1rem;
	max-width: 1200px;
	width: 90%;
}

header {
	line-height: 1.5;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

@media (min-width: 769px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}
}

.mobile-warning {
	display: none;
	text-align: center;
	background-color: #ffcc00;
	color: #000;
	padding: 1rem;
	font-size: 1.2rem;
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 1000;
}

@media (max-width: 768px) {
	.mobile-warning {
		display: block;
	}
}
</style>
