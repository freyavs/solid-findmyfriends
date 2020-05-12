<template>
	<div class="card">
		<ProfileImage :src="friendId"/>
		<Name :src="friendId"/>
		<button v-on:click="switchPermissionStatus">{{ action }}</button>
		<button v-on:click="requestLocation">request location</button>
	</div>
</template>

<script>
import Name from '@/components/solid/Name.vue';
import ProfileImage from '@/components/solid/ProfileImage.vue';

import { mapState } from 'vuex'

const auth = require('solid-auth-client')

const SolidAclUtils = require('solid-acl-utils')
const AclApi = SolidAclUtils.AclApi
const Permissions = SolidAclUtils.Permissions
const READ = Permissions.READ
				
const fetch = auth.fetch.bind(auth)
const aclApi = new AclApi(fetch, { autoSave: true })

export default {
	props: ['friendId'],
  components: {
    Name,
    ProfileImage
  },
	data() {
		return {
			sharing: false
		}
	},
	computed: {
		action(){
			if(this.sharing){
				return "block"
			}else{
				return "share"
			}
		},
		...mapState(["locationFile"])
	},
	methods: {
		switchPermissionStatus(){
			if (!this.sharing){
				console.log("give perimission to: " + this.friendId)
				this.givePermission()
			} else {
				console.log("revoke perimission to: " + this.friendId)
				this.revokePermission()
			}
			this.sharing = !this.sharing
		},
		async givePermission(){
			let acl = await aclApi.loadFromFileUrl(this.locationFile)
			acl.addRule(READ, this.friendId.toString())
		},
		async revokePermission(){
			let acl = await aclApi.loadFromFileUrl(this.locationFile)
			acl.deleteRule(READ, this.friendId.toString())
		},
		requestLocation(){
			this.$store.dispatch('requestLocation', this.friendId)
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
