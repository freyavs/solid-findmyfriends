<template>
    <div>
      <h3 v-for="(friend, key) in friendNames" :key="friend">{{ friendNames[key] }}</h3>
    </div>
</template>

<script>
export default {
	computed: {
		friendNames() {
			return this.$store.getters.friendNames
		}
	}
}
</script>

<style scoped>

</style>
