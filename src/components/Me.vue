<template>
  <div>
    <h3 v-if="loggedIn">{{ name }}</h3>
    <ToggleButton v-if="loggedIn"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ToggleButton from '@/components/ToggleButton.vue';

export default {
  components:{
    ToggleButton
  },
  computed: mapState(["name", "loggedIn"])
};
</script>

<style scoped></style>
