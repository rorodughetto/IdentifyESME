import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";




function sendImageToApi(imageFile) {
    const apiUrl = "https://northeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2448c95e-5c9f-4cd8-8f74-7d39ad438349/detect/iterations/Iteration2/image";
    const predictionKey = "b995b64f07a340eb8d1956ca2dc4134c";
    const contentType = "application/octet-stream";
    const imageData = imageFile.replace(/^data:image\/[a-z]+;base64,/, "");

    const binaryData = atob(imageData);
    const length = binaryData.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
    }


    const headers = {
        "Prediction-Key": predictionKey,
        "Content-Type": contentType,
    };
    const formData = new FormData();
    formData.append('image', imageFile);

    return axios.post(apiUrl, bytes, { headers: headers });
}

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

    const handleSubmit = () => {
        if (image) {
            setIsLoading(true);
            setPredictions([]);
            sendImageToApi(image)
                .then((response) => {
                    setPredictions(response.data.predictions);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => setIsLoading(false));
        }
    };


    return ( <
            div className = "App" >
            <
            h1 > Drag & Drop or Upload Image < /h1> <
            div className = "button-container" >
            <
            button className = "add-image-btn"
            onClick = {
                () => document.getElementById("fileInput").click()
            } >
            Add Image <
            /button> < /
            div > <
            input id = "fileInput"
            type = "file"
            accept = "image/*"
            onChange = { handleUpload }
            /> <
            div className = "dropzone"
            onDragOver = {
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
            onDrop = { handleDrop } > {
                image ? ( <
                    img src = { image }
                    alt = "uploaded"
                    style = {
                        { maxWidth: "100%" }
                    }
                    />
                ) : ( <
                    p > Drop image here or click to upload < /p>
                )
            } <
            /div> <
            button className = "submit-btn"
            onClick = { handleSubmit } >
            Submit <
            /button> {
            isLoading ? ( <
                div className = "loading-animation-container" >
                <
                ClipLoader color = { "#36D7B7" }
                loading = { isLoading }

                size = { 150 }
                /> < /
                div >
            ) : null
        } {
            predictions.length > 0 ? ( <
                div className = "predictions" >
                <
                table >
                <
                thead >
                <
                tr >
                <
                th > Logo < /th> <
                th > Probability < /th> < /
                tr > <
                /thead> <
                tbody > {
                    predictions.slice(0, 3).map((prediction) => ( <
                        tr key = { prediction.tagId } >
                        <
                        td > { prediction.tagName.charAt(0).toUpperCase() + prediction.tagName.slice(1) } < /td> <
                        td > {
                            (prediction.probability * 100).toFixed(2)
                        } % < /td> < /
                        tr >
                    ))
                } <
                /tbody> < /
                table > <
                /div>
            ) : null
        } <
        /div>
);
}

export default App;