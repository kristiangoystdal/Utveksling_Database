<template>
	<div>
		<h2>Programs</h2>
		<p>Welcome to the Programs page!</p>
		<v-btn @click="addTestExchange">Add test exchange</v-btn>
	</div>
</template>

<script>
import { auth, db } from "../../js/firebaseConfig";
import { ref as dbRef, set, get } from "firebase/database";

export default {
	data() {
		return {};
	},
	methods: {
		async addTestExchange() {
			const user = auth.currentUser;
			if (user) {
				console.log("Adding test exchange...");
				const exchangeData = {
					university: "University of California, Berkeley",
					country: "USA",
					studyYear: 3,
					courses: {
						Høst: {
							1: {
								exchangeID: user.uid,
								year: 2018,
								courseCode: "CS101",
								courseName: "Introduction to Computer Science",
								replacedCourseCode: "INF1010",
								replacedCourseName: "Objektorientert programmering",
								institute: "Department of Computer Science",
								ETCSPoints: 7.5,
								comments: "Veldig bra fag!",
							},
							2: {
								exchangeID: user.uid,
								year: 2018,
								courseCode: "c2",
								courseName: "Course 2",
								replacedCourseCode: "INF1010",
								replacedCourseName: "Objektorientert programmering",
								institute: "Department of Computer Science",
								ETCSPoints: 7.5,
								comments: "Veldig bra fag!",
							},
						},
						Vår: {
							1: {
								exchangeID: user.uid,
								year: 2019,
								courseCode: "CS101",
								courseName: "Spansk",
								replacedCourseCode: "384",
								replacedCourseName: "Objektorientert programmering",
								institute: "Department of Computer Science",
								ETCSPoints: 6,
								comments: "Vanskelig",
							},
							2: {
								exchangeID: user.uid,
								year: 2019,
								courseCode: "c15",
								courseName: "Course 15",
								replacedCourseCode: "INF1010",
								replacedCourseName: "Objektorientert programmering",
								institute: "Department of Computer Science",
								ETCSPoints: 7.5,
								comments: "Supert!",
							},
						},
					},
				};
				try {
					await set(dbRef(db, `exchanges/${user.uid}`), exchangeData);
					console.log("Test exchange added!");
				} catch (error) {
					console.error("Error adding exchange: ", error);
				}
			} else {
				console.log("No user is signed in.");
			}
		},
	},
	mounted() {},
};
</script>
