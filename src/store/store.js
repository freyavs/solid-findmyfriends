import Vue from "vue";
import Vuex from "vuex";
import * as location from '@/store/modules/location.js'

Vue.use(Vuex);

const auth = require('solid-auth-client')

//files:
const FC   = require('solid-file-client')
const fc   = new FC( auth )

//ldflex:
const {default: data} = require('@solid/query-ldflex')

//n3 voor parsen van files:
const N3 = require('n3');

//stel baseIRI in zodat juist absolute pad van location.ttl gegeven wordt
const parser = new N3.Parser({baseIRI: "https://fvspeybr.inrupt.net/profile/card#me" });

//const forClass = "http://www.w3.org/ns/solid/terms#forClass";
const geoPoint = "http://www.w3.org/2003/01/geo/wgs84_pos#Point";

export default new Vuex.Store({
  state: {
    loggedIn: false,
    popupUri: "https://solid.github.io/solid-auth-client/dist/popup.html",
    webId: "",
    locationFile: ""
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
    //maak een location file aan als die nog niet in public type index registry zit 
    async setLocationFile({commit}, webId) {
      let person = data[webId]
      let registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
      console.log("registry url: " + registry)

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
                console.log("Found location file: " + quad.object.id)
                locationFile = quad.object.id
            }
            if (quad.object.id == geoPoint){
              foundLocation = true
            }
          }
       }) 

       if (!foundLocation){
         //TODO: maak file aan én stel .acl juist in! (dus niemand mag lezen behalve de owner)
       }
       commit("SET_LOCATION_FILE", locationFile)
    }
  },
  modules: {
		location
	},
});
