<template>
	<div>
		<div id="mapContainer"></div>
		<h6>friends</h6>
	</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Icon }  from 'leaflet'
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
import { mapState } from "vuex";
import tools from '@/lib/tools'

const {default: data} = require('@solid/query-ldflex')

export default {
	computed: mapState({
		currentLocation: state => state.location.currentLocation,
		friends: state => state.friends.friends,
		webId: state => state.webId,
		name: state => state.name
	}),
	data() {
		return {
			map: null,
			marker: null,
			friendMarkers: [],
			onMap: false,
		};
	},
	watch: {
		currentLocation: function() {
			if (this.currentLocation !== null && this.name !== null) {
				//remove eerst de marker en zet dan een nieuwe
				if (this.marker){
					this.map.removeLayer(this.marker)
				}else{
					this.map.flyTo(new L.LatLng(this.currentLocation.coords.latitude, this.currentLocation.coords.longitude))
				}
				this.marker = L.marker([
						this.currentLocation.coords.latitude,
						this.currentLocation.coords.longitude
				//geen foto nodig bij "me" vinden we, wel bij vrienden
					]).bindTooltip("<div class='tooltip'><h3>Me</h3></div>",
							{
								permanent: true, 
								direction: 'right'
							}).addTo(this.map)	
							
      }else{
				this.map.removeLayer(this.marker)
				this.marker = null
			}
		}
	},
	methods: {
		async updateFriendLocations(){
			console.log("Note: updating friends location, errors will appear if you aren't allowed to see someone's location.")
			let newMarkers = []
			for (let friend of this.friends){
				let person = data[friend.webId]
				let picture = await person.foaf_img
				let name = await person.name

				let marker = await Promise.resolve(tools.getLocationFromFile(friend.webId, friend.locationFile)
					.then( location => {
						if (location !== null){
							let marker = {
								name: name,
								picture: picture,
								latitude: location.lat,
								longitude: location.long
							}
							return marker
						}
					})
					.catch(error => error))
				if(marker && marker.longitude){
					newMarkers.push(marker)
				}
			}
			this.addFriendMarkers(newMarkers)
		},
		addFriendMarkers(newMarkers) {
			this.friendMarkers.forEach(marker => {
				this.map.removeLayer(marker)
			})
			this.friendMarkers = []
			newMarkers.forEach(marker => {
				let img = " "
				if (marker.picture !== undefined){
					img = "<img src=" + marker.picture.toString() +" class='img'></img>"
				}
				let newMarker = L.marker([
						marker.latitude,
						marker.longitude
					]).bindTooltip("<div class='tooltip'> " + img + "<h4>" + marker.name.toString() + "</h4></div>", 
							{
								permanent: true, 
								direction: 'right'
							}).addTo(this.map)
				this.friendMarkers.push(newMarker)
			})
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

.img
{
  border-radius:50%;
  width: 50px;
  height: 50px;
}

.tooltip{
	background-color: rgba(255, 255, 255, 0.9);
}

</style>
