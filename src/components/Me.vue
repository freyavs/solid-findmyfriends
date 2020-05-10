<template>
	<div> 
			<div v-if="loggedIn">	
				<ProfileImage :src="webId"/>
			</div>
			<div class="container" v-if="loggedIn">
				<Name :src="webId"/>
				<ToggleButton/>
			</div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import ToggleButton from '@/components/ToggleButton.vue'
import Name from '@/components/solid/Name.vue'
import ProfileImage from '@/components/solid/ProfileImage.vue'

export default {
  components:{
    ToggleButton,
    Name,
    ProfileImage
  },
  computed: mapState(["webId", "loggedIn"])
};
</script>

<style scoped>
.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
