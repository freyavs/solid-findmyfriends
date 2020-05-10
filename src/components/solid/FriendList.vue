<template>
	<div>
		<div class="addfriendcontainer">
			<input v-model="friendurl" placeholder="Add a friend..."/>
			<button v-on:click="addFriend">Add</button>
		</div>
		<div class="scrollable" :key="componentKey">
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
			friendurl: "",
			componentKey: 0,
			reload: true
		}
	},
	methods: {
	forceRerender() {
      this.componentKey += 1
    },
	async addFriend(){
		console.log("add friend: " + this.friendurl)
		let success = await this.$store.dispatch('addFriend', this.friendurl)
		this.friendurl = ''
		if (success){
			setTimeout(() => this.forceRerender(), 10000);
			console.log("adding friend: success")
		}
		else {
			alert("Incorrect friend url, please try again.")
		}
	}
	},
	asyncComputed: {
		async friends(){
			console.log(this.componentKey)
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
