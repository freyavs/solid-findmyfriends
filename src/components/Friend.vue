<template>
    <div>
        <ul>
            <li v-for="friend in friends" :key="friend" > {{friend}} </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
computed: mapState(["friends"])
};
</script>

<style lang="scss" scoped>

</style>