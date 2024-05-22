<template>
	<div>
		<h2>Tidligere utvekslinger:</h2>
		<p>
			På denne siden kan du utforske utvekslingserfaringene til tidligere
			studenter. Du kan se hvilke universiteter de har vært på, hvilke land de
			har besøkt, og hvilke fag de har tatt.
		</p>
	</div>
	<br />
	<br />
	<!-- Filters -->
	<div>
		<v-btn @click="toggleFilters">
			{{ showFilters ? "Skjul filter" : "Vis filter" }}
		</v-btn>
		<v-slide-y-transition>
			<div class="filter-container" v-if="showFilters">
				<h4>Filter:</h4>
				<v-container>
					<v-row>
						<v-col cols="12" md="4">
							<!-- Country Filter -->
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
						</v-col>
						<v-col cols="12" md="4">
							<!-- University Filter -->
							<v-autocomplete
								v-model="universityValues"
								:items="universityList"
								label="Universitet"
								multiple
								chips
								clearable
								:search-input.sync="universitySearch"
							>
								<template v-slot:selection="{ item, index }">
									<v-chip v-if="index < 2" close @click:close="remove(item)">
										<span>{{ item }}</span>
									</v-chip>
									<span
										v-if="index === 2"
										class="text-grey text-caption align-self-center"
									>
										(+{{ universityValues.length - 2 }} others)
									</span>
								</template>
							</v-autocomplete>
						</v-col>
						<v-col cols="12" md="4">
							<!-- Study Filter -->
							<v-autocomplete
								v-model="studyValues"
								:items="studyList"
								label="Studie"
								multiple
								chips
								clearable
								:search-input.sync="studySearch"
							>
								<template v-slot:selection="{ item, index }">
									<v-chip v-if="index < 2" close @click:close="remove(item)">
										<span>{{ item }}</span>
									</v-chip>
									<span
										v-if="index === 2"
										class="text-grey text-caption align-self-center"
									>
										(+{{ studyValues.length - 2 }} others)
									</span>
								</template>
							</v-autocomplete>
						</v-col>
					</v-row>
					<v-row justify="center">
						<v-col cols="12" md="4">
							<!-- Specialization Filter -->
							<v-autocomplete
								v-model="specializationValues"
								:items="specializationList"
								label="Spesialisering"
								multiple
								chips
								clearable
								:search-input.sync="specializationSearch"
							>
								<template v-slot:selection="{ item, index }">
									<v-chip v-if="index < 2" close @click:close="remove(item)">
										<span>{{ item }}</span>
									</v-chip>
									<span
										v-if="index === 2"
										class="text-grey text-caption align-self-center"
									>
										(+{{ specializationValues.length - 2 }} others)
									</span>
								</template>
							</v-autocomplete>
						</v-col>
						<v-col cols="12" md="4">
							<!-- Number of Semesters Filter -->
							<v-autocomplete
								v-model="numSemestersValues"
								:items="numSemestersList"
								label="Antall Semestere"
								multiple
								chips
								clearable
								:search-input.sync="numSemestersSearch"
							>
								<template v-slot:selection="{ item, index }">
									<v-chip v-if="index < 2" close @click:close="remove(item)">
										<span>{{ item }}</span>
									</v-chip>
									<span
										v-if="index === 2"
										class="text-grey text-caption align-self-center"
									>
										(+{{ numSemestersValues.length - 2 }} others)
									</span>
								</template>
							</v-autocomplete>
						</v-col>
					</v-row>
				</v-container>
				<div>
					<v-btn @click="fetchExchangeData">Oppdater</v-btn>
				</div>
			</div>
		</v-slide-y-transition>
	</div>
	<br />
	<br />
	<!-- Data Table -->
	<div>
		<v-data-table
			v-model:expanded="expanded"
			:headers="headers"
			:items="exchangeList"
			item-value="id"
			show-expand
			id="main-table-width"
		>
			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length" id="coursesStyle">
						<div>
							<br />
							<h3
								v-if="
									item.courses && item.courses.Høst && item.courses.Høst.length
								"
							>
								Fag Høst
							</h3>
							<v-data-table-virtual
								v-if="
									item.courses && item.courses.Høst && item.courses.Høst.length
								"
								:headers="headersCourses"
								:items="item.courses.Høst"
								item-value="name"
								dense
								class="virtual-table"
							></v-data-table-virtual>
							<br />
							<h3
								v-if="
									item.courses && item.courses.Vår && item.courses.Vår.length
								"
							>
								Fag Vår
							</h3>
							<v-data-table-virtual
								v-if="
									item.courses && item.courses.Vår && item.courses.Vår.length
								"
								:headers="headersCourses"
								:items="item.courses.Vår"
								item-value="name"
								dense
								class="virtual-table"
							></v-data-table-virtual>
							<br />
						</div>
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { db } from "../../js/firebaseConfig.js";
import { get, child, ref as dbRef } from "firebase/database";

export default {
	data() {
		return {
			showFilters: false,
			expanded: [],
			headers: [
				{ title: "Universitet", align: "start", key: "university" },
				{ title: "Land", align: "end", key: "country" },
				{ title: "Studieår", align: "end", key: "studyYear" },
				{ title: "Studie", align: "end", key: "study" },
				{ title: "Spesialisering", align: "end", key: "specialization" },
				{ title: "Antall Semestere", align: "end", key: "numSemesters" },
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
				// { title: "Comments", align: "end", key: "comments" },
			],
			exchangeList: [],
			countryList: [],
			countryValues: [],
			countrySearch: "",
			universityList: [],
			universityValues: [],
			universitySearch: "",
			studyList: [],
			studyValues: [],
			studySearch: "",
			specializationList: [],
			specializationValues: [],
			specializationSearch: "",
			numSemestersList: [1, 2],
			numSemestersValues: [],
			numSemestersSearch: "",
		};
	},
	created() {
		this.fetchExchangeData();
	},
	mounted() {
		this.getValuesFromDatabase();
	},
	methods: {
		toggleFilters() {
			this.showFilters = !this.showFilters;
		},
		async getValuesFromDatabase() {
			try {
				const exchangesSnapshot = await get(child(dbRef(db), "exchanges"));
				if (exchangesSnapshot.exists()) {
					let exchanges = exchangesSnapshot.val();
					const countriesSet = new Set();
					const universitiesSet = new Set();
					const studiesSet = new Set();
					const specializationsSet = new Set();

					for (const exchangeKey in exchanges) {
						const exchange = exchanges[exchangeKey];

						if (exchange.country) {
							countriesSet.add(exchange.country);
						}
						if (exchange.university) {
							universitiesSet.add(exchange.university);
						}
						if (exchange.study) {
							studiesSet.add(exchange.study);
						}
						if (exchange.specialization) {
							specializationsSet.add(exchange.specialization);
						}
					}

					this.countryList = Array.from(countriesSet);
					this.universityList = Array.from(universitiesSet);
					this.studyList = Array.from(studiesSet);
					this.specializationList = Array.from(specializationsSet);
				} else {
					console.log("No data available");
				}
			} catch (error) {
				console.error("Error fetching values from database:", error);
			}
		},
		remove(item) {
			this.countryValues = this.countryValues.filter((i) => i !== item);
		},
		async fetchExchangeData() {
			try {
				const snapshot = await get(child(dbRef(db), "exchanges"));
				if (snapshot.exists()) {
					let exchanges = snapshot.val();

					exchanges = Object.keys(exchanges)
						.map((key) => ({
							id: key,
							...exchanges[key],
						}))
						.filter(
							(exchange) =>
								exchange.courses && Object.keys(exchange.courses).length > 0
						);

					if (this.countryValues.length > 0) {
						exchanges = exchanges.filter((exchange) =>
							this.countryValues.includes(exchange.country)
						);
					}
					if (this.universityValues.length > 0) {
						exchanges = exchanges.filter((exchange) =>
							this.universityValues.includes(exchange.university)
						);
					}
					if (this.studyValues.length > 0) {
						exchanges = exchanges.filter((exchange) =>
							this.studyValues.includes(exchange.study)
						);
					}
					if (this.specializationValues.length > 0) {
						exchanges = exchanges.filter((exchange) =>
							this.specializationValues.includes(exchange.specialization)
						);
					}
					if (this.numSemestersValues.length > 0) {
						exchanges = exchanges.filter((exchange) =>
							this.numSemestersValues.includes(exchange.numSemesters)
						);
					}

					this.exchangeList = exchanges;
				} else {
					console.log("No data available");
				}
			} catch (error) {
				console.error("Error fetching exchange data:", error);
			}
		},
	},
};
</script>

<style scoped>
.v-data-table-header__content {
	font-weight: bold;
}

#main-table-width {
	margin: auto !important;
	width: 90% !important;
	max-width: 1200px !important;
	min-width: 800px !important;
}
.text-grey {
	color: grey !important;
}
.text-caption {
	font-size: 0.75rem !important;
}
.align-self-center {
	align-self: center !important;
}
.filter-container {
	max-width: 1000px !important;
	margin: 0 auto !important;
	padding: 16px !important;
}
.v-autocomplete {
	height: auto !important;
	width: 100% !important;
	margin: auto !important;
}
#coursesStyle {
	background-color: #f1f1f1 !important;
}
</style>
