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
			<a class="footer-icon" @click="handleAuthClick">
				<v-icon size="30px">mdi-account</v-icon>
			</a>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";

	export default {
		name: "MobileFooter",
		// Your component's options go here
		computed: {
			...mapGetters(["isAuthenticated"]),
		},
		methods: {
			handleAuthClick() {
				if (this.isAuthenticated) {
					this.$router.push({ name: "Account" });
				} else {
					this.$router.push({ name: "Login" });
				}
			},
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
</style>
