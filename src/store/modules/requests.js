const rdf = require('rdflib')
const sn = require('@/lib/solid-notifs.js')
const perm = require('@/lib/solid-permissions.js')

const auth = require('solid-auth-client')
const FC	 = require('solid-file-client')
const fc	 = new FC( auth )

const webClient = require('solid-web-client')(rdf)
const options = {
  "webClient" : webClient
}

const ParserJsonld = require('@rdfjs/parser-jsonld')
const Readable = require('stream').Readable

const actStreams = "https://www.w3.org/ns/activitystreams#"
const summary = "FindMyFriendRequest"
 
const parserJsonld = new ParserJsonld()

export const state = {
	requests: []
}

export const mutations = {
    SET_REQUESTS(state, requests){
        state.requests = requests
    }
}

export const actions = {
    async fetchRequests({commit, rootState}){
        let requests = []

        //cant use sn.list because it is giving inconsistent results
        sn.discoverInboxUri(rootState.webId, webClient).then(inboxUri => {
            fc.readFolder(inboxUri).then(folder => {
                for (let message of folder.files){
                    fc.readFile(message.url).then( m => {
                        let input = new Readable({
                            read: () => {
                            input.push(m)
                            input.push(null)
                            }
                        })
                        let output = parserJsonld.import(input)
                        let isInvite, hasSumm, requester
                        output.on('data', quad => {
                            //make sure message is a request of our app
                            if (quad.object.value === actStreams + "Invite"){
                                isInvite = true
                            }
                            if (quad.predicate.value === actStreams + "summary" && quad.object.value === summary){
                                hasSumm = true
                            }
                            if (quad.predicate.value === actStreams + "actor"){
                                requester = quad.object.value             
                            }
                            if (isInvite && hasSumm && requester){
                                if ( requests.filter(req => req.requester === requester).length > 0 ){
                                    //delete any double requests, use delete in stead of deleteFile so it doesn't try to delete non existing .acl and .meta files
                                    fc.delete(message.url)
                                }
                                else {
                                    requests.push({ requester: requester, message: message.url})
                                }
                            }
                        })
                    })

                }
            })
        })
        commit('SET_REQUESTS', requests)
    },
    requestLocation( { rootState} ,friendWebId){
          let payload = `{
            "@context": "https://www.w3.org/ns/activitystreams#",
            "summary": "${summary}",
            "type": "Invite",
            "actor": "${rootState.webId}"
            }`

          sn.send(friendWebId.toString(), payload, options) 
					alert("request sent")
    },
    handleRequest({ commit, state, rootState, dispatch }, request){
        fc.delete(request.message)
        let requests = state.requests.filter(req => req.requester !== request.requester)
        if (request.accepted){
            perm.givePermission(rootState.locationFile, request.requester)
						dispatch("updateFriend", {webId: request.requester, sharing: true})
        }
        commit('SET_REQUESTS', requests)
    }

}
