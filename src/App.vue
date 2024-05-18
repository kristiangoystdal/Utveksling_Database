<template>
	<header>
		<Header></Header>
	</header>
	<nav>
		<NavBar></NavBar>
	</nav>
	<div v-if="isDesktop">
		<router-view></router-view>
	</div>
	<div v-else class="mobile-warning">
		This website is only optimized for desktop. Please switch to a larger screen
		for the best experience.
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Header from "./components/Header.vue";
import NavBar from "./components/NavBar.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isDesktop = ref(window.innerWidth >= 1024);

const handleResize = () => {
	isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
header {
	line-height: 1.5;
}

.logo {
	display: block;
	margin: 0 auto 2rem;
}

.main-content {
	max-width: 80%;
	width: 1200px;
	margin: auto;
}

@media (min-width: 1024px) {
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

@media (max-width: 1024px) {
	.mobile-warning {
		display: block;
	}
}
</style>
