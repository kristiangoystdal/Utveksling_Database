<template>
	<div>
		<div class="footer-icons">
			<router-link class="footer-icon" to="/">
				<v-icon size="30px">mdi-home</v-icon>
			</router-link>
			<router-link class="footer-icon" to="/utvekslinger">
				<v-icon size="30px">mdi-airplane-search</v-icon>
			</router-link>
			<router-link class="footer-icon" to="/another-page">
				<v-icon size="30px">mdi-airplane-edit</v-icon>
			</router-link>
			<router-link class="footer-icon" to="/logg_inn">
				<v-icon size="30px">mdi-account</v-icon>
			</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: "MobileFooter",
	// Your component's options go here
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
