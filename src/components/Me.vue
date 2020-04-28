<template>
	<div> 
    <ProfileImage :src="webId"/>
    <Name :src="webId"/>
    <ToggleButton/>
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
  computed: mapState(["webId", "loggedIn"])
};
</script>

<style scoped></style>
