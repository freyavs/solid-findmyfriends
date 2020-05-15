<template>
	<div> 
			<div v-if="loggedIn">	
				<ProfileImage :src="webId"/>
			</div>
			<div class="container" v-if="loggedIn">
        <h3>{{ name }}</h3>
				<ToggleButton/>
				<button v-on:click="changeView">{{ viewSwitchButtonText }}</button>
			</div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import ToggleButton from '@/components/ToggleButton.vue'
import ProfileImage from '@/components/solid/ProfileImage.vue'

export default {
  components:{
    ToggleButton,
    ProfileImage
  },
	computed: {
		viewSwitchButtonText(){
			if (this.friendsView) {
				return "requests"
			} else {
				return "friends"
			}
		},
		...mapState({
			webId: state => state.webId,
			name: state => state.name,
			loggedIn: state => state.loggedIn,
			friendsView: state => state.friends.friendsView})
	},
  methods: {
		changeView(){
			this.$store.dispatch('switchFriendsView')
		}
	}
};
</script>

<style scoped>
button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
	margin: 10px 10px 10px 5px;
	float: right;
}

.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
