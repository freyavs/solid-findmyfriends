<template>
  <div>
    <h3 v-if="loggedIn">{{ name }}</h3>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    name: "name",
    loggedIn: "loggedIn",
  })
};
</script>

<style scoped></style>
