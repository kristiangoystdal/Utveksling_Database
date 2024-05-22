<template>
	<div>
		<h2>Din utveksling</h2>
		<p>Opprett eller endre din utvekslingsdatabase</p>
	</div>
	<br />
	<br />
	<div>
		<div v-if="this.user">
			<v-expansion-panels v-model="panel">
				<!-- Basis informasjon -->
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
										@update:modelValue="setUniversity"
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
										@update:modelValue="handleNumSemestersChange"
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
										@update:modelValue="handleSemesterChange"
									></v-autocomplete>
								</v-col>
							</v-row>
						</v-container>
					</v-expansion-panel-text>
				</v-expansion-panel>

				<!-- Fag Katalog -->
				<v-expansion-panel v-for="(semester, index) in semesters" :key="index">
					<v-expansion-panel-title>
						<template v-slot:default="{ expanded }">
							<v-row no-gutters>
								<v-col class="d-flex justify-start" cols="4">
									Fag for {{ semester }} semesteret ({{
										semester.includes("Høst")
											? numFallCourses
											: numSpringCourses
									}}
									courses)
								</v-col>
								<v-col class="text-grey" cols="8">
									<v-fade-transition leave-absolute>
										<span v-if="expanded" key="0">
											Fyll inn informasjon fagene for {{ semester }} semesteret
										</span>
										<span v-else-if="missingCoursesDataTotalBool">
											Noen fag mangler informasjon
										</span>
										<span v-else> Alle fag har nok informasjon </span>
									</v-fade-transition>
								</v-col>
							</v-row>
							<v-icon
								:color="
									!expanded
										? !missingCoursesDataTotalBool
											? 'teal'
											: 'red'
										: ''
								"
								:icon="
									expanded
										? 'mdi-pencil'
										: !missingCoursesDataTotalBool
										? 'mdi-check'
										: 'mdi-alert-circle'
								"
							></v-icon>
						</template>
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<v-btn @click="addCourse(semester)">Add Course</v-btn>
						<br />
						<br />
						<v-expansion-panels>
							<v-expansion-panel
								v-for="(course, cIndex) in getCourses(semester)"
								:key="cIndex"
							>
								<v-expansion-panel-title>
									<template v-slot:default="{ expanded }">
										<v-row no-gutters>
											<v-col class="d-flex justify-start" cols="4">
												{{ course.courseName || "Nytt fag" }}
											</v-col>
											<v-col class="text-grey" cols="8">
												<v-fade-transition leave-absolute>
													<span v-if="expanded" key="0">
														Fyll inn informasjon faget ditt
													</span>
													<span
														v-else-if="missingCourseDataBool(semester, cIndex)"
													>
														{{ missingCourseDataString(semester, cIndex) }}
													</span>
													<span v-else> All data er fylt inn </span>
												</v-fade-transition>
											</v-col>
										</v-row>
										<v-icon
											:color="
												!expanded
													? !missingCourseDataBool(semester, cIndex)
														? 'teal'
														: 'red'
													: ''
											"
											:icon="
												expanded
													? 'mdi-pencil'
													: !missingCourseDataBool(semester, cIndex)
													? 'mdi-check'
													: 'mdi-alert-circle'
											"
										></v-icon>
									</template>
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<course-form
										:course="course"
										@submit-course="updateCourse(semester, cIndex, $event)"
										:removeCourse="() => removeCourse(semester, cIndex)"
									/>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
			<br />
			<br />
			<v-btn
				:disabled="missingCoursesDataTotalBool || missingBasicDataBool"
				@click="updateExchange"
			>
				Oppdater utveksling
			</v-btn>
		</div>
		<div v-else>
			<p>Du må være logget inn for å legge til eller endre utvekslingen din</p>
		</div>
	</div>
</template>

<script>
import { db, auth } from "../../js/firebaseConfig";
import { ref as dbRef, get, set, update } from "firebase/database";
import studiesData from "../../data/studies.json";

import CourseForm from "../CourseForm.vue";

export default {
	components: {
		CourseForm,
	},
	data() {
		return {
			user: null,
			panel: null,
			numSpringCourses: 0,
			numFallCourses: 0,
			numCoursesMissing: 0,
			studies: {},
			universities: {},
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
				(value) => !!value || "Påkrevd.",
				(value) => (value && value.length >= 3) || "Min 3 karakterer",
			],
			warningsFallCourses: [],
			warningsSpringCourses: [],
		};
	},
	watch: {
		"userExchange.study"(newStudy) {
			if (newStudy !== this.userExchange.study) {
				this.userExchange.specialization = null;
			}
		},
		"userExchange.country"(newCountry) {
			if (newCountry == null) {
				this.userExchange.university = null;
			}
		},
		"userExchange.numSemesters"(newNumber) {
			if (newNumber == 2 && this.semesters.length !== 2) {
				this.semesters = ["Høst", "Vår"];
			} else if (newNumber == 1 && this.semesters.length !== 1) {
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
				return [];
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
		missingCourseDataString() {
			return (semester, cIndex) => {
				const string = "Manglende data på ";
				const missingFields = [];
				const course = this.userExchange.courses[semester][cIndex] || {};

				if (!course.year) {
					missingFields.push("år");
				}
				if (!course.courseCode) {
					missingFields.push("fagkode");
				}
				if (!course.courseName) {
					missingFields.push("fagnavn");
				}
				if (!course.institute) {
					missingFields.push("institutt");
				}
				if (!course.ETCSPoints) {
					missingFields.push("ETCS poeng");
				}

				if (missingFields.length > 0) {
					return string + missingFields.join(", ");
				} else {
					return "All data er fylt inn";
				}
			};
		},
		missingCourseDataBool() {
			return (semester, cIndex) => {
				const course = this.userExchange.courses[semester][cIndex] || {};
				return (
					!course.year ||
					!course.courseCode ||
					!course.courseName ||
					!course.institute ||
					!course.ETCSPoints
				);
			};
		},
		missingCoursesDataTotalBool() {
			return this.semesters.some((semester) => {
				const courses = this.userExchange.courses[semester];
				if (!courses) {
					return false; // No courses for this semester
				}
				return Object.keys(courses).some((cIndex) =>
					this.missingCourseDataBool(semester, cIndex)
				);
			});
		},
		numFallCourses() {
			return Object.keys(this.userExchange.courses["Høst"] || {}).length;
		},
		numSpringCourses() {
			return Object.keys(this.userExchange.courses["Vår"] || {}).length;
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
				const userDocRef = dbRef(db, `exchanges/${currentUser.uid}`);
				const userDoc = await get(userDocRef);
				if (userDoc.exists()) {
					this.userData = userDoc.val();
					this.userExchange = this.userData;

					// Transform the courses arrays into objects with numerical keys
					if (this.userExchange.courses) {
						const semesters = ["Høst", "Vår"];
						semesters.forEach((semester) => {
							if (Array.isArray(this.userExchange.courses[semester])) {
								const coursesArray = this.userExchange.courses[semester];
								const coursesObject = {};
								coursesArray.forEach((course, index) => {
									coursesObject[index] = course;
								});
								this.userExchange.courses[semester] = coursesObject;
							}
						});
					}

					const hasFall = "Høst" in this.userExchange.courses;
					const hasSpring = "Vår" in this.userExchange.courses;
					if (this.userExchange.numSemesters == 1) {
						if (hasFall) {
							this.semesters = ["Høst"];
						} else if (hasSpring) {
							this.semesters = ["Vår"];
						}
					} else if (this.userExchange.numSemesters == 2) {
						this.semesters = ["Høst", "Vår"];
					}
				} else {
					console.log("User does not exist in database");
				}
			} else {
				console.log("No user is signed in");
			}
		},
		addCourse(semesterString) {
			var courses = this.userExchange.courses[semesterString];
			var newCourseIndex = null;
			if (!courses) {
				this.userExchange.courses[semesterString] = {};
				newCourseIndex = 0;
			} else {
				newCourseIndex = this.userExchange.courses[semesterString].length;
			}
			this.userExchange.courses[semesterString] = {
				...courses,
				[newCourseIndex]: {
					exchangeID: auth.currentUser.uid, // Set the current user's ID
					year: "",
					courseCode: "",
					courseName: "",
					replacedCourseCode: "",
					replacedCourseName: "",
					institute: "",
					ETCSPoints: "",
					comments: "",
				},
			};
		},
		getCourses(semesterName) {
			const semesterKey = semesterName.includes("Høst") ? "Høst" : "Vår";
			const courses = this.userExchange.courses[semesterKey] || {};
			return Object.values(courses);
		},
		removeCourse(semesterName, courseIndex) {
			const semesterKey = semesterName.includes("Høst") ? "Høst" : "Vår";
			const courses = this.userExchange.courses[semesterKey];

			// Delete the course at the specified index
			delete courses[courseIndex];

			// Reindex the courses to ensure they have the lowest possible indices
			const updatedCourses = {};
			Object.keys(courses)
				.sort()
				.forEach((key, newIndex) => {
					if (courses[key] !== undefined) {
						updatedCourses[newIndex] = courses[key];
					}
				});

			this.userExchange.courses[semesterKey] = updatedCourses;
		},
		updateCourse(semester, courseIndex, updatedCourse) {
			this.userExchange.courses[semester] = {
				...this.userExchange.courses[semester],
				[courseIndex]: { ...updatedCourse },
			};
		},
		async updateExchange() {
			if (auth.currentUser) {
				try {
					await update(
						dbRef(db, `exchanges/${auth.currentUser.uid}`),
						this.userExchange
					);
				} catch (error) {
					console.error("Error updating user exchange data: ", error);
				}
			}
		},
		handleSemesterChange(newSemester) {
			this.semesters = [newSemester];
		},
		handleNumSemestersChange(newNumber) {
			this.userExchange.numSemesters = newNumber;
			this.semesters = newNumber == 2 ? ["Høst", "Vår"] : [];
		},
		setUniversity(university) {
			this.userExchange.university = university;

			const newCountry = this.universityToCountryMap[university];
			this.userExchange.country = newCountry;
		},
		setCountry(country) {
			this.userExchange.country = country;
			if (country != this.universityToCountryMap[country]) {
				this.userExchange.university = null;
			}
		},
	},
	mounted() {
		this.retriveUserExchange();
		this.loadData();
		if (auth.currentUser) {
			this.user = auth.currentUser;
		}
	},
};
</script>

<style scoped></style>
