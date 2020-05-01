<template>
  <div class="site">
    <Map class="map"></Map>
    <FriendList :src="webId" class="friendslist"></FriendList>
    <Me class="me"></Me>
		<p>{{get}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Me from '@/components/Me.vue'
import FriendList from '@/components/solid/FriendList.vue'
import Map from '@/components/Map.vue'
const auth = require('solid-auth-client')
const FC   = require('solid-file-client')
const fc   = new FC( auth )

export default {
	components: {
		Me, FriendList, Map	
  },
  computed: mapState(['webId']),
	asyncComputed: {
		async get() {
			if(fc.itemExists('https://thdossch.solid.community/public/location.ttl')){
				let content = await fc.readFile('https://thdossch.solid.community/public/location.ttl')
				console.log(content)
				console.log(this.webId)
			}
		}
	}
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
