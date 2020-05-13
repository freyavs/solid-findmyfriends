<template>
  <div class="site">
    <Map class="map"></Map>
    <div class="friendslist">
		<transition name="switch" mode="out-in">
			<div class="anim" v-if="friendsView" key="1">
        <FriendList/>
			</div>
      <div v-else key="2">
        <RequestsLDN/>
			</div>
		</transition>
	</div>
    <Me class="me"></Me>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Me from '@/components/Me.vue'
import FriendList from '@/components/solid/FriendList.vue'
import Map from '@/components/Map.vue'
import RequestsLDN from '@/components/RequestsLDN.vue'

export default {
	components: {
		Me, FriendList, Map	, RequestsLDN
  },
  computed:  mapState({
      friendsView: state => state.friends.friendsView,
      webId: state => state.webId
  })
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

.switch-enter, .switch-leave-to {
	opacity: 0;
	transform: translateX(-100px);
}
.switch-enter-active, .switch-leave-active {
	transition: all 0.6s ;
}
.anim{
	height: 100%;
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
