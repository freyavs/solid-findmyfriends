<template>
  <div>
		<button v-on:click="getName">get</button>
    <h3 v-if="!loggedIn">{{ namer }}</h3>
    <h3 v-else>{{ name }}</h3>
    <h3>{{ webId }}</h3>
  </div>
</template>

<script>
import { mapState } from "vuex";
const $rdf = require('rdflib')

export default {
  computed: mapState({
    namer: "name",
    loggedIn: "loggedIn",
    webId: "webId",
  }),
  data() {
    return {
      name: "",
    };
  },
  methods: {
    getName: function() {
			console.log('get')
      // Set up a local data store and associated data fetcher
      const store = $rdf.graph();
      const fetcher = new $rdf.Fetcher(store);

      // Load the person's data into the store
      const person = this.webId;
      fetcher.load(person).then(() => {
				const FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
        // Display their details
        const fullName = store.any($rdf.sym(person), FOAF("name"));
				this.name = fullName.value
      });
    },
  },
};
</script>

<style scoped></style>
