<template>
    <div>
        <button v-if="sharingLocation" v-on:click="">start tracking</button>
        <button v-else v-on:click="log">stop tracking</button>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
computed: mapState(["sharingLocation"]),
methods: {
	log() {
		console.log('stop track')
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
