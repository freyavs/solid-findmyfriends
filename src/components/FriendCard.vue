<template>
	<div class="card">
		<ProfileImage :src="friendId"/>
		<Name :src="friendId"/>
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
}
</script>

<style scoped>
.card {
	height: 80px;

	display: flex;
	align-items: center;
}
</style>
