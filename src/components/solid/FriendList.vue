<template>
	<div class="anim" >
		<div class="addfriendcontainer" v-if="loggedIn">
			<input v-model="friendurl" placeholder="Add a friend with solidurl..."/>
			<button v-on:click="addFriend">Add</button>
		</div>
		<div class="scrollable">
			<FriendCard v-for="friend in friends" :key="friend.webId.toString()" :friendId="friend.webId" :isSharing="friend.sharing"/> 
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import FriendCard from '@/components/FriendCard.vue'

export default {
	components: {
		FriendCard
	},
	computed: mapState({
		loggedIn: state => state.loggedIn,
		friends: state => state.friends.friends,
		friendsView: state => state.friends.friendsView
	}),
	data() {
		return {
			friendurl: null,
		}
	},
	methods: {
		async addFriend(){
			let success = await this.$store.dispatch('addFriend', this.friendurl)
			if (success){
				this.friendurl = null 
			}
			else {
				alert("Incorrect friend url, please try again.")
			}
		}
	},
}
</script>

<style scoped>
button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
	margin: 10px 10px 10px 5px;
}
input{
	width: 100%;
	height: 30px;
	border-radius: 12px;
	border: none;
	padding: 0 8px 0 8px;
	margin: 10px 5px 10px 5px;
}
.scrollable {
	height: 100%;
  -webkit-overflow-scrolling: touch;
	overflow-y: auto;
}

.addfriendcontainer {
	display: flex;
	align-items: center;
}
</style>
