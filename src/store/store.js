import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'
import * as friends from '@/store/modules/friends.js'
import tools from '../lib/tools'
import * as requests from '@/store/modules/requests.js'

Vue.use(Vuex);


export default new Vuex.Store({
	state: {
		loggedIn: false,
		webId: "",
		locationFile: "",
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
		SET_LOCATION_FILE(state, file){
			state.locationFile = file;
		},
	},
	actions: {
		login({ commit, dispatch }, webId) {
			commit('LOGIN', webId)
			dispatch('fetchFriends')
      dispatch('setLocationFile')
			dispatch('fetchRequests')
		},
		logout({ commit }) {
			commit('LOGOUT');
		},
		async setLocationFile({state, commit, dispatch}) {
			const locationFile = await tools.setLocationFile(state.webId)
			commit('SET_LOCATION_FILE', locationFile)
			dispatch('fetchFriendsPermissions')
		}
	},
	modules: {
		location,
		friends, 
		requests
	},
});
