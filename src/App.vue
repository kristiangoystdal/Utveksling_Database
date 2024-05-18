<template>
	<header>
		<Header></Header>
	</header>
	<nav>
		<NavBar></NavBar>
	</nav>
	<br />
	<br />
	<main class="main-content">
		<router-view></router-view>
	</main>
</template>

<script setup>
import Header from "./components/Header.vue";
import NavBar from "./components/NavBar.vue";
import { useRouter } from "vue-router";

const router = useRouter();
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
</style>
