<template>
	<div>
		<h1>{{ title }}</h1>
		<v-data-table
			v-model:expanded="expanded"
			:headers="headers"
			:items="countries"
			item-value="country"
			show-expand
		>
			<template v-slot:[`item.country`]="{ item }">
				{{ item.country }}
			</template>
			<template v-slot:[`expanded-item`]="{ item }">
				hei
				<!-- <v-data-table
					:headers="nestedHeaders"
					:items="item.universities"
					class="nested-table"
					hide-default-footer
				>
					<template v-slot:[`item.name`]="{ item }">
						{{ item.name }}
					</template>
					<template v-slot:[`item.field`]="{ item }">
						{{ item.field }}
					</template>
					<template v-slot:[`item.bachelor`]="{ item }">
						{{ item.bachelor }}
					</template>
					<template v-slot:[`item.master`]="{ item }">
						{{ item.master }}
					</template>
					<template v-slot:[`item.comments`]="{ item }">
						{{ item.comments }}
					</template>
				</v-data-table> -->
			</template>
		</v-data-table>
	</div>
</template>

<script>
import creditsData from "../data/credits.json";

export default {
	data() {
		return {
			title: "Credits Table",
			headers: [{ title: "Country", value: "country" }],
			nestedHeaders: [
				{ title: "Institution", value: "name" },
				{ title: "Field", value: "field" },
				{ title: "Bachelor Credits", value: "bachelor" },
				{ title: "Master Credits", value: "master" },
				{ title: "Comments", value: "comments" },
			],
			countries: [],
			expanded: [],
		};
	},
	methods: {
		fetchData() {
			const data = [];

			Object.entries(creditsData).forEach(([country, universities]) => {
				const universityData = [];
				Object.entries(universities).forEach(([university, details]) => {
					Object.entries(details).forEach(([field, info]) => {
						if (
							info.credits &&
							typeof info.credits.bachelor !== "undefined" &&
							typeof info.credits.master !== "undefined"
						) {
							universityData.push({
								name: university,
								field: field,
								bachelor: info.credits.bachelor,
								master: info.credits.master,
								comments: info.comments || "",
							});
						}
					});
				});
				data.push({
					country: country,
					universities: universityData,
				});
			});

			this.countries = data;
			console.log(this.countries); // Debugging: Check the structure of the data
		},
	},
	created() {
		this.fetchData();
	},
};
</script>

<style scoped>
h1 {
	color: blue;
}
.nested-table {
	margin: 0 20px;
}
</style>
