import tools from '../tools'

export const state = {
    sharingLocation: false,
    currentLocation: null,
    interval: null,
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
	locationSharingOn({commit, dispatch}) {
		commit("LOCATION_ON")
		dispatch("getGeoLocation") 
		//set location every 5 seconds
		commit("SET_TIMER", setInterval(() => { dispatch("getGeoLocation") } , 5000))
	},
	locationSharingOff({rootState, state, commit}) {
		commit("LOCATION_OFF")
		tools.removeLocation(rootState.webId, state.locationFile)
	},
	getGeoLocation({ rootState, state, commit }){
		if(!("geolocation" in navigator)) {
			alert("Geolocation not available...")
			return;
		}
		navigator.geolocation.getCurrentPosition(position => {
			commit('SET_LOCATION', position)
			tools.updateLocation(rootState.webId, state.locationFile, state.currentLocation)
		}, err => console.log(err.message))
	}
}
