<template>
  <div>
    <div id="mapContainer"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mapState } from "vuex";

export default {
  computed: mapState({
		currentLocation: state => state.location.currentLocation
	}),
  data() {
    return {
      map: null,
      marker: null
    };
  },
  watch: {
    currentLocation: function() {
      if (this.currentLocation != null) {
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

        this.marker = L.marker([
            this.currentLocation.coords.latitude,
            this.currentLocation.coords.longitude
          ], { icon: smallIcon }).addTo(this.map)

      }else{
				this.map.removeLayer(this.marker)
			}
    }
  },
  mounted() {
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
