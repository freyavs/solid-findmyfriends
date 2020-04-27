<template>
  <div v-if="loggedIn">
    <Name :src="webId"/>
    <ToggleButton/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ToggleButton from '@/components/ToggleButton.vue';
import Name from '@/components/solid/Name.vue';

export default {
  components:{
    ToggleButton,
    Name
  },
  computed: mapState(["webId", "loggedIn"])
};
</script>

<style scoped></style>
