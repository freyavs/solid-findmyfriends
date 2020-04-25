<template>
    <div>
      <h3 v-for="friend in friendNames" :key="friend">{{ friend }}</h3>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['friendNames'])
	}
}
</script>

<style scoped>

</style>
