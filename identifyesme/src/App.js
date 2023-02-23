import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import rest from './Api/rest';

function App() {
	const [image, setImage] = useState(null);
	const [predictions, setPredictions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleUpload = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
		};
		reader.readAsDataURL(file);
	};

    const removeBoundingBoxs = () => {
        predictions.forEach((prediction, index) => {
            const boundingBoxDiv = document.getElementById('bounding-box' + index);
            if (boundingBoxDiv) boundingBoxDiv.remove();
        })
    }

	const createBoundingBox = () => {
		const boundingBoxColors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'];
		const dropzone = document.getElementById('dropzone');
        new ResizeObserver(() => {
            removeBoundingBoxs();
			for (let index = 0; index < predictions.length; index++) {
                if (predictions[index].probability > 0.6) {
					const image = document.getElementById('image');
					const imageRect = image.getBoundingClientRect();
					const imageWidth = imageRect.width;
					const imageHeight = imageRect.height;
					const imageLeft = imageRect.left;
					const imageTop = imageRect.top;
					const boundingBox = document.createElement('div');
					boundingBox.id = 'bounding-box' + index;
					boundingBox.style.border = '3px solid ' + boundingBoxColors[index];
					boundingBox.style.height = imageHeight * predictions[index].boundingBox.height + 'px';
					boundingBox.style.width = imageWidth * predictions[index].boundingBox.width + 'px';
					boundingBox.style.position = 'absolute';
					boundingBox.style.top = imageTop + predictions[index].boundingBox.top * imageHeight + 'px';
					boundingBox.style.left = imageLeft + predictions[index].boundingBox.left * imageWidth + 'px';
					document.body.appendChild(boundingBox);
				}
			}
		}).observe(dropzone);
        window.addEventListener('resize', () => {
            removeBoundingBoxs();
			for (let index = 0; index < predictions.length; index++) {
				if (predictions[index].probability > 0.6) {
					const image = document.getElementById('image');
					const imageRect = image.getBoundingClientRect();
					const imageWidth = imageRect.width;
					const imageHeight = imageRect.height;
					const imageLeft = imageRect.left;
					const imageTop = imageRect.top;
					const boundingBox = document.createElement('div');
					boundingBox.id = 'bounding-box' + index;
					boundingBox.style.border = '3px solid ' + boundingBoxColors[index];
					boundingBox.style.height = imageHeight * predictions[index].boundingBox.height + 'px';
					boundingBox.style.width = imageWidth * predictions[index].boundingBox.width + 'px';
					boundingBox.style.position = 'absolute';
					boundingBox.style.top = imageTop + predictions[index].boundingBox.top * imageHeight + 'px';
					boundingBox.style.left = imageLeft + predictions[index].boundingBox.left * imageWidth + 'px';
					document.body.appendChild(boundingBox);
				}
			}
		});
	};

	const handleSubmit = () => {
		if (image) {
			setIsLoading(true);
			setPredictions([]);
			rest
				.sendImageToApi(image)
				.then((response) => {
					setPredictions(response.data.predictions);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<div className='App'>
			{!isLoading && predictions.length > 0 && createBoundingBox()}
			<h1> Drag & Drop or Upload Image </h1>{' '}
			<div className='button-container'>
				<button className='add-image-btn' onClick={() => document.getElementById('fileInput').click()}>
					Add Image{' '}
				</button>{' '}
			</div>{' '}
			<input id='fileInput' type='file' accept='image/*' onChange={handleUpload} />{' '}
			<div className='container'>
				<div
					id='dropzone'
					className='dropzone'
					onDragOver={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					onDrop={handleDrop}
				>
					{' '}
					{image ? (
						<div>
							<img id='image' src={image} alt='uploaded' style={{ width: '100%', height: '100%' }} />
						</div>
					) : (
						<p> Drop image here or click to upload </p>
					)}{' '}
				</div>{' '}
				{/* {isLoading ? (
						<div id='spinner' className='loading-animation-container'>
							<ClipLoader color={'#36D7B7'} loading={isLoading} size={150} />{' '}
						</div>
					) : null}{' '} */}
				{predictions.length > 0 ? (
					<div className='predictions'>
						<table>
							<thead>
								<tr>
									<th> Logo </th> <th> Probability </th>{' '}
								</tr>{' '}
							</thead>{' '}
							<tbody>
								{' '}
								{predictions.slice(0, 3).map((prediction) => (
									<tr key={prediction.tagId}>
										<td> {prediction.tagName.charAt(0).toUpperCase() + prediction.tagName.slice(1)} </td> <td> {(prediction.probability * 100).toFixed(2)} % </td>{' '}
									</tr>
								))}{' '}
							</tbody>{' '}
						</table>{' '}
					</div>
				) : null}{' '}
			</div>{' '}
			<button className='submit-btn' onClick={handleSubmit}>
				Submit{' '}
			</button>{' '}
		</div>
	);
}
export default App;
