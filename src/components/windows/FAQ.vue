<template>
	<h2>{{ $t("faqPage.pageHeader") }}</h2>
	<p
		class="box box-third-color preserve-whitespace text-center"
		v-html="$t('faqPage.info')"
	></p>

	<v-container style="padding: 20px; max-width: 80%; margin: 10px auto">
		<v-text-field
			v-model="searchQuery"
			:label="$t('faqPage.search')"
			append-icon="mdi-magnify"
			class="mb-2"
		></v-text-field>

		<v-row>
			<v-col cols="12" v-for="faq in filteredFaqs" :key="faq.id">
				<v-card class="mb-4">
					<v-card-title @click="toggleExpand(faq.id)">
						<div class="d-flex justify-space-between align-center">
							<span>{{ faq.question }}</span>
							<v-icon>{{
								expanded.includes(faq.id)
									? "mdi-chevron-up"
									: "mdi-chevron-down"
							}}</v-icon>
						</div>
					</v-card-title>
					<v-card-text v-show="expanded.includes(faq.id)">
						<p>{{ faq.answer }}</p>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import { db } from "../../js/firebaseConfig.js";
	import { get, child, ref as dbRef } from "firebase/database";

	export default {
		data() {
			return {
				searchQuery: "",
				expanded: [],
				faqs: [],
			};
		},
		computed: {
			filteredFaqs() {
				if (!this.searchQuery) return this.faqs;
				return this.faqs.filter((faq) =>
					faq.question.toLowerCase().includes(this.searchQuery.toLowerCase())
				);
			},
		},
		methods: {
			toggleExpand(faqId) {
				const index = this.expanded.indexOf(faqId);
				if (index >= 0) {
					this.expanded.splice(index, 1);
				} else {
					this.expanded.push(faqId);
				}
			},
			async fetchFaqs() {
				try {
					const dbRefInstance = dbRef(db);
					const snapshot = await get(child(dbRefInstance, "faq"));
					if (snapshot.exists()) {
						const data = snapshot.val();
						this.faqs = Object.keys(data).map((key) => ({
							id: key,
							...data[key],
						}));
					} else {
						console.error("No FAQs available.");
					}
				} catch (error) {
					console.error("Error fetching FAQs:", error);
				}
			},
		},
		mounted() {
			this.fetchFaqs();
		},
	};
</script>

<style scoped>
	h2 {
		color: #333;
	}

	p {
		margin-bottom: 1rem;
	}

	.v-card-title {
		cursor: pointer;
	}
</style>
