const permissions = require('../lib/solid-permissions.js')

const auth = require('solid-auth-client')
const {default: data} = require('@solid/query-ldflex')

const FC	 = require('solid-file-client')
const fc	 = new FC( auth )

const N3 = require('n3');

const foaf = "http://xmlns.com/foaf/0.1/"
const geo  = "http://www.w3.org/2003/01/geo/wgs84_pos#"

const geoPoint = N3.DataFactory.namedNode(geo + "Point")
const instance = N3.DataFactory.namedNode("http://www.w3.org/ns/solid/terms#instance")

module.exports = {
	escape (iri) {
		if (!iri || !/^\w+:[^<> ]+$/.test(iri))
			return ""
		return iri;
	},

	async removeLocation(webId, locationFile){
		//when user stops location sharing, remove location from location file
		const query = `
		DELETE DATA { 
			<${webId}> <${foaf}based_near>  ?o . 
			 ?o a <${geo}Point>; <${geo}lat> ?x;  <${geo}long> ?y;
		} 
		WHERE {  
			<${webId}> <${foaf}based_near>  ?o . 
			?o a <${geo}Point>; <${geo}lat> ?x;  <${geo}long> ?y;
		};
		`
		// Send a PATCH request to update 
		let response = await auth.fetch(locationFile, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/sparql-update' },
			body: query,
			credentials: 'include',
		});

		return response.status === 200;
	},

	async updateLocation(webId, locationFile, currentLocation) {
		console.log("updating location file: " + locationFile)
		//todo: weg
		this.getLocationFromFile(webId, locationFile)
		// Create the SPARQL UPDATE query
		const query = `
			DELETE DATA { 
				<${webId}> <${foaf}based_near>  ?o . 
				 ?o a <${geo}Point>; <${geo}lat> ?x;  <${geo}long> ?y;
			} 
			INSERT DATA{
				<${webId}> a <${foaf}Person>;
						 <${foaf}based_near> [
						 a <${geo}Point>;
						<${geo}lat>      ${currentLocation.coords.latitude};
						<${geo}long>     ${currentLocation.coords.longitude};
						 ].
			}
			WHERE {  
				<${webId}> <${foaf}based_near>  ?o . 
				?o a <${geo}Point>; <${geo}lat> ?x;  <${geo}long> ?y;
			};
		`
		// Send a PATCH request to update the source
		let response = await auth.fetch(locationFile, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/sparql-update' },
			body: query,
			credentials: 'include',
		});
		//query failed, so this means for our app that the user / user location is not in the location file, send sparql query update to just insert data
		if (response.status == 409) {
			const query = `
			INSERT DATA{
				<${webId}> a <${foaf}Person>;
						 <${foaf}based_near> [
						 a <${geo}Point>;
						<${geo}lat>      ${currentLocation.coords.latitude};
						<${geo}long>     ${currentLocation.coords.longitude};
						 ].
			}
			`
		// Send a PATCH request to update the source
		response = await auth.fetch(locationFile, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/sparql-update' },
			body: query,
			credentials: 'include',
		});
		}
		return response.status === 200;
	},
	async setLocationFile(webId) {
		let file = await this.getLocationFile(webId)
		if (!file){
			return this.createLocationFile(webId)
		}
		return file
	},
	async getLocationFile(webId){
		//verkrijg publicTypeIndex			
		let person = data[webId]
		let registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
		//stel baseIRI in zodat juist absolute pad van location.ttl gegeven wordt
		const parser = new N3.Parser({baseIRI: webId});
		
		//parse registry 
		let registerContent = await fc.readFile(registry)
		const quads =	parser.parse(registerContent)
		//maak store en steek de geparste quads er in
		const store = new N3.Store()
		store.addQuads(quads)
		
		//zoek in store naar de locationfile	
		const geoPointQuads = store.getQuads(null, null, geoPoint)
		const locationFileQuad = store.getQuads(geoPointQuads.subject, instance)

		//store de locationfile of maak een aan
		if (locationFileQuad.length == 0){
			return null
		}else{
			return locationFileQuad[0].object.id
		}
	},
	async createLocationFile(webId){
		//verkrijg publicTypeIndex			
		const person = data[webId]
		const registry = await person['http://www.w3.org/ns/solid/terms#publicTypeIndex']
		//verkrijg podroot
		const podRoot = webId.replace(/\/profile.*/, '/')
		
		//maak locationfile aan
		const make = fc.createFile(podRoot + "public/location.ttl", "", "text/turtle")
			.then(() => {
				//update de publicTypeIndex met de nieuwe file
				const query = `
				INSERT DATA{
					@prefix solid: <http://www.w3.org/ns/solid/terms#>.
					@prefix wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>.
					<findmyfriendslocation> a solid:TypeRegistration;
						solid:forClass wgs:Point;
						solid:instance </public/location.ttl>.	
				}
				`
				return Promise.resolve(
					auth.fetch(registry, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/sparql-update' },
						body: query,
						credentials: 'include',
					})
						.then(() => {
							permissions.revokePublicAgentPermission(podRoot + "public/location.ttl")
							return podRoot + "public/location.ttl"
						})
						.catch(error => {
						console.log("Failed to update publicTypeIndex")
						console.log(error)	
						})
				)
			})
			.catch(error => {
				console.log("Failed to create location file")
				console.log(error)
			})
		const file = await Promise.resolve(make)
		return file
	},
	async getLocationFromFile(webId, locationFile){
		console.log("getting location from file")
		//parse location file
		let locationContent = await fc.readFile(locationFile)
		const parser = new N3.Parser({baseIRI: webId});
		const quads = parser.parse(locationContent)
		//maak store en steek de geparste quads er in
		const store = new N3.Store()
		store.addQuads(quads)
		//namedNodes om te zoeken in onze store naar juiste dingen	
		//const geoPoint = N3.DataFactory.namedNode("http://www.w3.org/2003/01/geo/wgs84_pos#Point")
		console.log(quads)
	}
}
