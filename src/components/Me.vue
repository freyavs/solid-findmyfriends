<template>
  <div v-if="loggedIn">
    <h3 v-if="loggedIn">{{ name }}</h3>
    <ToggleButton/>
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
