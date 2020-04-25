export const state = {
    sharingLocation: false,
    currentLocation: null,
    interval: null
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
  }, err => {
    console.log(err.message)
  })
 }

