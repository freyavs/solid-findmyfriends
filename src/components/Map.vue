<template>
	<div>
		<div id="mapContainer"></div>
	</div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from "leaflet"

export default {
data() {
    return {
      map: null
    };
  },
  mounted() {
    this.map = L.map("mapContainer").setView([51.05, 3.71667], 12);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
</script>

<style>
#mapContainer {
	width: 100%;
	height: 100%;
}
</style>
