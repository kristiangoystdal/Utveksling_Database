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
			<v-btn @click="resetForm">{{ $t("operations.reset") }}</v-btn>
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
	},
	data() {
		return {
			valid: false,
			localCourse: { ...this.course }, // Create a local copy of the course object
			couresRules: [
				(v) => !!v || this.$t("rules.required"),
				(v) => (v && v.length >= 3) || this.$t("rules.min3Chars"),
			],
		};
	},
	watch: {
		localCourse: {
			handler(newVal) {
				this.$emit("submit-course", { ...this.localCourse });
			},
			deep: true,
			immediate: true,
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
	},
};
</script>

<style scoped></style>
