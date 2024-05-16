<template>
	<div>
		<h2>Programs</h2>
		<p>Welcome to the Programs page!</p>
		<v-btn @click="addTestExchange">Add test exchange</v-btn>
	</div>
	<div>
		<v-autocomplete
			v-model="countryValues"
			:items="countryList"
			label="Land"
			multiple
			chips
			clearable
			:search-input.sync="countrySearch"
		>
			<template v-slot:selection="{ item, index }">
				<v-chip v-if="index < 2" close @click:close="remove(item)">
					<span>{{ item }}</span>
				</v-chip>
				<span
					v-if="index === 2"
					class="text-grey text-caption align-self-center"
				>
					(+{{ countryValues.length - 2 }} others)
				</span>
			</template>
		</v-autocomplete>

		{{ countryValues.length >= 2 }}
	</div>
	<div>
		<v-btn @click="fetchExchangeData">Oppdater</v-btn>
	</div>
	<div>
		<v-data-table
			v-model:expanded="expanded"
			:headers="headers"
			:items="exchangeList"
			item-value="university"
			show-expand
			class="elevation-1"
			id="main-table-width"
		>
			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						<div>
							<br />
							<h3>Fag Høst</h3>

							<v-data-table-virtual
								:headers="headersCourses"
								:items="item.courses.Høst"
								item-value="name"
								dense
							></v-data-table-virtual>
							<br />
							<h3>Fag Vår</h3>

							<v-data-table-virtual
								:headers="headersCourses"
								:items="item.courses.Vår"
								item-value="name"
								dense
							></v-data-table-virtual>
							<br />
						</div>
						<!-- {{ item.courses.Høst }}
						<br /><br />
						{{ item.courses.Vår }} -->
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { auth, db } from "../../js/firebaseConfig";
import {
	ref as dbRef,
	set,
	get,
	child,
	query,
	orderByChild,
	equalTo,
} from "firebase/database";

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
			headersCourses: [
				{ title: "Course Name", align: "start", key: "courseName" },
				{ title: "Course Code", align: "end", key: "courseCode" },
				{
					title: "Replaced Course Name",
					align: "end",
					key: "replacedCourseName",
				},
				{
					title: "Replaced Course Code",
					align: "end",
					key: "replacedCourseCode",
				},
				{ title: "Institute", align: "end", key: "institute" },
				{ title: "ETCS Points", align: "end", key: "ETCSPoints" },
				{ title: "Comments", align: "end", key: "comments" },
			],
			exchangeList: [],
			countryList: [
				"Spain",
				"Portugal",
				"France",
				"Germany",
				"Italy",
				"Sweden",
				"Norway",
				"Denmark",
				"Finland",
				"Iceland",
				"United Kingdom",
				"Ireland",
				"Netherlands",
				"Belgium",
				"Luxembourg",
				"Switzerland",
				"Austria",
				"Czech Republic",
				"Slovakia",
				"Hungary",
				"Slovenia",
				"Croatia",
				"Bosnia and Herzegovina",
				"Serbia",
				"Montenegro",
				"Albania",
				"North Macedonia",
				"Kosovo",
				"Greece",
				"Bulgaria",
				"Romania",
				"Moldova",
				"Ukraine",
				"Belarus",
				"Russia",
				"Poland",
				"Lithuania",
				"Latvia",
				"Estonia",
				"Turkey",
				"Cyprus",
				"Malta",
				"Andorra",
				"Monaco",
				"San Marino",
				"Vatican City",
				"Liechtenstein",
			],
			countryValues: ["Spain"],
			countrySearch: "",
		};
	},
	created() {
		this.fetchExchangeData();
	},
	computed: {
		filteredCountryList() {
			if (!this.countrySearch) {
				return this.countryList;
			}
			return this.countryList.filter((country) =>
				country.toLowerCase().includes(this.countrySearch.toLowerCase())
			);
		},
	},
	methods: {
		remove(item) {
			this.countryValues = this.countryValues.filter((i) => i !== item);
		},
		async FetchDifferentValues(path, list) {
			this.exchangeList = [];
			for (const country of list) {
				console.log(country);
				try {
					const exchangesRef = dbRef(db, "exchanges"); // Use the provided path
					const q = query(exchangesRef, orderByChild(path), equalTo(country));

					const snapshot = await get(q);

					if (snapshot.exists()) {
						const exchanges = snapshot.val();
						this.exchangeList = this.exchangeList.concat(
							Object.values(exchanges).map((exchange) => ({
								...exchange,
							}))
						);
					} else {
						console.log(`No data available for country: ${country}`);
					}
				} catch (error) {
					console.error("Error fetching exchange data: ", error);
				}
			}
		},
		async fetchExchangeData() {
			if (this.countryValues.length > 0) {
				console.log("Fetching exchange data with country filter...");
				this.FetchDifferentValues("country", this.countryValues);
			} else {
				console.log("Fetching exchange data...");
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
			}
		},
		async addTestExchange() {
			const user = auth.currentUser;
			if (user) {
				console.log("Adding test exchange...");
				const exchangeData = {
					university: "University of Madrid",
					country: "Spain",
					studyYear: 4,
					numSemesters: 2,
					study: "user.study",
					specialization: "user.specialization",
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
						Vår: [
							{
								exchangeID: user.uid,
								year: 2018,
								courseCode: "c2",
								courseName: "Course 32",
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
								courseName: "Course 47",
								replacedCourseCode: "INF1010",
								replacedCourseName: "Objektorientert programmering",
								institute: "Department of Computer Science",
								ETCSPoints: 75,
								comments: "Veldig bra fag!",
							},
							{
								exchangeID: user.uid,
								year: 2018,
								courseCode: "c2",
								courseName: "Course 5",
								replacedCourseCode: "INF1010",
								replacedCourseName: "Objektorientert programmering",
								institute: "Department of Computer Science",
								ETCSPoints: 5,
								comments: "Veldig!",
							},
						],
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

<style scoped>
#main-table-width {
	margin: auto;
	width: 90% !important;
	max-width: 1200px !important;
	min-width: 800px !important;
}
.text-grey {
	color: grey;
}
.text-caption {
	font-size: 0.75rem;
}
.align-self-center {
	align-self: center;
}
</style>
