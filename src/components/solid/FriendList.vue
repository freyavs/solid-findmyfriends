<template>
	<div>
		<transition name="switch" mode="out-in">
			<div class="anim" v-if="friendsView" key="1">
				<div class="addfriendcontainer">
					<input v-model="friendurl" placeholder="Add a friend with solidurl..."/>
					<button v-on:click="addFriend">Add</button>
				</div>
				<div class="scrollable">
					<FriendCard v-for="friend in friends" :key="friend.webId.toString()" :friendId="friend.webId"/> 
				</div>
			</div>
			<div v-else key="2">
				<h1>Hey</h1>
			</div>
		</transition>
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
				console.log("Friend add succes")
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
.addfriendcontainer {
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
.switch-enter, .switch-leave-to {
	opacity: 0;
	transform: translateX(-100px);
}
.switch-enter-active, .switch-leave-active {
	transition: all 0.6s ;
}
.anim{
	height: 100%;
}
</style>
