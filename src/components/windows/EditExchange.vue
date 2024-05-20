<template>
	<div>
		<h2>Din utveksling</h2>
		<p>Opprett eller endre din utvekslingsdatabase</p>
	</div>
	<div>
		<div v-if="!hasExchangeData">
			<v-btn @click="makeExchange">Lag din utvekslings data</v-btn>

			<v-expansion-panels v-model="panel">
				<v-expansion-panel>
					<v-expansion-panel-title>
						<template v-slot:default="{ expanded }">
							<v-row no-gutters>
								<v-col class="d-flex justify-start" cols="4">
									Basis informasjon
								</v-col>
								<v-col class="text-grey" cols="8">
									<v-fade-transition leave-absolute>
										<span v-if="expanded" key="0">
											Fyll inn informasjon om din utveksling
										</span>
										<span v-else-if="missingBasicDataBool">
											{{ missingBasicDataString }}
										</span>
										<span v-else> All data er fylt inn </span>
									</v-fade-transition>
								</v-col>
							</v-row>
							<v-icon
								:color="
									!expanded ? (!missingBasicDataBool ? 'teal' : 'red') : ''
								"
								:icon="
									expanded
										? 'mdi-pencil'
										: !missingBasicDataBool
										? 'mdi-check'
										: 'mdi-alert-circle'
								"
							></v-icon>
						</template>
					</v-expansion-panel-title>

					<v-expansion-panel-text>
						<v-container>
							<!-- Studie & Spesialisering -->
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.study"
										:items="studyNames"
										label="Studie"
										required
										clearable
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.specialization"
										:items="specializations"
										label="Spesialisering"
										required
										clearable
									></v-autocomplete>
								</v-col>
							</v-row>

							<!-- Land & Universitet -->
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.country"
										:items="countryNames"
										label="Land"
										required
										clearable
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.university"
										:items="universityNames"
										label="Universitet"
										required
										clearable
									></v-autocomplete>
								</v-col>
							</v-row>

							<!-- Antall semestre & Studieår -->
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.numSemesters"
										:items="[1, 2]"
										label="Antall semestre"
										required
										clearable
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.studyYear"
										:items="[1, 2, 3, 4, 5]"
										label="Studieår"
										required
										clearable
									></v-autocomplete>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-if="userExchange.numSemesters == 1"
										v-model="semesters"
										:items="['Høst', 'Vår']"
										label="Semester"
										required
										clearable
									></v-autocomplete>
								</v-col>
							</v-row>
						</v-container>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<v-expansion-panel v-for="(semester, index) in semesters" :key="index">
					<v-expansion-panel-title>
						Fag for {{ semester.name }} semesteret (
						{{ semester.includes("Høst") ? numFallCourses : numSpringCourses }}
						courses)
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<v-btn @click="addCourse(semester)">Add Course</v-btn>
						<v-expansion-panels v-model="panel">
							<v-expansion-panel
								v-for="cIndex in getNumCourses(semester)"
								:key="cIndex"
							>
								<v-expansion-panel-title>
									{{ semester.courses[cIndex - 1]?.name || "New Course" }}
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<course-form
										:course="semester.courses[cIndex - 1]"
										:removeCourse="() => removeCourse(index, cIndex - 1)"
									/>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>
		<div v-else>
			<v-btn @click="editExchange">Edit your exchange data</v-btn>
			<div>
				<h3>Exchange data</h3>
				<p>{{ userExchange }}</p>
			</div>
		</div>
		<br />
		<br />
		<br />
		<div>
			{{ userExchange }}
			<br />
			{{ semesters }}

			<h3>Kurs</h3>
			<v-btn @click="addCourse">Legg til kurs </v-btn>

			<CourseForm @submit-course="handleCourseSubmit" />
		</div>
	</div>
</template>

<script>
import { db, auth } from "../../js/firebaseConfig";
import { ref as dbRef, get, set } from "firebase/database";
import studiesData from "../../data/studies.json";

import CourseForm from "../CourseForm.vue";

export default {
	components: {
		CourseForm,
	},
	data() {
		return {
			panel: null,
			numSpringCourses: 0,
			numFallCourses: 0,
			studies: {},
			universities: {},
			hasExchangeData: false,
			semesters: [],
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
			this.userExchange.university = null;
		},
		"userExchange.study"(newStudy) {
			this.userExchange.specialization = null;
		},
		"userExchange.numSemesters"(newNumber) {
			if (newNumber == 2) {
				this.semesters = ["Høst", "Vår"];
			} else if (newNumber == 1) {
				this.semesters = [];
			}
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
		missingBasicDataString() {
			const string = "Manglende data på ";
			const missingFields = [];

			if (this.userExchange.country == null) {
				missingFields.push("land");
			}
			if (this.userExchange.university == null) {
				missingFields.push("universitet");
			}
			if (this.userExchange.study == null) {
				missingFields.push("studie");
			}
			if (this.userExchange.specialization == null) {
				missingFields.push("spesialisering");
			}
			if (this.userExchange.studyYear == null) {
				missingFields.push("studieår");
			}
			if (this.userExchange.numSemesters == null) {
				missingFields.push("antall semestre");
			}
			if (this.userExchange.numSemesters == 1 && this.semesters.length == 0) {
				missingFields.push("semester");
			}

			if (missingFields.length > 0) {
				return string + missingFields.join(", ");
			} else {
				return "All data is present";
			}
		},
		missingBasicDataBool() {
			return (
				this.userExchange.country == null ||
				this.userExchange.university == null ||
				this.userExchange.study == null ||
				this.userExchange.specialization == null ||
				this.userExchange.studyYear == null ||
				this.userExchange.numSemesters == null ||
				(this.userExchange.numSemesters == 1 && this.semesters.length == 0)
			);
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
		addCourse(semesterString) {
			if (semesterString == "Høst") {
				this.numFallCourses++;
			} else if (semesterString == "Vår") {
				this.numSpringCourses++;
			}
		},
		handleCourseSubmit(course) {
			console.log("Handling course submit", course);
		},
	},
	mounted() {
		this.retriveUserExchange();
		this.loadData();
	},
};
</script>

<style scoped></style>
