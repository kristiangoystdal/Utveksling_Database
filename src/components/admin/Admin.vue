<template>
	<div>
		<h2>{{ $t("adminPage.pageHeader") }}:</h2>
	</div>
	<br />
	<v-container>
		<!-- User List -->
		<v-card style="padding: 20px ;">
			<h3>{{ $t("adminPage.userListTitle") }}</h3>
			<v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
				single-line density="compact" style="width: 95%; margin: 10px auto; border-radius: 5px;"></v-text-field>
			<v-data-table :headers="headers" :items="users" :items-per-page="5" :search="search" density="compact"
				item-key="uid">
				<template v-slot:item.actions="{ item }">
					<v-icon @click="deleteUser(item)">mdi-delete</v-icon>
				</template>
			</v-data-table>
		</v-card>
		<br><br>
		<!-- FAQ List -->
		<v-card style="padding: 20px ;">
			<h3>{{ $t("adminPage.faqListTitle") }}</h3>
			<v-text-field v-model="faqSearch" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
				single-line density="compact" style="width: 95%; margin: 10px auto; border-radius: 5px;"></v-text-field>
			<v-data-table :headers="faqHeaders" :items="faqs" :items-per-page="5" :search="faqSearch" density="compact"
				item-key="id">
				<template v-slot:item.actions="{ item }">
					<v-icon @click="editFaq(item)">mdi-pencil</v-icon>
					<v-icon @click="deleteFaq(item)">mdi-delete</v-icon>
				</template>
			</v-data-table>
			<v-btn color="primary" @click="openFaqDialog">Add FAQ</v-btn>
		</v-card>

		<v-dialog v-model="faqDialog" max-width="500px">
			<v-card class="mb-4">
				<v-card-title>
					<span class=" headline">{{ faqDialogTitle }}</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<v-text-field v-model="localFaqData.question" label="Question"></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field v-model="localFaqData.answer" label="Answer"></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="btn-red" text @click="closeFaqDialog">Cancel</v-btn>
					<v-btn class="btn-primary" text @click="saveFaq">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>

	<v-dialog v-model="dialog" max-width="500px">
		<v-card>
			<v-card-title>
				<span class="headline">Edit User</span>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols="12">
							<v-text-field v-model="localEditData.displayName" label="Name"></v-text-field>
						</v-col>
						<v-col cols="12">
							<v-text-field v-model="localEditData.email" label="Email"></v-text-field>
						</v-col>
						<v-col cols="12">
							<v-text-field v-model="localEditData.study" label="Study"></v-text-field>
						</v-col>
						<v-col cols="12">
							<v-text-field v-model="localEditData.specialization" label="Specialization"></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
				<v-btn color="blue darken-1" text @click="saveProfile">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { db } from "../../js/firebaseConfig";
import { ref as dbRef, get, set, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
	data() {
		return {
			headers: [
				{ title: 'User Id', value: 'uid', width: '20%' },
				{ title: 'Name', value: 'displayName', width: '30%' },
				{ title: 'Email', value: 'email', width: '20%' },
				{ title: '', value: 'actions', sortable: false, width: '5%' },
			],
			users: [],
			faqs: [],
			search: '',
			userData: null,
			localEditData: {},
			loading: true,
			dialog: false,
			faqDialog: false,
			faqDialogTitle: '',
			localFaqData: {},
			faqHeaders: [
				{ title: 'Question', value: 'question' },
				{ title: 'Answer', value: 'answer' },
				{ title: 'Actions', value: 'actions', sortable: false },
			],
			faqSearch: '',
		};
	},
	methods: {
		async loadUserData() {
			const userRef = dbRef(db, "users");
			const userSnapshot = await get(userRef);
			if (userSnapshot.exists()) {
				const usersData = userSnapshot.val();
				this.users = Object.keys(usersData).map(uid => ({ uid, ...usersData[uid] }));
			}
		},
		async deleteUser(user) {
			if (confirm(`Are you sure you want to delete ${user.displayName}?`)) {
				try {
					await set(dbRef(db, `users/${user.uid}`), null);
					this.loadUserData();
				} catch (error) {
					console.error("Error deleting user: ", error);
				}
			}
		},
		editUser(user) {
			this.localEditData = { ...user };
			this.dialog = true;
		},
		closeDialog() {
			this.dialog = false;
		},
		async saveProfile() {
			if (this.localEditData.uid) {
				try {
					await update(dbRef(db, `users/${this.localEditData.uid}`), {
						displayName: this.localEditData.displayName,
						email: this.localEditData.email,
						study: this.localEditData.study,
						specialization: this.localEditData.specialization,
					});
					this.loadUserData();
					this.closeDialog();
				} catch (error) {
					console.error("Error updating profile: ", error);
				}
			}
		},
		onAuthStateChanged() {
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				if (user) {
					this.userData = user;
					this.loadUserData();
					this.loadFAQData();
				} else {
					this.userData = null;
					this.users = [];
					try {
						this.$router.push("/");
					} catch (error) {
						console.error("Navigation error: ", error);
					}
				}
			});
		},
		async loadFAQData() {
			try {
				const faqRef = dbRef(db, "faq");
				const faqSnapshot = await get(faqRef);
				if (faqSnapshot.exists()) {
					const faqData = faqSnapshot.val();
					// Map data into an array of FAQs with id, question, and answer
					this.faqs = Object.entries(faqData).map(([id, faq]) => ({
						id,
						question: faq.question,
						answer: faq.answer,
					}));
				} else {
					this.faqs = []; // If no data exists, set an empty array
				}
			} catch (error) {
				console.error("Error loading FAQ data:", error);
			}
		},
		async deleteFaq(faq) {
			if (confirm(`Are you sure you want to delete the FAQ "${faq.question}"?`)) {
				try {
					const faqRef = dbRef(db, `faq/${faq.id}`);
					await set(faqRef, null); // Delete the FAQ
					this.loadFAQData(); // Reload FAQs after deletion
				} catch (error) {
					console.error("Error deleting FAQ:", error);
				}
			}
		},
		editFaq(faq) {
			this.localFaqData = { ...faq }; // Copy FAQ data into localFaqData
			this.faqDialogTitle = "Edit FAQ";
			this.faqDialog = true; // Open the dialog
		},
		async saveFaq() {
			try {
				const faqRef = dbRef(db, `faq/${this.localFaqData.id || Date.now()}`); // Use id if exists, otherwise generate one
				await set(faqRef, {
					question: this.localFaqData.question,
					answer: this.localFaqData.answer,
				});
				this.loadFAQData(); // Reload FAQ data after saving
				this.closeFaqDialog(); // Close the dialog
			} catch (error) {
				console.error("Error saving FAQ:", error);
			}
		},
		openFaqDialog() {
			this.localFaqData = { question: '', answer: '' }; // Reset to empty data
			this.faqDialogTitle = "Add FAQ";
			this.faqDialog = true;
		},
		closeFaqDialog() {
			this.faqDialog = false;
		},
	},
	mounted() {
		this.onAuthStateChanged();
	},
};
</script>

<style scoped>
#saveBtn {
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
	border: none;
	font-size: 14px !important;
	margin: 10px;
	background-color: var(--second-color);
	color: var(--fifth-color);
}

#closeBtn {
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
	border: none;
	font-size: 14px !important;
	margin: 10px;
	background-color: #e53935;
	color: var(--fifth-color);
}

#closeBtn:hover {
	background-color: #d32f2f;
	color: var(--fifth-color);
}

.account-card {
	margin-bottom: 20px;
}

.user-avatar {
	margin-bottom: 20px;
}

.account_info strong {
	font-size: 16px;
}

.account_info span {
	margin-left: 5px;
	font-size: 16px;
}

@media (max-width: 768px) {
	.account-card {
		padding: 10px;
	}

	.user-avatar {
		margin: 0 auto 20px;
	}

	.account_info span {
		font-size: 4vw;
		margin-left: 0;
	}

	.account_info span::after {
		content: "\A";
		white-space: pre;
	}

	.account_info strong {
		font-size: 4.2vw;
	}

	.account_info strong::after {
		content: "\A";
		white-space: pre;
	}

	#closeBtn,
	#saveBtn {
		margin: auto;
		width: 40% !important;
	}

	.v-btn {
		margin: auto;
		font-size: 14px !important;
		width: 50% !important;
	}
}
</style>