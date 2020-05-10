import store from '../store'

const auth = require('solid-auth-client')

export const state = {
    sharingLocation: false,
    currentLocation: null,
    interval: null,
    geo: "http://www.w3.org/2003/01/geo/wgs84_pos#"
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
      getGeoLocation(commit)
      let timer = setInterval(() => {
       getGeoLocation(commit)
      }
      , 5000) //set location every 5 seconds
      commit("SET_TIMER", timer)
    },
    locationSharingOff({commit}) {
      commit("LOCATION_OFF")
      removeLocation()
    }
 }

 async function removeLocation(){
  let webId = store.state.webId

  //when user stops location sharing, remove location from location file
  const query = `
  DELETE DATA { 
    <${escape(webId)}> <${store.state.foaf}based_near>  ?o . 
     ?o a <${state.geo}Point>; <${state.geo}lat> ?x;  <${state.geo}long> ?y;
  } 
  WHERE {  
    <${escape(webId)}> <${store.state.foaf}based_near>  ?o . 
    ?o a <${state.geo}Point>; <${state.geo}lat> ?x;  <${state.geo}long> ?y;
  };
  `
  // Send a PATCH request to update 
  let response = await auth.fetch(store.state.locationFile, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/sparql-update' },
    body: query,
    credentials: 'include',
  });

  return response.status === 200;
}

 function getGeoLocation(commit){
   console.log("updating location")
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
    let webId = store.state.webId
    const query = `
    DELETE DATA { 
      <${escape(webId)}> <${store.state.foaf}based_near>  ?o . 
       ?o a <${state.geo}Point>; <${state.geo}lat> ?x;  <${state.geo}long> ?y;
    } 
    INSERT DATA{
      <${escape(webId)}> a <${store.state.foaf}Person>;
           <${store.state.foaf}based_near> [
           a <${state.geo}Point>;
          <${state.geo}lat>      ${state.currentLocation.coords.latitude};
          <${state.geo}long>     ${state.currentLocation.coords.longitude};
           ].
    }
    WHERE {  
      <${escape(webId)}> <${store.state.foaf}based_near>  ?o . 
      ?o a <${state.geo}Point>; <${state.geo}lat> ?x;  <${state.geo}long> ?y;
    };
    `

  // Send a PATCH request to update the source
  let response = await auth.fetch(store.state.locationFile, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/sparql-update' },
    body: query,
    credentials: 'include',
  });

  //query failed, so this means for our app that the user / user location is not in the location file, send sparql query update to just insert data
  if (response.status == 409) {
    const query = `
    INSERT DATA{
      <${escape(webId)}> a <${store.state.foaf}Person>;
           <${store.state.foaf}based_near> [
           a <${state.geo}Point>;
          <${state.geo}lat>      ${state.currentLocation.coords.latitude};
          <${state.geo}long>     ${state.currentLocation.coords.longitude};
           ].
    }
    `
  // Send a PATCH request to update the source
  response = await auth.fetch(store.state.locationFile, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/sparql-update' },
    body: query,
    credentials: 'include',
  });
  }
  return response.status === 200;
}


 // Escapes the IRI for use in a SPARQL query
 function escape (iri) {
  // More of a sanity check, really
  if (!iri || !/^\w+:[^<> ]+$/.test(iri))
    throw new Error(`Invalid IRI: ${iri}`);
  return iri;
}

