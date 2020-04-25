<template>
  <div class="site">
    <Map class="map"></Map>
    <Friend class="friendslist"></Friend>
    <Me class="me"></Me>
  </div>
</template>

<script>
import Me from '@/components/Me.vue'
import Friend from '@/components/Friend.vue'
import Map from '@/components/Map.vue'

export default {
	components: {
		Me, Friend, Map	
	}
}
</script>

<style scoped>
div {
  border-radius: 8px;
}
.site {
  height: 95%;
  display: grid;
  grid-gap: 3px;

  grid-template-rows: 6fr 4fr 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "map"
    "friends"
    "me";
}

.map {
  background-color: #87d7ff;
  grid-area: map;
}

.friendslist {
  background-color: #d75f5f;
  grid-area: friends;
}

.me {
  background-color: #ffaf5f;
  grid-area: me;
}
@media screen and (min-width: 950px) {
  .site {
    grid-template-rows: 10fr 1fr;
    grid-template-columns: 2fr 5fr;
    grid-template-areas:
      "friends map"
      "me map";
  }
}
</style>
