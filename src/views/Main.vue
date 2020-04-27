<template>
  <div class="site">
    <Map class="map"></Map>
    <FriendList :src="webId" class="friendslist"></FriendList>
    <Me class="me"></Me>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Me from '@/components/Me.vue'
import FriendList from '@/components/solid/FriendList.vue'
import Map from '@/components/Map.vue'

export default {
	components: {
		Me, FriendList, Map	
  },
  computed: mapState(['webId'])
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
    grid-template-rows: 1fr 10fr;
    grid-template-columns: 2fr 5fr;
    grid-template-areas:
      "me map"
      "friends map";
  }
}
</style>
