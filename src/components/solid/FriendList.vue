<template>
	<div>
		<div class="addfriendcontainer">
			<input v-model="friendurl" placeholder="Add a friend with solidurl..."/>
			<button v-on:click="addFriend">Add</button>
		</div>
		<div class="scrollable">
			<FriendCard v-for="friend in friends" :key="friend" :friendId="friend"/> 
		</div>
	</div>
</template>

<script>
import FriendCard from '@/components/FriendCard.vue'

const {default: data} = require('@solid/query-ldflex')

export default {
	components: {
		FriendCard
	},
  props: (['src']),
	data() {
		return {
			friendurl: '' 
		}
	},
	methods: {
		addFriend(){
			console.log("add friend: " + this.friendurl)
			this.friendurl = ''
		}
	},
	asyncComputed: {
		async friends(){
			let person = data[this.src]
			let friends = []
			for await (const webid of person.friends) {
				friends.push(webid.toString())
			}
			return friends
		}
	}  
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
</style>
