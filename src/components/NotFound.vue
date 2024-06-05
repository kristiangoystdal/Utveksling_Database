<template>
	<div class="box box-fourth-color center">
		<h1>{{ $t("errors.404title") }}</h1>
		<p>
			{{ $t("errors.404text") }}
		</p>
		<img
			src="../assets/images/airport.gif"
			alt="Page Not Found GIF"
			class="not-found-gif"
		/>
		<v-btn to="/" class="btn btn-primary hover">
			{{ $t("errors.404button") }}
		</v-btn>
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
	min-height: 20vw;
	width: fit-content;
	margin: auto;
	background-color: var(--fourth-color);
	text-align: center;
	padding: 10px 50px;
	box-sizing: border-box;
	font-family: Arial, sans-serif;
}

h1 {
	color: var(--first-color);
	font-size: 2rem;
	margin-bottom: 20px;
}

p {
	color: var(--first-color);
	font-size: 1rem;
	margin-bottom: 20px;
}

.not-found-gif {
	width: 100%;
	max-width: 20vw;
	height: auto;
	margin-bottom: 20px;
	border: 2px solid var(--second-color);
	border-radius: 10px;
}

.hover:hover {
	background-color: var(--third-color);
	color: var(--first-color);
}

.center {
	margin: auto;
	text-align: center;
}
</style>
