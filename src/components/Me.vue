<template>
  <div v-if="loggedIn">
    <h3 v-if="loggedIn">{{ name }}</h3>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["name", "loggedIn"])
};
</script>

<style scoped></style>
