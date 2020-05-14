
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
                        //console.log(m)
                        let input = new Readable({
                            read: () => {
                            input.push(m)
                            input.push(null)
                            }
                        })

                        let output = parserJsonld.import(input)

                        output.on('data', quad => {
                            //TODO: beter
                            if (quad.predicate.value.toString() === "https://www.w3.org/ns/activitystreams#actor"){
                                let requester = quad.object.value.toString()
                                if ( requests.filter(req => req.requester === requester).length > 0 ){
                                    //delete any double requests, use delete in stead of deleteFile so it doesn't try to delete non existing .acl and .meta files
                                    fc.delete(message.url)
                                    console.log("deleting duplicate message")
                                }
                                else {
                                    requests.push({ requester: requester, message: message.url})
                                    console.log("adding to requests")
                                }
                               // console.log(quad)
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
            "@id": "",
            "summary": "FindMyFriendRequest",
            "type": "Invite",
            "actor": "${rootState.webId}"
            }`

          sn.send(friendWebId.toString(), payload, options) 
    },
    handleRequest({ commit, state, rootState }, request){
        fc.delete(request.message)
        let requests = state.requests.filter(req => req.requester !== request.requester)
        if (request.accepted){
            perm.givePermission(rootState.locationFile, request.requester)
        }
        commit('SET_REQUESTS', requests)
    }

}
