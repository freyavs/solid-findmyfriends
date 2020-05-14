<template>
	<div>
		<div id="mapContainer"></div>
		<h6>friends</h6>
	</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mapState } from "vuex";
import tools from '@/lib/tools'

const {default: data} = require('@solid/query-ldflex')

//workaround leafletmarker not working
let smallIcon = new L.Icon({
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png",
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
	shadowSize: [41, 41]
});

export default {
	computed: mapState({
		currentLocation: state => state.location.currentLocation,
		friends: state => state.friends.friends,
		webId: state => state.webId
	}),
	data() {
		return {
			map: null,
			marker: null,
			friendMarkers: [],
			name: null
		};
	},
	watch: {
		currentLocation: function() {
			if (this.currentLocation != null) {
				//remove eerst de marker en zet dan een nieuwe
				if (this.marker){
					this.map.removeLayer(this.marker)
				}else{
					this.map.flyTo(new L.LatLng(this.currentLocation.coords.latitude, this.currentLocation.coords.longitude))
				}
				if(this.name == null) {
					this.getName()
				}
				this.marker = L.marker([
						this.currentLocation.coords.latitude,
						this.currentLocation.coords.longitude
					], { icon: smallIcon }).addTo(this.map)
				if(this.name != null){
					this.marker
						.bindPopup(this.name.toString())
						.openPopup()
				}
      }else{
				this.map.removeLayer(this.marker)
			}
		}
	},
	methods: {
		async updateFriendLocations(){
			let newMarkers = []
			for (let friend of this.friends){
				let person = data[friend.webId]
				const name = await person.name
				let marker = await Promise.resolve(tools.getLocationFromFile(friend.webId, friend.locationFile)
					.then( location => {
						if (location !== null){
							let marker = {
								name: name,
								latitude: location.lat,
								longitude: location.long
							}
							return marker
						}
					})
					.catch(error => error))
				if(marker){
					newMarkers.push(marker)
				}
      }
			this.addFriendMarkers(newMarkers)
		},
		addFriendMarkers(newMarkers) {
			this.friendMarkers.forEach(marker => this.map.removeLayer(marker))
			newMarkers.forEach(marker => {
				this.friendMarkers.push(marker)
				L.marker([
						marker.latitude,
						marker.longitude
					], { icon: smallIcon }).addTo(this.map)
					.bindPopup(marker.name.toString())
					.openPopup()

			})
		},
		async getName(){
			let person = data[this.webId.toString()]
			const name = await person.name
			this.name = name
		}
	},
	mounted() {
		setInterval(() => { this.updateFriendLocations() } , 10000)

		this.map = L.map("mapContainer", { dragging: !L.Browser.mobile, tap: !L.Browser.mobile }).setView([51.05, 3.71667], 12);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.map)
	}, 
	beforeDestroy() {
		if (this.map) {
			this.map.remove();
		}
	}
};
</script>

<style>
#mapContainer {
	width: 100%;
	height: 100%;
}
</style>
