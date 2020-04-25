<template>
    <div>
        <button v-if="sharingLocation" v-on:click="">start tracking</button>
        <button v-else v-on:click="">stop tracking</button>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
computed: mapState(["sharingLocation"])
};
</script>

<style lang="scss" scoped>

</style>