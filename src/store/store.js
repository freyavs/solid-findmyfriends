import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'
import * as friends from '@/store/modules/friends.js'

Vue.use(Vuex);

const auth = require('solid-auth-client')
const FC	 = require('solid-file-client')
const fc	 = new FC( auth )

const {default: data} = require('@solid/query-ldflex')

const N3 = require('n3');


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
		}
	},
	actions: {
		login({ commit, dispatch }, webId) {
			commit("LOGIN", webId)
			dispatch("fetchFriends")
		},
		logout({ commit }) {
			commit("LOGOUT");
		},
		async setLocationFile({state, commit, dispatch}, webId) {
			//verkrijg publicTypeIndex			
			let person = data[state.webId]
			let registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
			//stel baseIRI in zodat juist absolute pad van location.ttl gegeven wordt
			const parser = new N3.Parser({baseIRI: webId});
			
			//parse registry 
			let registerContent = await fc.readFile(registry)
			const quads =	parser.parse(registerContent)
			//maak store en steek de geparste quads er in
			const store = new N3.Store()
			store.addQuads(quads)
			//namedNodes om te zoeken in onze store naar juiste dingen	
			const geoPoint = N3.DataFactory.namedNode("http://www.w3.org/2003/01/geo/wgs84_pos#Point")
			const instance = N3.DataFactory.namedNode("http://www.w3.org/ns/solid/terms#instance")
			//zoek in store naar de locationfile	
			const geoPointQuads = store.getQuads(null, null, geoPoint)
			const locationFileQuad = store.getQuads(geoPointQuads.subject, instance)

			//store de locationfile of maak een aan
			if (locationFileQuad.length == 0){
				dispatch("createLocationFile")
			}else{
				commit("SET_LOCATION_FILE", locationFileQuad[0].object.id)
			}
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
