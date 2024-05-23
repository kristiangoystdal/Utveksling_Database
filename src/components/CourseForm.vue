<template>
	<div>
		<h3>Legg til/Endre fag</h3>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field
				v-model="localCourse.year"
				:label="$t('myExchange.courseInformation.courseYear')"
				:rules="[
					(v) => !!v || $t('rules.required'),
					(v) => /^\d{4}$/.test(v) || $t('rules.yearFormat'),
				]"
				required
				:hint="$t('hints.courseYear')"
				persistent-hint
			></v-text-field>
			<v-text-field
				v-model="localCourse.courseCode"
				:label="$t('database.courseCode')"
				:rules="couresRules"
				required
				:hint="$t('hints.courseCode')"
				persistent-hint
			></v-text-field>
			<v-text-field
				v-model="localCourse.courseName"
				:label="$t('database.courseName')"
				:rules="couresRules"
				required
				:hint="$t('hints.courseName')"
				persistent-hint
			></v-text-field>
			<v-text-field
				v-model="localCourse.replacedCourseCode"
				:label="$t('database.replacedCourseCode')"
				:hint="$t('hints.replacedCourseCode')"
				persistent-hint
			></v-text-field>
			<v-text-field
				v-model="localCourse.replacedCourseName"
				:label="$t('database.replacedCourseName')"
				:hint="$t('hints.replacedCourseName')"
				persistent-hint
			></v-text-field>
			<v-text-field
				v-model="localCourse.institute"
				:label="$t('database.institute')"
				:rules="couresRules"
				required
				:hint="$t('hints.institute')"
				persistent-hint
			></v-text-field>
			<v-text-field
				v-model="localCourse.ETCSPoints"
				:label="$t('database.ETCSPoints')"
				:rules="[
					(v) => !!v || $t('rules.required'),
					(v) => !isNaN(v) || $t('rules.validNumber'),
				]"
				required
				:hint="$t('hints.ETCSPoints')"
				persistent-hint
			></v-text-field>
			<v-textarea
				v-model="localCourse.comments"
				:label="$t('database.comments')"
			></v-textarea>
			<v-btn @click="submit">{{ $t("operations.save") }}</v-btn>
			<v-btn @click="resetForm">{{ $t("operations.reset") }}</v-btn>
			<v-btn @click="confirmDelete">{{ $t("operations.deleteCourse") }}</v-btn>

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
						<v-btn color="green darken-1" text @click="closeDeleteDialog">
							{{ $t("operations.no") }}
						</v-btn>
						<v-btn color="red darken-1" text @click="deleteCourse">
							{{ $t("operations.yes") }}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-form>
	</div>
</template>

<script>
export default {
	props: {
		course: {
			type: Object,
			default: () => ({
				exchangeID: "",
				year: "",
				courseCode: "",
				courseName: "",
				replacedCourseCode: "",
				replacedCourseName: "",
				institute: "",
				ETCSPoints: "",
				comments: "",
			}),
		},
		removeCourse: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			valid: false,
			localCourse: { ...this.course }, // Create a local copy of the course object
			couresRules: [
				(v) => !!v || this.$t("rules.required"),
				(v) => (v && v.length >= 3) || this.$t("rules.min3Chars"),
			],
			deleteDialog: false,
		};
	},
	watch: {
		course: {
			handler(newVal) {
				this.localCourse = { ...newVal };
			},
			deep: true,
		},
	},
	methods: {
		submit() {
			if (this.$refs.form.validate()) {
				this.$emit("submit-course", { ...this.localCourse });
			}
		},
		resetForm() {
			this.localCourse = {
				exchangeID: "",
				year: "",
				courseCode: "",
				courseName: "",
				replacedCourseCode: "",
				replacedCourseName: "",
				institute: "",
				ETCSPoints: "",
				comments: "",
			};
		},
		confirmDelete() {
			this.deleteDialog = true;
		},
		closeDeleteDialog() {
			this.deleteDialog = false;
		},
		deleteCourse() {
			this.closeDeleteDialog();
			this.removeCourse();
		},
	},
	computed: {
		dataFilled() {
			return (
				!this.localCourse.year ||
				!this.localCourse.courseCode ||
				!this.localCourse.courseName ||
				!this.localCourse.institute ||
				!this.localCourse.ETCSPoints
			);
		},
	},
};
</script>

<style scoped></style>
