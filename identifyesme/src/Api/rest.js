fetch('https://northeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2448c95e-5c9f-4cd8-8f74-7d39ad438349/detect/iterations/Iteration2/url', {
        method: 'POST',
        headers: {
            'Prediction-Key': 'b995b64f07a340eb8d1956ca2dc4134c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Url: 'https://example.com/image.png'
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))