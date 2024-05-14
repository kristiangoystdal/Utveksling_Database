<template>
	<div>
		<NavBar @navClick="setActiveContent" />
		<div class="content">
			<component :is="activeComponent"></component>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, markRaw } from "vue";
import { useStore } from "vuex";
import NavBar from "./NavBar.vue";
import Home from "./windows/Home.vue";
import Programs from "./windows/Programs.vue";
import About from "./windows/About.vue";
import Contact from "./windows/Contact.vue";
import Account from "./windows/Account.vue";
import Login from "./windows/Login.vue";

const store = useStore();
const activeComponent = ref(markRaw(Home));

const componentsMap = {
	Home: markRaw(Home),
	Programs: markRaw(Programs),
	About: markRaw(About),
	Contact: markRaw(Contact),
	Account: markRaw(Account),
	Login: markRaw(Login),
};

function setActiveContent(componentName) {
	if (componentsMap[componentName]) {
		activeComponent.value = componentsMap[componentName];
	}
}

const isAuthenticated = computed(() => store.getters.isAuthenticated);

watch(isAuthenticated, (newValue) => {
	if (newValue) {
		activeComponent.value = componentsMap["Account"];
	} else {
		activeComponent.value = componentsMap["Login"];
	}
});

if (isAuthenticated.value) {
	activeComponent.value = componentsMap["Account"];
} else {
	activeComponent.value = componentsMap["Login"];
}
</script>

<style scoped>
.content {
	margin-top: 1rem;
	padding: 1rem;
	border: 1px solid #ddd;
}
</style>
