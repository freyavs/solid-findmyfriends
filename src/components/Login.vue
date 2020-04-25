<template>
	<div>
		<button v-if="!loggedIn" v-on:click="login">Login</button>
		<button v-else v-on:click="logout">Logout</button>
	</div>
</template>

<script>
import { mapState } from 'vuex'
const auth = require('solid-auth-client')

export default {
	computed:  mapState(['loggedIn','popupUri','webId']),
	methods: {
		login: function() {
			let popupUri = this.popupUri
			auth.popupLogin({ popupUri })		
		},
		logout: function() {
			auth.logout()
		}
	}
}
</script>

<style scoped>
button {
	padding: 5px;
	margin: 5px;
	margin-right: 25px;
	border-radius: 8px;
	border: none;
	width: 80px;
	height: 30px;
}
</style>
