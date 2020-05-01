<template>
	<div id="nav">
		<h3 class="navtitle">FindMyFriends</h3>
		<Login/>	
	</div>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
	components: {
		Login
	}
}
</script>

<style scoped>
#nav {
  display: flex;
	flex-direction: row;
	align-items: center;
  justify-content: space-between;
  min-height: 50px;
  background-color: #1a0841;
  background-color: #4f9da6;
}
.navtitle {
	margin: 10px;
	color: white;
}
</style>
