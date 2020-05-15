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
	props: ['friendId', 'isSharing'],
	components: {
		Name,
		ProfileImage
	},
	data() {
		return {
			sharing: this.isSharing
		}
	},
	computed: {
		action(){
			if(this.sharing){
				return "block"
			}else{
				return "allow"
			}
		},
		...mapState({
			locationFile: state => state.locationFile,
			friends: state => state.friends.friends
		})
	},
	methods: {
		switchPermissionStatus(){
			if (!this.sharing){
				permissions.givePermission(this.locationFile, this.friendId)
			} else {
				permissions.revokePermission(this.locationFile, this.friendId)
			}
			this.sharing = !this.sharing
			this.$store.dispatch("updateFriend", {webId: this.friendId, sharing: this.sharing})
		},
		requestLocation(){
			this.$store.dispatch('requestLocation', this.friendId)
		}
	},
	watch: {
		friends: function() {
			this.friends.forEach(friend => {
				if (friend.webId.toString() === this.friendId.toString()) {
					this.sharing = friend.sharing
				}
			})
		}
	}
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
