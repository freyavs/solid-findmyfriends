<template>
  <div v-if="loggedIn">
    <h3 v-if="loggedIn">{{ name }}</h3>
    <Value :src="webId"/>
    <ToggleButton/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ToggleButton from '@/components/ToggleButton.vue';
import Value from '@/components/ldflex/Value.vue';

export default {
  components:{
    ToggleButton,
    Value
  },
  computed: mapState(["webId", "name", "loggedIn"])
};
</script>

<style scoped></style>
