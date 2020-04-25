<template>
    <div>
      <h3 v-for="friend in friendnames" :key="friend">{{ friend }}</h3>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	computed: {
		...mapState(['friendnames'])
	}
}
</script>

<style lang="scss" scoped>

</style>