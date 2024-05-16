<template>
	<div>
		<h2>Programs</h2>
		<p>Welcome to the Programs page!</p>
		<v-btn @click="addTestExchange">Add test exchange</v-btn>

		<v-data-table
			v-model:expanded="expanded"
			:headers="headers"
			:items="exchangeList"
			item-value="university"
			show-expand
			class="elevation-1"
		>
			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length * 0.9">
						{{ item.courses.Høst }}
					</td>
					<br />
					<!-- <td :colspan="columns.length * 0.9">
						{{ item.courses.Vår }}
					</td> -->
				</tr>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { auth, db } from "../../js/firebaseConfig";
import { ref as dbRef, set, get, child } from "firebase/database";

export default {
	data() {
		return {
			expanded: [],
			headers: [
				{ title: "Universitet", align: "start", key: "university" },
				{ title: "Land", align: "end", key: "country" },
				{ title: "Studieår", align: "end", key: "studyYear" },
				{ title: "Studie", align: "end", key: "study" },
				{ title: "Spesialisering", align: "end", key: "specialization" },
				{ title: "Antall Semestere ", align: "end", key: "numSemesters" },
			],
			exchangeList: [],
		};
	},
	created() {
		this.fetchExchangeData();
	},
	methods: {
		async fetchExchangeData() {
			try {
				const snapshot = await get(child(dbRef(db), `exchanges`));
				if (snapshot.exists()) {
					const exchanges = snapshot.val();
					this.exchangeList = Object.values(exchanges).map((exchange) => ({
						...exchange,
					}));
				} else {
					console.log("No data available");
				}
			} catch (error) {
				console.error("Error fetching exchange data: ", error);
			}
		},
		async addTestExchange() {
			const user = auth.currentUser;
			if (user) {
				console.log("Adding test exchange...");
				const exchangeData = {
					university: "University of Lisbon",
					country: "Portugal",
					studyYear: 4,
					numSemesters: 1,
					courses: {
						Høst: [
							{
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
							{
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
						],
						Vår: [],
					},
				};
				try {
					await set(dbRef(db, `exchanges/${user.uid}`), exchangeData);
					console.log("Test exchange added!");
					this.fetchExchangeData(); // Refresh the data
				} catch (error) {
					console.error("Error adding exchange: ", error);
				}
			} else {
				console.log("No user is signed in.");
			}
		},
	},
};
</script>
