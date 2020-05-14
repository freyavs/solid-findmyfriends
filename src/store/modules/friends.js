import Vue from 'vue'
import tools from '../../lib/tools'

const auth = require('solid-auth-client')
const {default: data} = require('@solid/query-ldflex')

const foaf = "http://xmlns.com/foaf/0.1/"

export const state = {
	friends: [],
	friendsView: true
}

export const mutations = {
	ADD_FRIEND(state, friend) {
		//save id and location file of friend (if they have one)
		Vue.set(state.friends, state.friends.length, {webId: friend.id, sharing: false, locationFile: friend.file})
	},
	SWITCH_FRIENDS_VIEW(state) {
		state.friendsView = !state.friendsView
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
			let file = await tools.getLocationFile(webid.toString())
			commit("ADD_FRIEND", {id: webid, file: file})
		}
	},
	async fetchFriendsPermissions(){
		console.log('fetch perm')
	}
}
