import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'

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

//const SolidAclUtils = require('solid-acl-utils')
//const { AclApi, AclDoc, AclParser, AclRule, Permissions, Agents } = SolidAclUtils
//const { READ, WRITE, APPEND, CONTROL } = Permissions
//const AclApi = SolidAclUtils.AclApi
//const Permissions = SolidAclUtils.Permissions
//const READ = Permissions.READ
//const CONTROL = Permissions.CONTROL

export default new Vuex.Store({
	state: {
		loggedIn: false,
		popupUri: "https://solid.github.io/solid-auth-client/dist/popup.html",
		webId: "",
		locationFile: "",
    foaf: "http://xmlns.com/foaf/0.1/",
    friendsView: true
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
		login({ commit }, webId) {
			commit("LOGIN", webId)
		},
		logout({ commit }) {
			commit("LOGOUT");
		},
    async addFriend({ state }, friendurl){
      if (escape(friendurl) === ""){
        return false
      }

      const query = `
        INSERT DATA{
          <${escape(state.webId)}> <${state.foaf}knows> <${escape(friendurl)}>
        }
        `
      // Send a PATCH request to update the source
      let response = await auth.fetch(state.webId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/sparql-update' },
        body: query,
        credentials: 'include',
      });

      return response.status === 200
    },
		async setLocationFile({commit}, webId) {
			//verkrijg publicTypeIndex			
			let person = data[webId]
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

			//maak locationfile of sla op	
			let locationFile = ""
			if (locationFileQuad.length == 0){
				locationFile = await createLocationFile(webId);
			}else{
				locationFile = locationFileQuad[0].object.id
				
//				const fetch = auth.fetch.bind(auth)
//				const aclApi = new AclApi(fetch, { autoSave: false })
//				let acl = await aclApi.loadFromFileUrl(locationFile)
//				acl.addRule(READ, "https://fvspeybr.inrupt.net/profile/card#me")
//				await acl.saveToPod()
			}
			console.log(locationFile)
			commit("SET_LOCATION_FILE", locationFile)
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
    }
	},
	modules: {
		location
	},
});

async function createLocationFile(webId){
	console.log("CREATING_LOCATIONFILE")
	
	//verkrijg publicTypeIndex			
	const person = data[webId]
	const registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
	//verkrijg podroot
	const podRoot = webId.replace(/\/profile.*/, '/')
	
	fc.createFile(podRoot + "public/location.ttl", "", "text/turtle")
		.then(() => {
			const query = `
			INSERT DATA{
				@prefix solid: <http://www.w3.org/ns/solid/terms#>.
				@prefix wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>.
				<findmyfriendslocation> a solid:TypeRegistration;
					solid:forClass wgs:Point;
					solid:instance </public/location.ttl>.	
			}
			`
			// Send a PATCH request to update the source
			auth.fetch(registry, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/sparql-update' },
				body: query,
				credentials: 'include',
			})
				.catch(error => {
				console.log("Failed to update publicTypeIndex")
				console.log(error)	
				})
		})
		.catch(error => console.log(error))
	console.log("CREATING_LOCATIONFILE DONE")
			
	return podRoot + 'public/location.ttl'
}


//TODO: deze functie staat ook in location

 // Escapes the IRI for use in a SPARQL query
 function escape (iri) {
  // More of a sanity check, really
  if (!iri || !/^\w+:[^<> ]+$/.test(iri))
    return ""
  return iri;
}
