<template>
	<div class="card">
		<ProfileImage :src="request.requester"/>
		<Name :src="request.requester"/>
		<button v-on:click="acceptRequest">accept</button>
		<button v-on:click="removeRequest">deny</button>
	</div>
</template>

<script>
import Name from '@/components/solid/Name.vue';
import ProfileImage from '@/components/solid/ProfileImage.vue';

export default {
	props: ['request'],
  components: {
    Name,
    ProfileImage
  },
	methods: {
		acceptRequest(){
			this.$store.dispatch('handleRequest',{message: this.request.message, requester: this.request.requester, accepted: true})
		},
		removeRequest(){
			this.$store.dispatch('handleRequest', {message: this.request.message, requester: this.request.requester, accepted: false})
		}
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
