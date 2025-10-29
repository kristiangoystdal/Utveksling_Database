<template>
	<div>
		<h2 class="preserve-whitespace">{{ $t("common.welcome") }}</h2>

		<p class="box box-third-color preserve-whitespace text-center">
			{{ $t("common.siteDescription") }}
		</p>

		<div class="box box-countries">
			<WorldMap :countries="countriesToHighlight" />
		</div>
	</div>
</template>

<script>
import WorldMap from "./WorldMap.vue";
import { getDatabase, ref as dbRef, child, get } from "firebase/database";

export default {
	name: "App",
	components: {
		WorldMap,
	},
	data() {
		return {
			countriesToHighlight: [],
		};
	},

	mounted() {
		this.getValuesFromDatabase();
		// this.test();
	},
	methods: {
		async getValuesFromDatabase() {
			try {
				const db = getDatabase();
				const exchangesSnapshot = await get(child(dbRef(db), "exchanges"));
				if (exchangesSnapshot.exists()) {
					let exchanges = exchangesSnapshot.val();
					const countriesSet = new Set();

					for (const exchangeKey in exchanges) {
						const exchange = exchanges[exchangeKey];

						// Check if either 'Høst' or 'Vår' courses exist and have at least one course
						const hasAutumnCourses =
							exchange.courses &&
							exchange.courses.Høst &&
							exchange.courses.Høst.length > 0;
						const hasSpringCourses =
							exchange.courses &&
							exchange.courses.Vår &&
							exchange.courses.Vår.length > 0;

						if (hasAutumnCourses && hasSpringCourses) {
							if (!exchange.sameUniversity) {
								if (exchange.secondCountry) {
									countriesSet.add(exchange.secondCountry);
								}
							}
						}
						else if (hasAutumnCourses || hasSpringCourses) {
							if (exchange.country) {
								countriesSet.add(exchange.country);
							}
						}
					}

					const fetchedCountries = Array.from(countriesSet).map(
						(countryName) => ({ name: countryName })
					);
					this.countriesToHighlight = [
						...this.countriesToHighlight,
						...fetchedCountries,
					];
				} else {
					console.error("No data available");
				}
			} catch (error) {
				console.error("Error fetching values from database:", error);
			}
		},
	},
};
</script>

<style scoped>
/* Box Styles */
.box {
	border-radius: 10px;
	padding: 15px;
	margin: 15px auto;
	font-size: 16px;
	width: fit-content;
	max-width: 90%;
}

.box-countries {
	width: 100%;
	height: 100%;
	/* Ensure this has height */
}
</style>
