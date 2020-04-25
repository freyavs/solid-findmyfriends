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
    currentLocation: null,
    popupUri: "https://solid.github.io/solid-auth-client/dist/popup.html",
    webId: "",
    name: "",
    store: store,
    fetcher: fetcher,
    friends: [],
		friendnames: []
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
      state.sharingLocation = true
    },
    LOCATION_OFF(state) {
      state.sharingLocation = false
			state.currentLocation = null
    },
    SET_LOCATION(state,location){
      state.currentLocation = location
    },
    SET_NAME(state, name) {
      state.name = name
    },
    ADD_FRIEND(state, friend){
      state.friends.push(friend) 
    },
		ADD_FRIEND_NAME(state, name){
			state.friendnames.push(name)
		}
  },
  actions: {
		login({ commit, dispatch }, webId) {
      commit("LOGIN", webId)
			dispatch('fetchStore')
				.then( () => {
					dispatch('resolveName')
					dispatch('resolveFriends')
				})
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
		fetchStore({ state }){
			return state.fetcher.load(state.webId)
		},
		resolveName({ commit, state }){
      const fullName = state.store.any($rdf.sym(state.webId), FOAF("name"));
      commit("SET_NAME", fullName.value);
    },
    resolveFriends({commit, state}){
      const person = state.webId;
      const friends = state.store.each($rdf.sym(person), FOAF("knows"));
      friends.forEach( (friend) => {
				state.fetcher.load(friend).then(() => {
          commit("ADD_FRIEND", friend)
					commit("ADD_FRIEND_NAME", state.store.any(friend, FOAF('name')).value)
        })
      })
    },
    locationSharingOn({commit}) {
      commit("LOCATION_ON")
    },
    locationSharingOff({commit}) {
      commit("LOCATION_OFF")
    },
    fetchLocation({commit}){
      if(!("geolocation" in navigator)) {
        console.log("Geolocation is not available")
        return;
      }

      navigator.geolocation.getCurrentPosition(pos => {
        commit('SET_LOCATION', pos)
      }, err => {
        console.log(err.message)
      })
    }
  },
  modules: {},
});
