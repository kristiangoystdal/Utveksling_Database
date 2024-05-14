<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12">
				<v-card class="pa-5 account-card">
					<v-card-title class="d-flex justify-space-between align-center">
						<h2>Your Account</h2>
					</v-card-title>
					<v-card-text>
						<v-alert v-if="loading" type="info">Loading user data...</v-alert>
						<template v-else-if="user && userData">
							<v-row>
								<v-col cols="12" md="4" class="text-center">
									<v-avatar
										class="mb-4 mx-auto"
										size="120"
										v-if="user.photoURL"
									>
										<img :src="user.photoURL" alt="User Photo" />
									</v-avatar>
								</v-col>
								<v-col cols="12" md="8">
									<div id="account_info">
										<strong>Name:</strong> {{ userData.displayName }}<br />
										<strong>Email:</strong> {{ user.email }}<br />
										<strong>Study:</strong> {{ userData.study }}<br />
										{{ userData.additionalInfo }}
									</div>
								</v-col>
							</v-row>
							<v-row justify="end">
								<v-col cols="12" class="text-right">
									<v-btn color="primary" @click="editProfile">Edit</v-btn>
								</v-col>
							</v-row>
						</template>
						<v-alert v-else type="error"
							>User data not available. Please log in.</v-alert
						>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="red" @click="signOut">Sign Out</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<!-- Edit Profile Dialog -->
		<v-dialog v-model="dialog" persistent max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Edit Profile</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="editForm">
						<v-text-field
							v-model="localEditData.displayName"
							label="Name"
							required
						></v-text-field>
						<v-text-field
							v-model="localEditData.email"
							label="Email"
							required
						></v-text-field>
						<v-autocomplete
							v-model="localEditData.study"
							:items="studies"
							label="Study"
							required
						></v-autocomplete>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
					<v-btn color="blue darken-1" text @click="saveProfile">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { auth, db } from "../../js/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, get, set, update } from "firebase/database";
import studiesData from "../../data/studies.json";

export default {
	data() {
		return {
			studies: [],
			user: null,
			userData: null,
			loading: true,
			dialog: false,
			editData: {
				displayName: "",
				email: "",
				study: "",
				additionalInfo: "",
			},
			localEditData: {
				displayName: "",
				email: "",
				study: "",
			},
		};
	},
	methods: {
		loadData() {
			try {
				this.studies = studiesData.studies;
			} catch (error) {
				console.error("There was an error loading the studies data:", error);
			}
		},
		editProfile() {
			if (this.user && this.userData) {
				this.localEditData = { ...this.userData };
				this.dialog = true;
			}
		},
		closeDialog() {
			this.dialog = false;
		},
		async saveProfile() {
			if (this.user) {
				try {
					await update(dbRef(db, `users/${this.user.uid}`), {
						displayName: this.localEditData.displayName,
						email: this.localEditData.email,
						study: this.localEditData.study,
					});
					this.userData = { ...this.localEditData };
					this.closeDialog();
				} catch (error) {
					console.error("Error updating profile: ", error);
				}
			}
		},
		async signOut() {
			try {
				await signOut(auth);
				this.user = null;
				this.userData = null;
			} catch (error) {
				console.error("Error signing out: ", error);
			}
		},
	},
	mounted() {
		// Fetch studies file
		this.loadData();

		// Handle user authentication state
		onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				this.user = currentUser;
				const userDocRef = dbRef(db, `users/${currentUser.uid}`);
				const userDoc = await get(userDocRef);
				if (userDoc.exists()) {
					this.userData = userDoc.val();
				} else {
					// If user does not exist, show edit dialog
					this.localEditData = {
						displayName: currentUser.displayName || "",
						email: currentUser.email || "",
						study: "",
					};
					this.dialog = true;

					// Create a new user record with initial values
					await set(userDocRef, {
						displayName: currentUser.displayName || "",
						email: currentUser.email,
						study: "",
					});
				}
			} else {
				this.user = null;
				this.userData = null;
			}
			this.loading = false;
		});
	},
};
</script>

<style scoped>
.account-card {
	flex-basis: 100% !important;
}

#account_info {
	width: 100%;
}

img {
	border-radius: 50%;
	width: 100%;
}
</style>
