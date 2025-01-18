<template>
	<div>
		<h2>{{ $t("adminPage.pageHeader") }}:</h2>
	</div>
	<br />
	<v-container>
		<template v-slot:text>
			<v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
				single-line></v-text-field>
		</template>
		<v-data-table :headers="headers" :items="users" :items-per-page="5" :search="search" density="compact"
			item-key="name">
			<template v-slot:item.actions="{ item }">
				<v-icon @click="deleteUser(item)">mdi-delete</v-icon>
			</template>
		</v-data-table>
	</v-container>

</template>

<script>
import { db } from "../../js/firebaseConfig";
import { ref as dbRef, get, set, update } from "firebase/database";

export default {
	data() {
		return {
			studies: {},
			headers: [
				{ text: 'User Id', value: 'uid', width: '20%' },
				{ text: 'Name', value: 'displayName', width: '30%' },
				{ text: 'Email', value: 'email', width: '20%' },
				{ text: 'Actions', value: 'actions', sortable: false, width: '5%' },
			],
			users: [],
			search: '',
			userData: null,
			loading: true,
			dialog: false,
		};
	},
	computed: {

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
		async editUser(user) {
			this.userData = user;
			this.dialog = true;
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
		}

	},
	mounted() {
		// Fetch studies file
		this.loadUserData();
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
	/* Soft Red */
	color: var(--fifth-color);
}

#closeBtn:hover {
	background-color: #d32f2f;
	/* Darker Soft Red */
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
		/* Adds a double line break */
		white-space: pre;
		/* Preserves the line breaks */
	}

	.account_info strong {
		font-size: 4.2vw;
	}

	.account_info strong::after {
		content: "\A";
		/* Adds a line break */
		white-space: pre;
		/* Preserves the line break */
	}

	#closeBtn,
	#saveBtn {
		margin: auto;
		font-size: 14px !important;
		width: 40% !important;
	}

	.v-btn {
		margin: auto;
		font-size: 14px !important;
		width: 50% !important;
	}
}
</style>