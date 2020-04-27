import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'

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
					dispatch('resolveFriends')
				})
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
		fetchStore({ state }){
			return fetcher.load(state.webId)
		},
    resolveFriends({commit, state}){
      const person = state.webId;
      const friends = store.each($rdf.sym(person), FOAF("knows"));
      friends.forEach( (friend) => {
				fetcher.load(friend).then(() => {
          commit("ADD_FRIEND", friend)
					commit("ADD_FRIEND_NAME", store.any(friend, FOAF('name')).value)
        })
      })
    }
  },
  modules: {
		location
	},
});
