<template>
	<div>
		<button v-if="!loggedIn" v-on:click="login">Login</button>
		<button v-else v-on:click="logout">Logout</button>
	</div>
</template>

<script>
const auth = require('solid-auth-client')

export default {
	data() {
		return {
			loggedIn: false,
			popupUri : 'https://solid.github.io/solid-auth-client/dist/popup.html'
		}
	},	
	methods: {
		login: function() {
			let popupUri = this.popupUri
			auth.popupLogin({ popupUri })		
		},
		logout: function() {
			auth.logout()
		}
	},
	created(){
		let vm = this
		auth.trackSession(session => {
			if(!session){
				console.log('not logged in')	
				vm.loggedIn = false
				vm.webId = ""
			}else{
				console.log('logged in ')	
				vm.loggedIn = true
				vm.webId = session.webId
			}
		})
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
