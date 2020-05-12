
var rdf = require('rdflib')
var sn = require('@/lib/solid-notifs.js')

const auth = require('solid-auth-client')
const FC	 = require('solid-file-client')
const fc	 = new FC( auth )

var webClient = require('solid-web-client')(rdf)
var options = {
  "webClient" : webClient
}
export const state = {
	requests: []
}

export const mutations = {
}

export const actions = {
    async fetchRequests({rootState}){
        sn.list(rootState.webId, options).then(contains => {
            for (let message of contains){
                fc.readFile(message).then( m => console.log(m))
            }
        })
    },
    requestLocation( { state } , friendWebId){
        console.log("requesting location of " + friendWebId )

          let payload = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "@id": "",
            "type": "FindMyFriendsRequest",
            "from": state.webId
          }
          sn.send(friendWebId, payload, options)   
    }

}
