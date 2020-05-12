
const rdf = require('rdflib')
const sn = require('@/lib/solid-notifs.js')

const auth = require('solid-auth-client')
const FC	 = require('solid-file-client')
const fc	 = new FC( auth )

const webClient = require('solid-web-client')(rdf)
const options = {
  "webClient" : webClient
}
export const state = {
	requests: []
}

export const mutations = {
}

export const actions = {
    fetchRequests({rootState}){
        sn.list(rootState.webId, options).then(contains => {
            for (let message of contains){
                fc.readFile(message).then( m => console.log(m))
            }
        })
    },
    requestLocation( { rootState} ,friendWebId){
        console.log("requesting location of " + friendWebId )
        console.log("my id: " + rootState.webId)

          let payload = `{
            "@context": "https://www.w3.org/ns/activitystreams",
            "@id": "",
            "type": "FindMyFriendsRequest",
            "from": ${rootState.webId} }`
          sn.send(friendWebId.toString(), payload, options) 
    }

}
