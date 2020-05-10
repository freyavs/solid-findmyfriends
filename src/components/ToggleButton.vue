<template>
    <div v-on:click="changeLocationSharing">
        <button v-if="!sharingLocation">start tracking</button>
        <button v-else>stop tracking</button>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState({
			sharingLocation: state => state.location.sharingLocation
		}),
    methods: {
        changeLocationSharing(){
            if (!this.sharingLocation){
                this.$store.dispatch('locationSharingOn')
            }
            else {
                this.$store.dispatch('locationSharingOff')
            }
        }
    }
};
</script>

<style scoped>
button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
}
</style>
