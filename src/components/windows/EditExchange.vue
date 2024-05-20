<template>
	<div>
		<h2>Din utveksling</h2>
		<p>Opprett eller endre din utvekslingsdatabase</p>
	</div>
	<div>
		<div v-if="!hasExchangeData">
			<v-btn @click="makeExchange">Create your exchange data</v-btn>
			<h3>Exchange data</h3>
			<v-autocomplete
				v-model="userExchange.study"
				:items="studyNames"
				label="Study"
				required
				clearable
			></v-autocomplete>
			<v-autocomplete
				v-model="userExchange.specialization"
				:items="specializations"
				label="Spesialisering"
				required
				clearable
			></v-autocomplete>
			<v-autocomplete
				v-model="userExchange.country"
				:items="countryNames"
				label="Land"
				required
				clearable
			></v-autocomplete>
			<v-autocomplete
				v-model="userExchange.university"
				:items="universityNames"
				label="Universitet"
				required
				clearable
			></v-autocomplete>
			<v-autocomplete
				v-model="userExchange.studyYear"
				:items="[1, 2, 3, 4, 5]"
				label="Studieår"
				required
				clearable
			></v-autocomplete>
			<v-autocomplete
				v-model="userExchange.numSemesters"
				:items="[1, 2]"
				label="Antall semestre"
				required
				clearable
			></v-autocomplete>
			{{ userExchange }}
		</div>
		<div v-else>
			<v-btn @click="editExchange">Edit your exchange data</v-btn>
			<div>
				<h3>Exchange data</h3>
				<p>{{ userExchange }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { db, auth } from "../../js/firebaseConfig";
import { ref as dbRef, get, set } from "firebase/database";
import studiesData from "../../data/studies.json";

export default {
	data() {
		return {
			studies: {},
			universities: {},
			hasExchangeData: false,
			userExchange: {
				university: null,
				country: null,
				studyYear: null,
				study: null,
				specialization: null,
				numSemesters: null,
				courses: {
					Høst: {},
					Vår: {},
				},
			},
			rules: [
				(value) => !!value || "Required.",
				(value) => (value && value.length >= 3) || "Min 3 characters",
			],
		};
	},
	watch: {
		"userExchange.university"(newUniversity) {
			if (newUniversity) {
				this.userExchange.country =
					this.universityToCountryMap[newUniversity] || null;
			}
		},
		"userExchange.country"(newCountry) {
			this.userExchange.university = "";
		},
		"userExchange.study"(newStudy) {
			this.userExchange.specialization = "";
		},
	},
	computed: {
		studyNames() {
			return Object.keys(this.studies);
		},
		specializations() {
			return this.userExchange.study
				? this.studies[this.userExchange.study]
				: [];
		},
		countryNames() {
			return Object.keys(this.universities);
		},
		universityNames() {
			if (this.userExchange.country) {
				return this.universities[this.userExchange.country];
			} else {
				return Object.values(this.universities).flat();
			}
		},
		universityToCountryMap() {
			const map = {};
			Object.keys(this.universities).forEach((country) => {
				this.universities[country].forEach((university) => {
					map[university] = country;
				});
			});
			return map;
		},
	},
	methods: {
		loadData() {
			try {
				this.studies = studiesData.studies;
				this.universities = studiesData.universities;
			} catch (error) {
				console.error("There was an error loading the studies data:", error);
			}
		},
		async retriveUserExchange() {
			console.log("Retrieving user exchange data");
			if (auth.currentUser) {
				const currentUser = auth.currentUser;
				const userDocRef = dbRef(db, `exchangesTest/${currentUser.uid}`);
				const userDoc = await get(userDocRef);
				if (userDoc.exists()) {
					this.userData = userDoc.val();
					console.log("User exists in database:", this.userData);
					this.userExchange = this.userData;
					this.hasExchangeData = true;
				} else {
					console.log("User does not exist in database");
					this.hasExchangeData = false;
				}
			} else {
				this.hasExchangeData = false;
			}
		},
		makeExchange() {
			console.log("Creating exchange data");
		},
		editExchange() {
			console.log("Editing exchange data");
		},
	},
	mounted() {
		this.retriveUserExchange();
		this.loadData();
	},
};
</script>

<style scoped></style>
