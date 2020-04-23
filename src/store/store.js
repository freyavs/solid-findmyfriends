import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const $rdf = require("rdflib");
const FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    popupUri: "https://solid.github.io/solid-auth-client/dist/popup.html",
    webId: "",
    name: "",
    store: store,
    fetcher: fetcher,
  },
  mutations: {
    LOGIN(state, webId) {
      state.loggedIn = true;
      state.webId = webId;
    },
    LOGOUT(state) {
      state.loggedIn = false;
      state.webId = "";
    },
    SET_NAME(state, name) {
      state.name = name;
    },
  },
  actions: {
    login({ commit, dispatch }, webId) {
      commit("LOGIN", webId)
			dispatch('resolveName')
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
		resolveName({ commit, state }){
      const person = state.webId;
      state.store.fetcher.load(person).then(() => {
        const fullName = state.store.any($rdf.sym(person), FOAF("name"));
        commit("SET_NAME", fullName.value);
      });
		}
  },
  modules: {},
});
