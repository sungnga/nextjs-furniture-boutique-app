// 1st arg is the error received from the catch block that gets passed down to this function
// 2nd arg is a callback function that receives the errorMsg as an argument
function catchErrors(error, displayError) {
	let errorMsg;
	if (error.response) {
		// The request was made and the server response with a  status code
		// that is not in the range of 2xx
		errorMsg = error.response.data;
		console.error('Error response', errorMsg);

		// For Cloudingary image uploads
		if (error.response.data.error) {
			errorMsg = error.response.data.error.message;
		}
	} else if (error.request) {
		// The request was made, but no response was received
		errorMsg = error.request;
		console.error('Error request', errorMsg);
	} else {
		// Something else happened in making the request that triggered an error
		errorMsg = error.message;
		console.error('Error message', errorMsg);
	}
	displayError(errorMsg);
}

export default catchErrors;
