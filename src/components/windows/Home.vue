<template>
	<div>
		<h2>Home</h2>
		<p>{{ $t("welcome") }}</p>
		<p>{{ $t("goodbye") }}</p>
		<v-btn @click="changeLanguage('en')"> English </v-btn>
		<v-btn @click="changeLanguage('no')"> Norwegian </v-btn>
	</div>
</template>

<script>
export default {
	methods: {
		changeLanguage(lang) {
			this.$i18n.locale = lang;
			localStorage.setItem("language", lang); // Save the selected language to localStorage
		},
	},
};
</script>
