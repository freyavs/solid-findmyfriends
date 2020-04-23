import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		loggedIn: false,
		popupUri : 'https://solid.github.io/solid-auth-client/dist/popup.html',
		webId: '',
		name: "thor"
  },
  mutations: {
		LOGIN(state, webId){
			state.loggedIn = true
			state.webId = webId
		},
		LOGOUT(state){
			state.loggedIn = false
			state.webId = ''
		}
  },
  actions: {
		login({ commit }, webId){
			commit('LOGIN', webId)
		},
		logout({ commit }){
			commit('LOGOUT')
		}
  },
  modules: {
  }
})
