import axios from 'axios';

const apiUrl = "https://northeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2448c95e-5c9f-4cd8-8f74-7d39ad438349/detect/iterations/Iteration7/image";

const rest = {
	sendImageToApi(imageFile) {
		const apiUrl = 'https://northeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2448c95e-5c9f-4cd8-8f74-7d39ad438349/detect/iterations/Iteration2/image';
		const predictionKey = 'b995b64f07a340eb8d1956ca2dc4134c';
		const contentType = 'application/octet-stream';
		const imageData = imageFile.replace(/^data:image\/[a-z]+;base64,/, '');

		const binaryData = atob(imageData);
		const length = binaryData.length;
		const bytes = new Uint8Array(length);
		for (let i = 0; i < length; i++) {
			bytes[i] = binaryData.charCodeAt(i);
		}

		const headers = {
			'Prediction-Key': predictionKey,
			'Content-Type': contentType,
		};
		const formData = new FormData();
		formData.append('image', imageFile);

		return axios.post(apiUrl, bytes, { headers: headers });
	},
};

export default rest;
