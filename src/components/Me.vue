<template>
	<div> 
			<div v-if="loggedIn">	
				<ProfileImage :src="webId"/>
			</div>
			<div class="container" v-if="loggedIn">
				<Name :src="webId"/>
				<ToggleButton/>
				<div  v-on:click="changeView">
					<button v-if="friendsView">requests</button>
					<button v-else>friends</button>
				</div>
			</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ToggleButton from '@/components/ToggleButton.vue';
import Name from '@/components/solid/Name.vue';
import ProfileImage from '@/components/solid/ProfileImage.vue';

export default {
  components:{
    ToggleButton,
    Name,
    ProfileImage
  },
  computed: mapState(["webId", "loggedIn", "friendsView"]),
  methods: {
	changeView(){
		if (!this.friendsView){
			this.$store.dispatch('seeRequests')
		}
		else {
			this.$store.dispatch('seeFriends')
		}
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
