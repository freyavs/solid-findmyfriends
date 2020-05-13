const auth = require('solid-auth-client')

const SolidAclUtils = require('solid-acl-utils')
const { AclApi, Agents } = SolidAclUtils
const Permissions = SolidAclUtils.Permissions
const READ = Permissions.READ
				
const fetch = auth.fetch.bind(auth)
const aclApi = new AclApi(fetch, { autoSave: true })

module.exports = {
	givePermission(locationFile, friendId){
		aclApi.loadFromFileUrl(locationFile)
			.then( acl => {
				acl.addRule(READ, friendId.toString())
					.catch(error => {
						console.log("Failed to add READ rule to " + locationFile + " for " + friendId)
						console.log(error)
					})
			})
			.catch(error => {
				console.log("Failed to fetch " + locationFile)
				console.log(error)
			})
	},
	revokePermission(locationFile, friendId){
		aclApi.loadFromFileUrl(locationFile)
			.then( acl => {
				acl.deleteRule(READ, friendId.toString())
					.catch(error => {
						console.log("Failed to revoke READ rule from " + locationFile + " for " + friendId)
						console.log(error)
					})
			})
			.catch(error => {
				console.log("Failed to fetch " + locationFile)
				console.log(error)
			})
	},
	revokePublicAgentPermission(locationFile){
		aclApi.loadFromFileUrl(locationFile)
			.then( acl => {
				acl.deleteRule(READ, Agents.PUBLIC)
			})
			.catch(error => {
				console.log("Failed to remove Public Agent Read permissions")
				console.log(error)
			})
	},
	async getFriendsWithAcces(locationFile){
		const acl = await aclApi.loadFromFileUrl(locationFile)
		const agents = acl.getAgentsWith(READ)
		return [...agents.webIds]
	},
}

