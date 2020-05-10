<template>
  <div class="site">
    <Map class="map"></Map>
    <FriendList class="friendslist"></FriendList>
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
.site {
  display: grid;

  grid-template-rows: 5fr 4fr 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "map"
    "friends"
    "me";
}

button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
	margin: 10px 10px 10px 5px;
}

.scrollable {
	height: 100%;
  -webkit-overflow-scrolling: touch;
	overflow-y: auto;
}

.map {
  grid-area: map;
}

.friendslist {
  background-color: #ffad5a;
  grid-area: friends;
}

.me {
  background-color: #ff5959;
  grid-area: me;
	
	display: flex;
	align-items: center;
}

@media screen and (min-width: 950px) {
  .site {
		height: 100%;
    grid-template-rows: 1fr 8fr;
    grid-template-columns: 2fr 5fr;
    grid-template-areas:
      "me map"
      "friends map";
  }
}
</style>
