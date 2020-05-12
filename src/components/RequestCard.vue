<template>
	<div class="card">
		<ProfileImage :src="friendId"/>
		<Name :src="friendId"/>
		<button v-on:click="acceptReqest">accept</button>
		<button v-on:click="removeRequest">deny</button>
	</div>
</template>

<script>
import Name from '@/components/solid/Name.vue';
import ProfileImage from '@/components/solid/ProfileImage.vue';

export default {
	props: ['friendId'],
  components: {
    Name,
    ProfileImage
  },
	methods: {
	}
}
</script>

<style scoped>
.card {
	height: 80px;

	display: flex;
	align-items: center;
}

button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
	margin: 10px 10px 10px 5px;
}
</style>
