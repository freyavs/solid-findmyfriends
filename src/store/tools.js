const auth = require('solid-auth-client')
const foaf = "http://xmlns.com/foaf/0.1/"
const geo  = "http://www.w3.org/2003/01/geo/wgs84_pos#"

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
	}
	}
