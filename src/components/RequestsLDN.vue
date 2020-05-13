<template>
	<div>
		<div class="scrollable">
			<h3>Share your location with: </h3>
            <RequestCard v-for="req in requests" :key="req.message" :request="req"/> 
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import RequestCard from '@/components/RequestCard.vue'

export default {
    components: {
        RequestCard
    },
	computed: mapState({
		requests: state => state.requests.requests
	}),
	methods: {
	}
}
</script>

<style scoped>
button {
	border-radius: 8px;
	border: none;
	width: wrap;
	height: 30px;
	margin: 10px 10px 10px 5px;
}
.scrollable {
	height: 100%;
  -webkit-overflow-scrolling: touch;
	overflow-y: auto;
}

</style>
