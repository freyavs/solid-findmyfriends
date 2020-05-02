const auth = require('solid-auth-client')

export const state = {
    sharingLocation: false,
    currentLocation: null,
    interval: null,
    file: "/public/location.ttl",
    geo: "http://www.w3.org/2003/01/geo/wgs84_pos#",
    foaf: "http://xmlns.com/foaf/0.1/"
}

export const mutations = {
    LOCATION_ON(state) {
      state.sharingLocation = true
    },
    LOCATION_OFF(state) {
      state.sharingLocation = false
      state.currentLocation = null
      clearInterval(state.interval)
    },
    SET_LOCATION(state,location){
      state.currentLocation = location
    },
    SET_TIMER(state, timer){
      state.interval = timer
    }
}

export const actions = {
    locationSharingOn({commit}) {
      commit("LOCATION_ON")
    },
    locationSharingOff({commit}) {
      commit("LOCATION_OFF")
    },
    fetchLocation({commit}){
      getGeoLocation(commit)
      let timer = setInterval(() => {
       getGeoLocation(commit)
      }
      , 5000) //set location every 5 seconds
      commit("SET_TIMER", timer)
    }
 }

 function getGeoLocation(commit){
  if(!("geolocation" in navigator)) {
    console.log("Geolocation is not available")
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    commit('SET_LOCATION', pos)
    updateLocation()
  }, err => {
    console.log(err.message)
  })
 }

 async function updateLocation() {
  // Create the SPARQL UPDATE query
  const query = `
    INSERT {
     <${escape("https://fvspeybr.inrupt.net/profile/card#me")}> a <${state.foaf}Person>;
          <${state.foaf}based_near> [
          a <${state.geo}Point>;
         <${state.geo}lat>      ${state.currentLocation.coords.latitude};
         <${state.geo}long>     ${state.currentLocation.coords.longitude};
          ].
    }`

    /*
    //TODO: DELETE + INSERT om punt aan te passen
  const query2 = `
    DELETE { <https://fvspeybr.inrupt.net/profile/card#me> ?p ?o }
 `
 */
    
  // Send a PATCH request to update the source
  const response = await auth.fetch("https://fvspeybr.inrupt.net/public/location.ttl", {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/sparql-update' },
    body: query,
    credentials: 'include',
  });
/*
  const response2 = await auth.fetch("https://fvspeybr.inrupt.net/public/location.ttl", {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/sparql-update' },
    body: query2,
    credentials: 'include',
  });
  console.log(response2.status)*/
  return response.status === 200;
}

 // Escapes the IRI for use in a SPARQL query
 function escape (iri) {
  // More of a sanity check, really
  if (!iri || !/^\w+:[^<> ]+$/.test(iri))
    throw new Error(`Invalid IRI: ${iri}`);
  return iri;
}

