//var Promise = require("Promise");

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/


// async function fetchModel(url) {
//   try {
//     const response = await fetch(url);
	
// 	if (!response.ok) throw new Error({status: response.status, statusText: response.statusText});

// 	const json = await response.json();

// 	return new Promise(function(resolve) {
// 		resolve({data: json});
// 	});
//   }
//   catch (error){
// 	return new Promise(function(resolve, reject) {
// 		reject(error);
// 	});
//   }
// }

// export default fetchModel;
