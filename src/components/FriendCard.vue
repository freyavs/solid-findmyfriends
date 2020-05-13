<template>
	<div class="card">
		<ProfileImage :src="friendId"/>
		<Name :src="friendId"/>
		<button v-on:click="switchPermissionStatus">{{ action }}</button>
		<button v-on:click="requestLocation">request location</button>
	</div>
</template>

<script>
import Name from '@/components/solid/Name.vue';
import ProfileImage from '@/components/solid/ProfileImage.vue';
import permissions from '../lib/solid-permissions.js'

import { mapState } from 'vuex'


export default {
	props: ['friendId'],
  components: {
    Name,
    ProfileImage
  },
	data() {
		return {
			sharing: false
		}
	},
	computed: {
		action(){
			if(this.sharing){
				return "block"
			}else{
				return "share"
			}
		},
		...mapState(["locationFile"])
	},
	methods: {
		switchPermissionStatus(){
			if (!this.sharing){
				console.log("give perimission to: " + this.friendId)
				permissions.givePermission(this.locationFile, this.friendId)
			} else {
				console.log("revoke perimission to: " + this.friendId)
				permissions.revokePermission(this.locationFile, this.friendId)
			}
			this.sharing = !this.sharing
		},
		requestLocation(){
			this.$store.dispatch('requestLocation', this.friendId)
		}
	},
}
</script>

<style scoped>
.card {
	height: 80px;

	display: flex;
	align-items: center;
}

button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
	margin: 10px 10px 10px 5px;
}
</style>
