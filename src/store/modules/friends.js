import Vue from 'vue'
import tools from '../../lib/tools' 
import permissions from '../../lib/solid-permissions'
const auth = require('solid-auth-client')
const {default: data} = require('@solid/query-ldflex')

const foaf = "http://xmlns.com/foaf/0.1/"

export const state = {
	friends: [],
	friendsView: true
}

export const mutations = {
	ADD_FRIEND(state, webId) {
		Vue.set(state.friends, state.friends.length, {webId, sharing: false, locationFile: null})
	},
	SWITCH_FRIENDS_VIEW(state) {
		state.friendsView = !state.friendsView
	},
	UPDATE_FRIEND_SHARE_STATUS(state, update){
		state.friends.forEach((friend, index) => {
			if (friend.webId.toString() === update.webId.toString()) {
				Vue.set(state.friends, index, {webId: friend.webId, sharing: update.sharing, locationFile: friend.locationFile})
			}
		})
	},
	UPDATE_FRIEND_LOCATIONFILE(state, update){
		state.friends.forEach((friend, index) => {
			if (friend.webId.toString() === update.webId.toString()) {
				Vue.set(state.friends, index, {webId: friend.webId, sharing: friend.sharing, locationFile: update.locationFile})
			}
		})
	},
	LOGOUT(state) {
		state.friends = []
		state.friendsView = true
	}
}

export const actions = {
	switchFriendsView({ commit }) {
		commit("SWITCH_FRIENDS_VIEW")
	},
	updateFriend({ commit }, friend){
		commit("UPDATE_FRIEND_SHARE_STATUS", friend)
	},
	async addFriend({ rootState, commit }, friendWebId){
		if (tools.escape(friendWebId) === ""){
			return false
		}

		const query = `
			INSERT DATA{
				<${tools.escape(rootState.webId)}> <${foaf}knows> <${tools.escape(friendWebId)}>
			}
			`
		// Send a PATCH request to update the source
		let response = await auth.fetch(rootState.webId, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/sparql-update' },
			body: query,
			credentials: 'include',
		});
		
		if (response.status === 200) {
			commit("ADD_FRIEND", friendWebId)
		}
		return response.status === 200
	},
	async fetchFriends({ commit, rootState, dispatch }){
		let person = data[rootState.webId]
		for await (const webId of person.friends) {
			commit("ADD_FRIEND", webId)
		}
		dispatch('fetchFriendsLocationFiles')
		dispatch('setLocationFile')
	},
	async fetchFriendsLocationFiles({ commit, state }){
		state.friends.forEach(friend => {
			tools.getLocationFile(friend.webId.toString()).then(file => {
				commit("UPDATE_FRIEND_LOCATIONFILE", {webId: friend.webId, locationFile: file})
			})
		})
	},
	async fetchFriendsPermissions({ commit, rootState }){
		const friendsWithPermission = await permissions.getFriendsWithAcces(rootState.locationFile)
		friendsWithPermission.forEach(webId => {
			commit('UPDATE_FRIEND_SHARE_STATUS', { webId, sharing: true })
		})
	},
	logout({ commit }){
		commit('LOGOUT')
	}
}
