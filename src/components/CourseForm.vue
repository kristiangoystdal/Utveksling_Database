<template>
	<div>
		<h3>Add/Edit Course</h3>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field
				v-model="course.exchangeID"
				label="Exchange ID"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="course.year"
				label="Year"
				:rules="[
					(v) => !!v || 'Required',
					(v) => /^\d{4}$/.test(v) || 'Must be a valid year',
				]"
				required
			></v-text-field>
			<v-text-field
				v-model="course.courseCode"
				label="Course Code"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="course.courseName"
				label="Course Name"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="course.replacedCourseCode"
				label="Replaced Course Code"
			></v-text-field>
			<v-text-field
				v-model="course.replacedCourseName"
				label="Replaced Course Name"
			></v-text-field>
			<v-text-field
				v-model="course.institute"
				label="Institute"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="course.ETCSPoints"
				label="ETCS Points"
				:rules="[
					(v) => !!v || 'Required',
					(v) => !isNaN(v) || 'Must be a number',
				]"
				required
			></v-text-field>
			<v-textarea v-model="course.comments" label="Comments"></v-textarea>
			<v-btn @click="submit">Submit</v-btn>
		</v-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			valid: false,
			course: {
				exchangeID: "",
				year: "",
				courseCode: "",
				courseName: "",
				replacedCourseCode: "",
				replacedCourseName: "",
				institute: "",
				ETCSPoints: "",
				comments: "",
			},
			rules: [
				(v) => !!v || "Required.",
				(v) => (v && v.length >= 3) || "Min 3 characters",
			],
		};
	},
	methods: {
		submit() {
			if (this.$refs.form.validate()) {
				this.$emit("submit-course", { ...this.course });
				this.resetForm();
			}
		},
		resetForm() {
			this.course = {
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
