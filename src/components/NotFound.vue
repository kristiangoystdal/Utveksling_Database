<template>
	<div class="not-found-container">
		<h1>{{ $t("errors.404title") }}</h1>
		<p>
			{{ $t("errors.404text") }}
		</p>
		<img
			src="../assets/images/airport.gif"
			alt="Page Not Found GIF"
			class="not-found-gif"
		/>
		<router-link to="/" class="home-link">
			{{ $t("errors.404button") }}
		</router-link>
	</div>
</template>

<script>
export default {
	name: "NotFound",
};
</script>

<style scoped>
.not-found-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 50vh;
	background-color: #f0f0f0;
	text-align: center;
	padding: 20px;
	box-sizing: border-box;
	font-family: Arial, sans-serif;
}

h1 {
	color: #2c3e50;
	font-size: 3em;
	margin-bottom: 20px;
}

p {
	color: #34495e;
	font-size: 1.2em;
	margin-bottom: 20px;
}

.not-found-gif {
	width: 100%;
	max-width: 400px;
	height: auto;
	margin-bottom: 20px;
	border: 2px solid #2980b9;
	border-radius: 10px;
}

.home-link {
	display: inline-block;
	padding: 10px 20px;
	font-size: 1em;
	color: #fff;
	background-color: #3498db;
	border-radius: 5px;
	text-decoration: none;
	transition: background-color 0.3s ease;
}

.home-link:hover {
	background-color: #2980b9;
}
</style>
