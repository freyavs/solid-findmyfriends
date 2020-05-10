import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'

Vue.use(Vuex);

const auth = require('solid-auth-client')
const FC   = require('solid-file-client')
const fc   = new FC( auth )

const {default: data} = require('@solid/query-ldflex')


const N3 = require('n3');
//stel baseIRI in zodat juist absolute pad van location.ttl gegeven wordt
const parser = new N3.Parser({baseIRI: "https://fvspeybr.inrupt.net/profile/card#me" });

//klasse die solid:forClass aangeeft van de location file die we zoeken
const geoPoint = "http://www.w3.org/2003/01/geo/wgs84_pos#Point";

export default new Vuex.Store({
  state: {
    loggedIn: false,
    popupUri: "https://solid.github.io/solid-auth-client/dist/popup.html",
    webId: "",
    locationFile: "",
    foaf: "http://xmlns.com/foaf/0.1/"
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
    //maak een location file aan als die nog niet in public type index registry zit 
    async setLocationFile({commit}, webId) {
      let person = data[webId]
      let registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
      console.log("REGISTER: " + registry)

      //parse registry 
      let regcont = await fc.readFile(registry)
      let foundLocation = false
      let locationFile = ""
      //geef callback mee aan parse zodat quads synchronisch overlopen worden
      parser.parse(regcont, (error, quad) => {
        //als quad bestaat en locationFile nog niet ingesteld is, blijf zoeken
          if (quad &&  locationFile == ""){
            //de quad na aangeven van Point (quad die dus de solid:forClass geo:Point; bevat) zal de link bevatten van de location file
            if (foundLocation) {
              console.log("LOCATION_FILE FOUND: " + quad.object.id)
                locationFile = quad.object.id
                commit("SET_LOCATION_FILE", locationFile)
            }
            if (quad.object.id == geoPoint){
              foundLocation = true
            }
          }
       }) 

       if (!foundLocation){
         console.log("LOCATION_FILE NOT FOUND")
         locationFile = await createLocationFile();
         commit("SET_LOCATION_FILE", locationFile)
       }
    }
  },
  modules: {
    location
  },
});

async function createLocationFile(){
	console.log("CREATING_LOCATIONFILE")
  //TODO: maak file aan + stel .acl juist in! (dus niemand mag lezen behalve de owner) + update de public index registry
	let url = "https://thdossch.solid.community/public/"
	let awns = await fc.createFile(url + "location.ttl", "", "text/turtle")
	console.log(awns)
	
	console.log("CREATING_LOCATIONFILE DONE")
  return (url + "location.ttl") 
}


//TODO: deze functie staat ook in location

 // Escapes the IRI for use in a SPARQL query
 function escape (iri) {
  // More of a sanity check, really
  if (!iri || !/^\w+:[^<> ]+$/.test(iri))
    return ""
  return iri;
}
