<template>
    <div v-on:click="changeLocationSharing">
        <button v-if="!sharingLocation">start tracking</button>
        <button v-else>stop tracking</button>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(['sharingLocation']),
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

<style lang="css" scoped>
button {
	padding: 5px;
	margin: 5px;
	margin-right: 25px;
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
}
</style>