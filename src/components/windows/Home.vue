<template>
	<div>
		<h2>{{ $t("common.welcome") }}</h2>
	</div>
	<WorldMap :countries="countriesToHighlight" />
</template>

<script>
import WorldMap from "../WorldMap.vue";

export default {
	name: "App",
	components: {
		WorldMap,
	},
	data() {
		return {
			countriesToHighlight: [
				{ code: "US", name: "United States" },
				{ code: "FR", name: "France" },
				{ code: "JP", name: "Japan" },
				// Add more countries as needed
			],
		};
	},
};
</script>
