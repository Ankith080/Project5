/**
 * FetchModel - Fetch a model from the web server.
 * @param {string} url - The URL to issue the GET request.
 * @returns {Promise} - A Promise that resolves with the response of the GET request
 * parsed as a JSON object and returned in the property named "data" of an object.
 * If the request has an error, the promise is rejected with an object containing
 * the properties:
 *    status: The HTTP response status
 *    statusText: The statusText from the XHR request
 */

function FetchModel(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open('GET', url, true);

        // Set up the event listeners for success and error
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve({ data: response });
                } catch (error) {
                    reject({
                        status: xhr.status,
                        statusText: 'Invalid JSON response',
                    });
                }
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                });
            }
        };

        xhr.onerror = () => {
            reject({
                status: xhr.status,
                statusText: 'Network error',
            });
        };

        // Send the request
        xhr.send();
    });
}

export default FetchModel;
