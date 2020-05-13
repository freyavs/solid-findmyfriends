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
	ADD_FRIEND(state, friendWebId) {
		Vue.set(state.friends, state.friends.length, {webId: friendWebId, sharing: false})
	},
	SWITCH_FRIENDS_VIEW(state) {
		state.friendsView = !state.friendsView
	},
	UPDATE_FRIEND_SHARE_STATUS(state, update){
		state.friends.forEach((friend, index) => {
			console.log(index)
			if (friend.webId.toString() === update.friendId) {
				console.log("update")
				Vue.set(state.friends, index, {webId: friend.webId, sharing: update.sharing})
			}
		})
	},
}

export const actions = {
	switchFriendsView({ commit }) {
		commit("SWITCH_FRIENDS_VIEW")
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
	async fetchFriends({ commit, rootState }){
		let person = data[rootState.webId]
		for await (const webid of person.friends) {
			commit("ADD_FRIEND", webid)
		}
	},
	async fetchFriendsPermissions({ commit, rootState }){
		const friendsWithPermission = await permissions.getFriendsWithAcces(rootState.locationFile)
		friendsWithPermission.forEach(friendId => {
			commit('UPDATE_FRIEND_SHARE_STATUS', { friendId, sharing: true })
		})
	}
}
