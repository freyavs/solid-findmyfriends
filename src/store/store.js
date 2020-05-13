import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'
import * as friends from '@/store/modules/friends.js'
import tools from '../lib/tools'
import * as requests from '@/store/modules/requests.js'

Vue.use(Vuex);

const auth = require('solid-auth-client')
const FC	 = require('solid-file-client')
const fc	 = new FC( auth )

const {default: data} = require('@solid/query-ldflex')

const N3 = require('n3');

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
			commit("LOGIN", webId)
			dispatch("fetchFriends")
			dispatch("fetchRequests")
		},
		logout({ commit }) {
			commit("LOGOUT");
		},
		async setLocationFile({state, commit, dispatch}) {
			const locationFile = await tools.setLocationFile(state.webId)
			commit("SET_LOCATION_FILE", locationFile)
			dispatch("fetchFriendsPermissions")
		},
		async createLocationFile({state, commit}){
			//verkrijg publicTypeIndex			
			const person = data[state.webId]
			const registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
			//verkrijg podroot
			const podRoot = state.webId.replace(/\/profile.*/, '/')
			
			//maak locationfile aan
			fc.createFile(podRoot + "public/location.ttl", "", "text/turtle")
				.then(() => {
					//update de publicTypeIndex met de nieuwe file
					const query = `
					INSERT DATA{
						@prefix solid: <http://www.w3.org/ns/solid/terms#>.
						@prefix wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>.
						<findmyfriendslocation> a solid:TypeRegistration;
							solid:forClass wgs:Point;
							solid:instance </public/location.ttl>.	
					}
					`
					auth.fetch(registry, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/sparql-update' },
						body: query,
						credentials: 'include',
					})
						.then(() => commit("SET_LOCATION_FILE", podRoot + "public/location.ttl"))
						.catch(error => {
						console.log("Failed to update publicTypeIndex")
						console.log(error)	
						})
				})
				.catch(error => {
					console.log("Failed to create location file")
					console.log(error)
				})
    }
	},
	modules: {
		location,
		friends, 
		requests
	},
});
