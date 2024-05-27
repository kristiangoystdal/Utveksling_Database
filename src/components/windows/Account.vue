<template>
	<div>
		<h2>{{ $t("userHandling.accountTitle") }}:</h2>
	</div>
	<br />
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="8">
				<v-card class="pa-5 account-card">
					<v-card-subtitle> </v-card-subtitle>
					<v-card-text>
						<v-alert v-if="loading" type="info">{{
							$t("userHandling.loadingUser")
						}}</v-alert>
						<template v-else-if="user && userData">
							<v-row>
								<v-col cols="12" md="4" class="text-center">
									<v-avatar
										class="mb-4 mx-auto user-avatar"
										size="120"
										v-if="user.photoURL"
									>
										<img :src="user.photoURL" alt="User Photo" />
									</v-avatar>
								</v-col>
								<v-col cols="12" md="8">
									<div id="account_info">
										<strong>{{ $t("userHandling.name") }}:</strong>
										{{ userData.displayName }}<br />
										<strong>{{ $t("userHandling.email") }}:</strong>
										{{ user.email }}<br />
										<strong>{{ $t("database.study") }}:</strong>
										{{ userData.study }}<br />
										<strong>{{ $t("database.specialization") }}:</strong>
										{{ userData.specialization }}<br />
									</div>
								</v-col>
							</v-row>
							<v-row justify="end">
								<v-col cols="12" class="text-right">
									<v-btn color="primary" class="mr-3" @click="editProfile">{{
										$t("operations.edit")
									}}</v-btn>
								</v-col>
							</v-row>
						</template>
						<v-alert v-else type="error">{{
							$t("errors.notLoggedIn")
						}}</v-alert>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="red" @click="signOut">{{
							$t("operations.signOut")
						}}</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<!-- Edit Profile Dialog -->
		<v-dialog v-model="dialog" persistent max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">{{ $t("userHandling.editProfile") }}</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="editForm">
						<v-text-field
							v-model="localEditData.displayName"
							:label="this.$t('userHandling.name')"
							required
						></v-text-field>
						<v-text-field
							v-model="localEditData.email"
							:label="this.$t('userHandling.email')"
							required
						></v-text-field>
						<v-autocomplete
							v-model="localEditData.study"
							:items="studyNames"
							:label="this.$t('database.study')"
							required
							@update:modelValue="handleNewStudy"
						></v-autocomplete>
						<v-autocomplete
							v-model="localEditData.specialization"
							:items="specializations"
							:label="this.$t('database.specialization')"
						></v-autocomplete>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="closeDialog">{{
						$t("operations.cancel")
					}}</v-btn>
					<v-btn color="blue darken-1" text @click="saveProfile">{{
						$t("operations.save")
					}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { auth, db } from "../../js/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, get, set, update } from "firebase/database";
import studiesData from "../../data/studies.json";

export default {
	data() {
		return {
			studies: {},
			user: null,
			userData: null,
			loading: true,
			dialog: false,
			editData: {
				displayName: "",
				email: "",
				study: "",
				specialization: "",
			},
			localEditData: {
				displayName: "",
				email: "",
				study: "",
				specialization: "",
			},
		};
	},
	computed: {
		studyNames() {
			return Object.keys(this.studies);
		},
		specializations() {
			return this.localEditData.study
				? this.studies[this.localEditData.study]
				: [];
		},
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
						specialization: this.localEditData.specialization,
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

				this.$router.push("/login");
			} catch (error) {
				console.error("Error signing out: ", error);
			}
		},
		loadLocalData() {
			this.localEditData = this.userData;
		},
		handleNewStudy() {
			this.localEditData.specialization = "";
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
						specialization: "",
					};
					this.dialog = true;

					// Create a new user record with initial values
					await set(userDocRef, {
						displayName: currentUser.displayName || "",
						email: currentUser.email,
						study: "",
						specialization: "",
					});
				}

				this.loadLocalData();
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
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
}

#account_info {
	width: 100%;
	margin-top: 16px;
	line-height: 1.6;
}

img {
	border-radius: 50%;
	width: 100%;
	border: 2px solid #f5f5f5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.v-btn {
	margin: 0 8px;
}

.v-alert {
	margin: 16px 0;
}

.user-avatar {
	border: 2px solid #f5f5f5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.v-card-title {
	border-bottom: 1px solid #e0e0e0;
	margin-bottom: 16px;
	padding-bottom: 16px;
}

.v-card-subtitle {
	margin-bottom: 16px;
	color: #757575;
}
</style>
