export const state = {
    sharingLocation: false,
    currentLocation: null,
}

export const mutations = {
    LOCATION_ON(state) {
      state.sharingLocation = true
    },
    LOCATION_OFF(state) {
      state.sharingLocation = false
			state.currentLocation = null
    },
    SET_LOCATION(state,location){
      state.currentLocation = location
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
 }

