<template>
	<div>
		<h3>Legg til/Endre fag</h3>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field
				v-model="localCourse.year"
				label="År"
				:rules="[
					(v) => !!v || 'Påkrevd',
					(v) => /^\d{4}$/.test(v) || 'Må være et gyldig årstall',
				]"
				required
			></v-text-field>
			<v-text-field
				v-model="localCourse.courseCode"
				label="Fagkode"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="localCourse.courseName"
				label="Fagnavn"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="localCourse.replacedCourseCode"
				label="Erstattet fagkode"
			></v-text-field>
			<v-text-field
				v-model="localCourse.replacedCourseName"
				label="Ersatt fagnavn"
			></v-text-field>
			<v-text-field
				v-model="localCourse.institute"
				label="Institutt"
				:rules="rules"
				required
			></v-text-field>
			<v-text-field
				v-model="localCourse.ETCSPoints"
				label="ETCS Poeng"
				:rules="[
					(v) => !!v || 'Påkrevd',
					(v) => !isNaN(v) || 'Må være et tall',
				]"
				required
			></v-text-field>
			<v-textarea v-model="localCourse.comments" label="Kommentar"></v-textarea>
			<v-btn @click="submit">Lagre</v-btn>
			<v-btn @click="resetForm">Nullstill</v-btn>
			<v-btn @click="confirmDelete">Slett fag</v-btn>

			<v-dialog v-model="deleteDialog" max-width="500">
				<v-card>
					<v-card-title class="headline">Bekreft sletting</v-card-title>
					<v-card-text
						>Er du sikker på at du vil slette dette faget?</v-card-text
					>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="green darken-1" text @click="closeDeleteDialog"
							>Nei</v-btn
						>
						<v-btn color="red darken-1" text @click="deleteCourse">Ja</v-btn>
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
			rules: [
				(v) => !!v || "Required.",
				(v) => (v && v.length >= 3) || "Min 3 characters",
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
