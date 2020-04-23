import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		loggedIn: false,
		popupUri : 'https://solid.github.io/solid-auth-client/dist/popup.html'
  },
  mutations: {
		LOGIN(state){
			console.log('login')
			state.loggedIn = true
		},
		LOGOUT(state){
			console.log('logout')
			state.loggedIn = false
		}
  },
  actions: {
		login({ commit }){
			commit('LOGIN')
		},
		logout({ commit }){
			commit('LOGOUT')
		}
  },
  modules: {
  }
})
