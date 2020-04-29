<template>
	<div>
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
.scrollable {
	height: 100%;
  -webkit-overflow-scrolling: touch;

	overflow-y: auto;
}
</style>
