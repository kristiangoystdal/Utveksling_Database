<template>
	<div>
		<h2>{{ $t("myExchange.pageHeader") }}</h2>
		<p>{{ $t("myExchange.info") }}</p>
	</div>
	<br />
	<br />
	<div>
		<div v-if="this.user">
			<div class="exchange-container">
				<div v-if="unsavedChanges" class="unsaved-changes">
					<p>{{ $t("myExchange.unsavedChanges") }}</p>
					<br />
					<v-btn
						:disabled="missingCoursesDataTotalBool || missingBasicDataBool"
						@click="updateExchange"
						class="update-btn"
					>
						{{ $t("myExchange.updateExchange") }}
					</v-btn>
				</div>
				<div v-else>
					<p>{{ $t("myExchange.noChanges") }}</p>
				</div>
			</div>
			<br />
			<br />
			<v-expansion-panels v-model="panel">
				<!-- Basis informasjon -->
				<v-expansion-panel>
					<v-expansion-panel-title>
						<template v-slot:default="{ expanded }">
							<v-row no-gutters>
								<v-col class="d-flex justify-start" cols="6">
									{{ $t("myExchange.basisInformation.basisInformationTitle") }}
								</v-col>
								<v-col class="text-grey" cols="6">
									<v-fade-transition leave-absolute>
										<span v-if="expanded" key="0">
											{{ $t("myExchange.basisInformation.fillExchangeInfo") }}
										</span>
										<span v-else-if="missingBasicDataBool">
											{{ missingBasicDataString }}
										</span>
										<span v-else>
											{{ $t("myExchange.basisInformation.allDataFilled") }}
										</span>
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
										:label="$t('database.study')"
										required
										clearable
										:hint="$t('hints.study')"
										persistent-hint
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.specialization"
										:items="specializations"
										:label="$t('database.specialization')"
										required
										clearable
										:hint="$t('hints.specialization')"
										persistent-hint
									></v-autocomplete>
								</v-col>
							</v-row>

							<!-- Land & Universitet -->
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.country"
										:items="countryNames"
										:label="$t('database.country')"
										required
										clearable
										:hint="$t('hints.country')"
										persistent-hint
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.university"
										:items="universityNames"
										:label="$t('database.university')"
										required
										clearable
										@update:modelValue="setUniversity"
										:hint="$t('hints.university')"
										persistent-hint
									></v-autocomplete>
								</v-col>
							</v-row>

							<!-- Antall semestre & Studieår -->
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.numSemesters"
										:items="[1, 2]"
										:label="$t('database.numSemesters')"
										required
										clearable
										@update:modelValue="handleNumSemestersChange"
										:hint="$t('hints.numSemesters')"
										persistent-hint
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-model="userExchange.studyYear"
										:items="[1, 2, 3, 4, 5]"
										:label="$t('database.studyYear')"
										required
										clearable
										:hint="$t('hints.studyYear')"
										persistent-hint
									></v-autocomplete>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="6">
									<v-autocomplete
										v-if="userExchange.numSemesters == 1"
										v-model="semesters"
										:items="['Høst', 'Vår']"
										:label="$t('database.semester')"
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
				<v-expansion-panel
					v-if="this.semesters.length > 0"
					v-for="(semester, index) in semesters"
					:key="index"
				>
					<v-expansion-panel-title>
						<template v-slot:default="{ expanded }">
							<v-row no-gutters>
								<v-col class="d-flex justify-start" cols="6">
									<span v-if="semester.includes('Høst')">
										{{ $t("myExchange.courseInformation.courseFallTitle") }}
										({{ numFallCourses }}
										{{ $t("myExchange.courseInformation.numCoursesText") }})
									</span>
									<span v-else>
										{{ $t("myExchange.courseInformation.courseSpringTitle") }}
										({{ numSpringCourses }}
										{{ $t("myExchange.courseInformation.numCoursesText") }})
									</span>
								</v-col>
								<v-col class="text-grey" cols="6">
									<v-fade-transition leave-absolute>
										<span v-if="expanded" key="0">
											{{ $t("myExchange.courseInformation.fillSemesterInfo") }}
										</span>
										<span v-else-if="missingCoursesDataTotalBool">
											{{
												$t("myExchange.courseInformation.someCoursesMissing")
											}}
										</span>
										<span v-else>
											{{ $t("myExchange.courseInformation.allCoursesFilled") }}
										</span>
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
						<v-btn @click="addCourse(semester)">
							{{ $t("myExchange.courseInformation.addCourse") }}
						</v-btn>
						<br />
						<br />
						<v-expansion-panels :v-model="coursePanel">
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
														{{
															$t("myExchange.courseInformation.fillCoursesInfo")
														}}
													</span>
													<span
														v-else-if="missingCourseDataBool(semester, cIndex)"
													>
														{{ missingCourseDataString(semester, cIndex) }}
													</span>
													<span v-else>
														{{
															$t(
																"myExchange.courseInformation.enoughCourseDataFilled"
															)
														}}
													</span>
												</v-fade-transition>
											</v-col>
										</v-row>
										<v-icon
											:icon="'mdi mdi-trash-can-outline'"
											class="course-icons"
											@click.stop="toggleDialog(semester, cIndex)"
										>
										</v-icon>

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
											class="course-icons"
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
			<div class="exchange-container">
				<div v-if="unsavedChanges" class="unsaved-changes">
					<p>{{ $t("myExchange.unsavedChanges") }}</p>
					<br />
					<v-btn
						:disabled="missingCoursesDataTotalBool || missingBasicDataBool"
						@click="updateExchange"
						class="update-btn"
					>
						{{ $t("myExchange.updateExchange") }}
					</v-btn>
				</div>
				<div v-else>
					<p>{{ $t("myExchange.noChanges") }}</p>
				</div>
			</div>
		</div>
		<div v-else>
			<p>{{ $t("myExchange.loginToEdit") }}</p>
		</div>

		<v-dialog v-model="deleteDialog" max-width="500">
			<v-card>
				<v-card-title class="headline">
					{{ $t("operations.confirmDelete") }}
				</v-card-title>
				<v-card-text>
					{{ $t("operations.confirmCourseDelete") }}
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" text @click="toggleDialog">
						{{ $t("operations.no") }}
					</v-btn>
					<v-btn
						color="red darken-1"
						text
						@click="removeCourse(currentSemester, currentCourse)"
					>
						{{ $t("operations.yes") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
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
			coursePanel: null,
			numCoursesMissing: 0,
			studies: {},
			universities: {},
			semesters: [],
			remoteExchange: {
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
			warningsFallCourses: [],
			warningsSpringCourses: [],
			deleteDialog: false,
			currentCourse: null,
			currentSemester: null,
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
			const string = this.$t("myExchange.missingData") + " ";
			const missingFields = [];

			if (this.userExchange.country == null) {
				missingFields.push(this.$t("database.country").toLowerCase());
			}
			if (this.userExchange.university == null) {
				missingFields.push(this.$t("database.university").toLowerCase());
			}
			if (this.userExchange.study == null) {
				missingFields.push(this.$t("database.study").toLowerCase());
			}
			if (this.userExchange.specialization == null) {
				missingFields.push(this.$t("database.specialization").toLowerCase());
			}
			if (this.userExchange.studyYear == null) {
				missingFields.push(this.$t("database.studyYear").toLowerCase());
			}
			if (this.userExchange.numSemesters == null) {
				missingFields.push(this.$t("database.numSemesters").toLowerCase());
			}
			if (this.userExchange.numSemesters == 1 && this.semesters.length == 0) {
				missingFields.push(this.$t("database.semester").toLowerCase());
			}

			if (missingFields.length > 0) {
				return string + missingFields.join(", ");
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
				const string = this.$t("myExchange.missingData") + " ";
				const missingFields = [];
				const course = this.userExchange.courses[semester][cIndex] || {};

				if (!course.year) {
					missingFields.push(
						this.$t("myExchange.courseInformation.courseYear").toLowerCase()
					);
				}
				if (!course.courseCode) {
					missingFields.push(this.$t("database.courseCode").toLowerCase());
				}
				if (!course.courseName) {
					missingFields.push(this.$t("database.courseName").toLowerCase());
				}
				if (!course.institute) {
					missingFields.push(this.$t("database.institute").toLowerCase());
				}
				if (!course.ETCSPoints) {
					missingFields.push(this.$t("database.ETCSPoints"));
				}

				if (missingFields.length > 0) {
					return string + missingFields.join(", ");
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
		unsavedChanges() {
			return (
				JSON.stringify(this.remoteExchange) !==
				JSON.stringify(this.userExchange)
			);
		},
	},
	methods: {
		loadData() {
			// Load the studies data from the JSON file
			try {
				this.studies = studiesData.studies;
				this.universities = studiesData.universities;
			} catch (error) {
				console.error("There was an error loading the studies data:", error);
			}
		},
		async retriveUserExchange() {
			if (auth.currentUser) {
				// Get the user's exchange data from the database
				const currentUser = auth.currentUser;
				const userDocRef = dbRef(db, `exchanges/${currentUser.uid}`);
				const userDoc = await get(userDocRef);

				// If the user exists, set the userData object
				if (userDoc.exists()) {
					this.userData = userDoc.val();

					// Function to transform courses arrays to objects with numerical keys
					const transformCourses = (exchange) => {
						if (exchange.courses) {
							const semesters = ["Høst", "Vår"];
							semesters.forEach((semester) => {
								if (Array.isArray(exchange.courses[semester])) {
									const coursesArray = exchange.courses[semester];
									const coursesObject = {};
									coursesArray.forEach((course, index) => {
										coursesObject[index] = course;
									});
									exchange.courses[semester] = coursesObject;
								}
							});
						}
					};

					// Apply transformation to both userExchange and remoteExchange
					this.remoteExchange = JSON.parse(JSON.stringify(this.userData));
					transformCourses(this.remoteExchange);
					this.userExchange = JSON.parse(JSON.stringify(this.remoteExchange));

					// If the user has no courses, create empty courses objects
					if (!this.userExchange.courses) {
						this.userExchange.courses = {
							Høst: {},
							Vår: {},
						};
						this.remoteExchange.courses = {
							Høst: {},
							Vår: {},
						};
					}

					// Set the semesters array based on the number of semesters
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
					console.error("User does not exist in database");
				}
			} else {
				console.error("No user is signed in");
			}
		},
		addCourse(semesterString) {
			// Get the courses for the specified semester
			var courses = this.userExchange.courses[semesterString];

			// Find the index for the new course
			var newCourseIndex = null;
			if (!courses) {
				this.userExchange.courses[semesterString] = {};
				newCourseIndex = 0;
			} else {
				newCourseIndex = Object.keys(courses).length;
			}

			// Add the new course to the courses object
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
			// Get the courses for the specified semester
			const semesterKey = semesterName.includes("Høst") ? "Høst" : "Vår";
			const courses = this.userExchange.courses[semesterKey] || {};
			return Object.values(courses);
		},
		removeCourse(semesterName, courseIndex) {
			// Close the delete dialog
			this.deleteDialog = false;

			// Get the courses for the specified semester
			const semesterKey = semesterName.includes("Høst") ? "Høst" : "Vår";
			const courses = { ...this.userExchange.courses[semesterKey] };

			// Delete the course at the specified index
			delete courses[courseIndex];

			// Reindex the courses to ensure they have the lowest possible indices
			const reindexedCourses = {};
			let newIndex = 0;
			for (const key in courses) {
				if (courses.hasOwnProperty(key)) {
					reindexedCourses[newIndex] = courses[key];
					newIndex++;
				}
			}

			// Update the userExchange.courses object directly
			this.userExchange.courses = {
				...this.userExchange.courses,
				[semesterKey]: reindexedCourses,
			};

			// Close the expanded panel
			this.coursePanel = null;
		},
		updateCourse(semester, courseIndex, updatedCourse) {
			this.userExchange.courses[semester] = {
				...this.userExchange.courses[semester],
				[courseIndex]: { ...updatedCourse },
			};
		},
		handleCourseUpdate(updatedCourse) {
			const { semester, courseIndex, course } = updatedCourse;
			this.userExchange.courses[semester][courseIndex] = course;
		},
		async updateExchange() {
			if (auth.currentUser) {
				try {
					await update(
						dbRef(db, `exchanges/${auth.currentUser.uid}`),
						this.userExchange
					);
					this.remoteExchange = JSON.parse(JSON.stringify(this.userExchange));
				} catch (error) {
					console.error("Error updating user exchange data: ", error);
				}
			}
		},
		handleSemesterChange(newSemester) {
			if (newSemester === null || newSemester === "") {
				this.semesters = [];
			} else {
				this.semesters = [newSemester];
			}
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
		toggleDialog(semester, courseIndex) {
			this.coursePanel = null;
			if (!this.deleteDialog) {
				this.deleteDialog = !this.deleteDialog;
				this.currentSemester = semester;
				this.currentCourse = courseIndex;
			} else {
				this.deleteDialog = false;
				this.currentSemester = null;
				this.currentCourse = null;
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

<style scoped>
.exchange-container {
	padding: 20px;
	border: 2px solid #eeeeee;
	border-radius: 10px;
	background-color: #f9f9f9;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	margin: 20px auto;
	max-width: 600px;
	text-align: center;
}

.unsaved-changes {
	background-color: #ffecb3; /* Light yellow background */
	border: 1px solid #ffd54f; /* Darker yellow border */
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 16px;
	font-weight: bold;
	color: #ff6f00; /* Dark orange text */
}

.update-btn {
	background-color: #00796b; /* Teal background */
	color: white;
	font-weight: bold;
}

.update-btn:disabled {
	background-color: #b2dfdb; /* Light teal background */
	color: #004d40; /* Dark teal text */
}

.course-icons {
	margin: 0 8px; /* Adjust the margin value as needed */
}
</style>
