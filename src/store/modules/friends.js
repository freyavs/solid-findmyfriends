import Vue from 'vue'
import tools from '../tools'

const auth = require('solid-auth-client')
const {default: data} = require('@solid/query-ldflex')

const foaf = "http://xmlns.com/foaf/0.1/"

//const SolidAclUtils = require('solid-acl-utils')
//const { AclApi, AclDoc, AclParser, AclRule, Permissions, Agents } = SolidAclUtils
//const { READ, WRITE, APPEND, CONTROL } = Permissions
//const AclApi = SolidAclUtils.AclApi
//const Permissions = SolidAclUtils.Permissions
//const READ = Permissions.READ
//const CONTROL = Permissions.CONTROL


//				const fetch = auth.fetch.bind(auth)
//				const aclApi = new AclApi(fetch, { autoSave: false })
//				let acl = await aclApi.loadFromFileUrl(locationFile)
//				acl.addRule(READ, "https://fvspeybr.inrupt.net/profile/card#me")
//				await acl.saveToPod()

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
	}
}
