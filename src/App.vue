<template>
  <div id="app">
    <app-nav />
    <router-view />
  </div>
</template>

<script>
import AppNav from "./components/AppNav";
const auth = require('solid-auth-client')

export default {
  components: { 
		AppNav 
	},
	created(){
		auth.trackSession(session => {
			if(!session){
				this.$store.dispatch('logout')
			}else{
				this.$store.dispatch('login', session.webId)
			}
		})
	}
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0px;
}
#app {
  font-family: "Lato", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
