import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'
import * as friends from '@/store/modules/friends.js'
import tools from '../lib/tools'

Vue.use(Vuex);

var rdf = require('rdflib')
var sn = require('@/lib/solid-notifs.js')

var webClient = require('solid-web-client')(rdf)
var options = {
  "webClient" : webClient
}

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
		},
		logout({ commit }) {
			commit("LOGOUT");
		},
		async setLocationFile({state, commit, dispatch}) {
			const locationFile = await tools.setLocationFile(state.webId)
			commit("SET_LOCATION_FILE", locationFile)
			dispatch("fetchFriendsPermissions")
		},
    requestLocation( { state } , friendWebId){
        console.log("requesting location of " + friendWebId )
        
        sn.discoverInboxUri(friendWebId, options.webClient).then( inbox => {
          console.log(inbox)

          options.inboxUri = inbox

          /* test:
          let opts = {
            headers: { 'Accept': 'application/ld+json;q=0.9,text/turtle;q=0.8' }
          }
           webClient.get(inbox, opts).then(x => {console.log(x)})
          
          sn.list(friendWebId, options).then(contains => {
            console.log(contains);
          })*/
        
          var payload = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "@id": "",
            "type": "FindMyFriendsRequest",
            "from": state.webId
          }
          sn.send(friendWebId, payload, options)   
        })
    },
	},
	modules: {
		location,
		friends
	},
});
