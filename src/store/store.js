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
    sharingLocation: false,
    popupUri: "https://solid.github.io/solid-auth-client/dist/popup.html",
    webId: "",
    name: "",
    store: store,
    fetcher: fetcher,
    friends: []
  },
  mutations: {
    LOGIN(state, webId) {
      state.loggedIn = true;
      state.webId = webId;
    },
    LOGOUT(state) {
      state.loggedIn = false;
      state.webId = "";
      state.friends = []
    },
    LOCATION_ON(state) {
      state.sharingLocation = true;
    },
    LOCATION_OFF(state) {
      state.sharingLocation = false;
    },
    SET_NAME(state, name) {
      state.name = name;
    },
    ADD_FRIEND(state, friend){
      state.friends.push(friend) 
    }
  },
  actions: {
    login({ commit, dispatch }, webId) {
      commit("LOGIN", webId)
      dispatch('resolveName')
      dispatch('resolveFriends')
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    locationSharingOn({commit}) {
      commit("LOCATION_ON")
    },
    locationSharingOff({commit}) {
      commit("LOCATION_OFF")
    },
		fetchStore({ state }){
			return state.fetcher.load(state.webId)
		},
		resolveName({ commit, state }){
      const person = state.webId;
      state.fetcher.load(person).then(() => {
        const fullName = state.store.any($rdf.sym(person), FOAF("name"));
        commit("SET_NAME", fullName.value);
      });
    },
    resolveFriends({commit, state}){
      console.log("fetching friends")
      const person = "https://ruben.verborgh.org/profile/#me";
      const friends = state.store.each($rdf.sym(person), FOAF("knows"));
      console.log(friends)
      friends.forEach( (friend) => {
        console.log(friend)
        state.fetcher.load(friend).then(() => {
          const fullName = state.store.any(friend, FOAF('name'))
          commit("ADD_FRIEND", fullName.value)
        })
      })
    }
  },
  modules: {},
});
