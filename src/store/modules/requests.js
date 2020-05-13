
const rdf = require('rdflib')
const sn = require('@/lib/solid-notifs.js')

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
    fetchRequests({commit, rootState}){
        let requests = []
        sn.list(rootState.webId, options).then(contains => {
            for (let message of contains){
                fc.readFile(message).then( m => {
                    console.log(m)
                    let input = new Readable({
                        read: () => {
                          input.push(m)
                          input.push(null)
                        }
                      })

                    const output = parserJsonld.import(input)

                    output.on('data', quad => {
                        let requester = quad.subject.value.toString()
                        if ( requests.filter(req => req.requester == requester).length > 0 ){
                            //delete any double requests, use delete in stead of deleteFile so it doesn't try to delete non existing .acl and .meta files
                            fc.delete(message)
                        }
                        else {
                            requests.push({ requester: requester, message: message})
                        }
                        //console.log(`${quad.subject.value} - ${quad.predicate.value} - ${quad.object.value}`)
                    })
                })

            }
        })
        commit('SET_REQUESTS', requests)
    },
    requestLocation( { rootState} ,friendWebId){
          let payload = `{
            "@context": "https://www.w3.org/ns/activitystreams",
            "@id": "${rootState.webId}",
            "type": "FindMyFriendsRequest",
            "from": "${rootState.webId}" }`
          sn.send(friendWebId.toString(), payload, options) 
    },
    handleRequest({ commit, state }, request){
        fc.delete(request.message)
        let requests = state.requests.filter(req => req.requester !== request.requester)
        if (request.accepted){
            //todo
        }
        commit('SET_REQUESTS', requests)
    }

}
