<template>
	<div>
		<v-btn @click="addRandomExchanges">Add 10 Random Exchanges</v-btn>
	</div>
</template>

<script>
import { db } from "../js/firebaseConfig";
import { ref as dbRef, set } from "firebase/database";

export default {
	methods: {
		generateRandomId(length = 28) {
			const characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			let result = "";
			const charactersLength = characters.length;
			for (let i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			return result;
		},
		async addRandomExchanges() {
			const universities = [
				"University of California, Berkeley",
				"University of Oxford",
				"University of Cambridge",
				"Stanford University",
				"MIT",
				"ETH Zurich",
				"University of Toronto",
				"University of Tokyo",
				"University of Hong Kong",
				"University of Sydney",
			];
			const countries = [
				"USA",
				"UK",
				"Spain",
				"Germany",
				"France",
				"China",
				"Japan",
				"Australia",
				"Canada",
				"Switzerland",
				"Hong Kong",
				"Singapore",
			];
			const studyData = {
				"Elektronisk systemdesign og innovasjon": [
					"Design av digitale og innvevde system",
					"Analog kretsdesign og radioteknikk",
					"Signalbehandling og kommunikasjon",
					"Akustikk for kommunikasjon, miljø og fjernmåling",
					"Nanoelektronikk og fotonikk",
					"Romsystemer",
				],
				"Kybernetikk og robotikk": [
					"Tilpassede datasystemer",
					"Energi og prosesstyring",
					"Roboter og fartøystyring",
					"Medisinske og biologiske systemer",
				],
			};

			for (let i = 0; i < 10; i++) {
				const university =
					universities[Math.floor(Math.random() * universities.length)];
				const country = countries[Math.floor(Math.random() * countries.length)];
				const study =
					Object.keys(studyData)[
					Math.floor(Math.random() * Object.keys(studyData).length)
					];
				const specialization =
					studyData[study][Math.floor(Math.random() * studyData[study].length)];
				const studyYear = Math.floor(Math.random()) + 3;
				const numSemesters = Math.floor(Math.random() * 2) + 1;
				const randomUserId = this.generateRandomId(); // Generate a random user ID with the specified length

				const generateCourses = (semester) => {
					const numCourses = Math.floor(Math.random() * 4) + 3;
					const courses = [];
					for (let j = 0; j < numCourses; j++) {
						courses.push({
							exchangeID: randomUserId,
							year: Math.floor(Math.random() * 4) + 2016,
							courseCode: `C${Math.floor(Math.random() * 100)}`,
							courseName: `Course ${j + 1}`,
							replacedCourseCode: `R${Math.floor(Math.random() * 1000)}`,
							replacedCourseName: `Replaced Course ${j + 1}`,
							institute: "Department of Computer Science",
							ETCSPoints: Math.floor(Math.random() * 10) + 1,
							comments: ["Great course!", "Very challenging", "Enjoyed it!"][
								Math.floor(Math.random() * 3)
							],
						});
					}
					return courses;
				};

				const semesterOptions = ["Høst", "Vår"];
				const selectedSemester =
					numSemesters === 1
						? semesterOptions[
						Math.floor(Math.random() * semesterOptions.length)
						]
						: "Høst";

				const exchangeData = {
					university,
					country,
					studyYear,
					numSemesters,
					study,
					specialization,
					courses: {
						Høst:
							numSemesters === 2 || selectedSemester === "Høst"
								? generateCourses("Høst")
								: [],
						Vår:
							numSemesters === 2 || selectedSemester === "Vår"
								? generateCourses("Vår")
								: [],
					},
				};

				try {
					await set(dbRef(db, `exchangesTest/${randomUserId}`), exchangeData);
					console.log(`Test exchange ${i + 1} added!`);
				} catch (error) {
					console.error(`Error adding exchange ${i + 1}: `, error);
				}
			}
		},
	},
};
</script>

<style scoped></style>
