<template>
	<div>
		<h2>{{ $t("exchanges.pageHeader") }}</h2>
		<p class="box box-third-color preserve-whitespace text-center">
			{{ $t("exchanges.info") }}
		</p>
	</div>
	<br />
	<br />
	<!-- Filters -->
	<div>
		<v-btn @click="toggleFilters" class="btn btn-primary">
			{{ showFilters ? t("exchanges.hideFilter") : t("exchanges.showFilter") }}
		</v-btn>
		<v-btn @click="fetchExchangeData" class="btn btn-accent">
			{{ $t("exchanges.updateTable") }}
		</v-btn>

		<v-slide-y-transition>
			<div class="filter-container" v-if="showFilters">
				<br />
				<h4>Filter:</h4>
				<v-container>
					<v-row>
						<v-col cols="12" md="4">
							<!-- Country Filter -->
							<v-autocomplete
								v-model="countryValues"
								:items="countryList"
								:label="$t('database.country')"
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
								:label="$t('database.university')"
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
								:label="$t('database.study')"
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
								:label="$t('database.specialization')"
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
								:label="$t('database.numSemesters')"
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
				<div></div>
			</div>
		</v-slide-y-transition>
	</div>
	<br />
	<br />

	<!-- Data Table -->

	<div v-if="!isMobile">
		<v-data-table
			v-model:expanded="expanded"
			:headers="translatedHeaders"
			:items="exchangeList"
			item-value="id"
			show-expand
			class="main-table"
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
								{{ $t("exchanges.coursesFallHeader") }}
							</h3>
							<v-data-table-virtual
								v-if="
									item.courses && item.courses.Høst && item.courses.Høst.length
								"
								:headers="translatedHeadersCourses"
								:items="item.courses.Høst"
								item-value="name"
								dense
								class="virtual-table"
							>
								<template v-slot:item.comment="{ item }">
									<v-icon small class="mr-2" @click="showComments(item)">
										mdi-comment
									</v-icon>
								</template>
							</v-data-table-virtual>
							<br />
							<h3
								v-if="
									item.courses && item.courses.Vår && item.courses.Vår.length
								"
							>
								{{ $t("exchanges.coursesSpringHeader") }}
							</h3>
							<v-data-table-virtual
								v-if="
									item.courses && item.courses.Vår && item.courses.Vår.length
								"
								:headers="translatedHeadersCourses"
								:items="item.courses.Vår"
								item-value="name"
								dense
								class="virtual-table"
							>
								<template v-slot:item.comment="{ item }">
									<v-icon small class="mr-2" @click="showComments(item)">
										mdi-comment
									</v-icon>
								</template>
							</v-data-table-virtual>
							<br />
						</div>
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>

	<div v-else>
		<v-data-table
			:headers="translatedMobileHeaders"
			v-model:expanded="expanded"
			:items="exchangeList"
			item-value="id"
			show-expand
			class="main-table fixed-table"
			id="main-table-width"
		>
			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="translatedMobileHeaders.length + 1">
						<div class="expanded-content">
							<div>
								<div class="text-underline text-medium">More Info</div>
								<v-container>
									<v-row no-gutters>
										<v-col cols="6" class="text-bold">
											{{ $t("database.specialization") }}:
										</v-col>
										<v-col cols="6">
											{{ item.specialization }}
										</v-col>
									</v-row>
									<v-row no-gutters>
										<v-col cols="6" class="text-bold">
											{{ $t("database.numSemesters") }}:
										</v-col>
										<v-col cols="6">
											{{ item.numSemesters }}
										</v-col>
									</v-row>
									<v-row no-gutters>
										<v-col cols="6" class="text-bold">
											{{ $t("database.studyYear") }}:
										</v-col>
										<v-col cols="6">
											{{ item.studyYear }}
										</v-col>
									</v-row>
									<br />
									<div v-if="item.courses.Høst">
										<v-row
											no-gutters
											class="text-bold"
											style="font-size: 15px; text-decoration: underline"
										>
											{{ $t("exchanges.coursesFallHeader") }}
										</v-row>
										<v-row no-gutters style="margin-bottom: 5px">
											<v-col
												cols="5"
												class="text-bold"
												style="padding-right: 5px"
											>
												{{ $t("database.courseName") }}
											</v-col>
											<v-col
												cols="3"
												class="text-bold"
												style="padding-right: 5px"
											>
												{{ $t("database.courseCode") }}
											</v-col>
											<v-col
												cols="4"
												class="text-bold"
												style="padding-right: 5px"
											>
												{{ $t("database.ETCSPoints") }}
											</v-col>
										</v-row>
										<v-row
											v-for="(course, index) in item.courses.Høst"
											:key="index"
											class="mb-3"
											no-gutters
										>
											<v-col cols="5">
												{{ course.courseName }}
											</v-col>
											<v-col cols="3">
												{{ course.courseCode }}
											</v-col>
											<v-col cols="3">
												{{ course.ETCSPoints }}
											</v-col>
											<v-col cols="1">
												<v-icon
													small
													class="mr-2"
													@click="toggleInformationDialog(course)"
												>
													mdi-dots-horizontal
												</v-icon>
											</v-col>
										</v-row>
									</div>
									<div v-if="item.courses.Vår">
										<v-row
											no-gutters
											class="text-bold"
											style="font-size: 15px; text-decoration: underline"
										>
											{{ $t("exchanges.coursesSpringHeader") }}
										</v-row>
										<v-row no-gutters style="margin-bottom: 5px">
											<v-col
												cols="5"
												class="text-bold"
												style="padding-right: 5px"
											>
												{{ $t("database.courseName") }}
											</v-col>
											<v-col
												cols="3"
												class="text-bold"
												style="padding-right: 5px"
											>
												{{ $t("database.courseCode") }}
											</v-col>
											<v-col
												cols="4"
												class="text-bold"
												style="padding-right: 5px"
											>
												{{ $t("database.ETCSPoints") }}
											</v-col>
										</v-row>
										<v-row
											v-for="(course, index) in item.courses.Vår"
											:key="index"
											class="mb-3"
											no-gutters
										>
											<v-col cols="5">
												{{ course.courseName }}
											</v-col>
											<v-col cols="3">
												{{ course.courseCode }}
											</v-col>
											<v-col cols="3">
												{{ course.ETCSPoints }}
											</v-col>
											<v-col cols="1">
												<v-icon
													small
													class="mr-2"
													@click="toggleInformationDialog(course)"
												>
													mdi-dots-horizontal
												</v-icon>
											</v-col>
										</v-row>
									</div>
								</v-container>
							</div>

							<!-- Expanded content goes here -->
							<!-- {{ item.courses.Høst }} -->
						</div>
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>

	<!-- Comment Dialog -->
	<v-dialog v-model="commentDialog" max-width="500px" class="dialog">
		<v-card>
			<v-card-title>
				{{ $t("exchanges.courseComments") }} {{ currentCourseName }}
			</v-card-title>
			<v-card-text>{{ currentComments }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn class="btn btn-secondary" text @click="closeCommentDialog">
					{{ $t("operations.close") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Information Dialog -->
	<v-dialog v-model="informationDialog" max-width="500px" class="dialog">
		<v-card>
			<v-card-title>
				{{ $t("exchanges.courseInformation") }}
			</v-card-title>
			<v-card-text>
				<v-row no-gutters>
					<v-col cols="12" class="text-bold">
						{{ $t("database.institute") }}:
					</v-col>
					<v-col cols="12">
						{{ currentCourse.institute }}
					</v-col>
				</v-row>
				<v-row no-gutters style="margin-top: 5px">
					<v-col cols="12" class="text-bold">
						{{ $t("database.replacedCourseName") }}:
					</v-col>
					<v-col cols="12">
						{{ currentCourse.replacedCourseName }}
					</v-col>
				</v-row>
				<v-row no-gutters style="margin-top: 5px">
					<v-col cols="12" class="text-bold">
						{{ $t("database.replacedCourseCode") }}:
					</v-col>
					<v-col cols="12">
						{{ currentCourse.replacedCourseCode }}
					</v-col>
				</v-row>
				<v-row no-gutters style="margin-top: 5px">
					<v-col cols="12" class="text-bold">
						{{ $t("database.courseType") }}:
					</v-col>
					<v-col cols="12">
						{{ currentCourse.courseType }}
					</v-col>
				</v-row>
				<v-row no-gutters style="margin-top: 5px">
					<v-col cols="12" class="text-bold">
						{{ $t("database.comments") }}:
					</v-col>
					<v-col cols="12" v-if="currentCourse.comments">
						{{ currentCourse.comments }}
					</v-col>
					<v-col cols="12" v-else>
						{{ $t("exchanges.noComments") }}
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn class="btn btn-secondary" text @click="toggleInformationDialog">
					{{ $t("operations.close") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { db } from "../../js/firebaseConfig.js";
import { get, child, ref as dbRef } from "firebase/database";
import { useI18n } from "vue-i18n";

export default {
	setup() {
		const { t, locale } = useI18n();
		return { t, locale };
	},
	data() {
		return {
			showFilters: false,
			expanded: [],
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
			commentDialog: false,
			currentComments: "",
			currentCourseName: "",
			screenWidth: window.innerWidth,
			informationDialog: false,
			currentCourse: null,
		};
	},
	created() {
		this.fetchExchangeData();
	},
	mounted() {
		this.getValuesFromDatabase();
		window.addEventListener("resize", this.updateScreenWidth);
		this.updateScreenWidth();
	},
	beforeUnmount() {
		window.removeEventListener("resize", this.updateScreenWidth);
	},
	watch: {
		locale(newLocale, oldLocale) {
			this.fetchExchangeData();
			this.getValuesFromDatabase();
		},
	},
	computed: {
		isMobile() {
			return this.screenWidth <= 768;
		},
		translatedHeaders() {
			return [
				{
					title: this.t("database.university"),
					align: "start",
					key: "university",
				},
				{
					title: this.t("database.country"),
					align: "end",
					key: "country",
				},
				{
					title: this.t("database.studyYear"),
					align: "end",
					key: "studyYear",
				},
				{
					title: this.t("database.study"),
					align: "end",
					key: "study",
				},
				{
					title: this.t("database.specialization"),
					align: "end",
					key: "specialization",
				},
				{
					title: this.t("database.numSemesters"),
					align: "end",
					key: "numSemesters",
				},
			];
		},
		translatedHeadersCourses() {
			return [
				{
					title: this.t("database.courseName"),
					align: "start",
					key: "courseName",
				},
				{
					title: this.t("database.courseCode"), // fixed typo
					align: "end",
					key: "courseCode",
				},
				{
					title: this.t("database.replacedCourseName"),
					align: "end",
					key: "replacedCourseName",
				},
				{
					title: this.t("database.replacedCourseCode"),
					align: "end",
					key: "replacedCourseCode",
				},
				{
					title: this.t("database.courseType"),
					align: "end",
					key: "courseType",
				},
				{
					title: this.t("database.institute"),
					align: "end",
					key: "institute",
				},
				{
					title: this.t("database.ETCSPoints"),
					align: "end",
					key: "ETCSPoints",
				},
				{
					title: this.t("database.comments"),
					align: "end",
					key: "comment",
				},
			];
		},
		translatedMobileHeaders() {
			return [
				{
					title: this.t("database.university"),
					align: "start",
					key: "university",
				},
				{
					title: this.t("database.country"),
					align: "end",
					key: "country",
				},
				{
					title: this.t("database.study"),
					align: "end",
					key: "study",
				},
			];
		},
		translatedMobileHeadersCourses() {
			return [
				{
					title: this.t("database.courseName"),
					align: "start",
					key: "courseName",
				},
				{
					title: this.t("database.courseCode"), // fixed typo
					align: "end",
					key: "courseCode",
				},
				{
					title: this.t("database.replacedCourseName"),
					align: "end",
					key: "replacedCourseName",
				},
				{
					title: this.t("database.replacedCourseCode"),
					align: "end",
					key: "replacedCourseCode",
				},
				{
					title: this.t("database.courseType"),
					align: "end",
					key: "courseType",
				},
				{
					title: this.t("database.institute"),
					align: "end",
					key: "institute",
				},
				{
					title: this.t("database.ETCSPoints"),
					align: "end",
					key: "ETCSPoints",
				},
				{
					title: this.t("database.comments"),
					align: "end",
					key: "comment",
				},
			];
		},
	},
	methods: {
		updateScreenWidth() {
			this.screenWidth = window.innerWidth;
		},
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

						// Check if either 'Høst' or 'Vår' courses exist and have at least one course
						const hasAutumnCourses =
							exchange.courses &&
							exchange.courses.Høst &&
							exchange.courses.Høst.length > 0;
						const hasSpringCourses =
							exchange.courses &&
							exchange.courses.Vår &&
							exchange.courses.Vår.length > 0;

						if (hasAutumnCourses || hasSpringCourses) {
							if (exchange.country) {
								countriesSet.add(this.$t(`countries.${exchange.country}`));
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
					}

					this.countryList = Array.from(countriesSet);
					this.universityList = Array.from(universitiesSet);
					this.studyList = Array.from(studiesSet);
					this.specializationList = Array.from(specializationsSet);
				} else {
					console.error("No data available");
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
							country: this.$t(`countries.${exchanges[key].country}`),
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
					console.error("No data available");
				}
			} catch (error) {
				console.error("Error fetching exchange data:", error);
			}
		},
		showComments(course) {
			this.currentCourseName = course.courseName;
			this.currentComments = course.comments || this.t("exchanges.noComments");
			this.commentDialog = true;
		},
		closeCommentDialog() {
			this.commentDialog = false;
		},
		toggleInformationDialog(course) {
			this.informationDialog = !this.informationDialog;
			if (this.informationDialog) {
				this.currentCourse = course;
			}
		},
		closeInformationDialog() {
			this.informationDialog = false;
		},
	},
};
</script>

<style scoped></style>
