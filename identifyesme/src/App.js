import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import ClipLoader from "react-spinners/ClipLoader";




function sendImageToApi(imageFile) {
    const apiUrl = "https://northeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2448c95e-5c9f-4cd8-8f74-7d39ad438349/detect/iterations/Iteration7/image";
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
    const [isUnderstood, setIsUnderstood] = useState(false);




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
    const handleUnderstood = () => {
        setIsUnderstood(true);
    };


    return (<body><
        div className="App" >
        <
        h1 > Identify ESME < /h1>{isUnderstood ? (<div className="body" >

                <
        div className="button-container" >
                    <
        button className="add-image-btn"
                        onClick={
                            () => document.getElementById("fileInput").click()
                        } >
                        Ajouter image <
        /button> < /
        div > <
                            input id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                        /> <
        div className="container" >
                            <
        div className="dropzone"
                                onDragOver={
                                    (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }
                                onDrop={handleDrop} > {
                                    image ? (<
                                        img src={image}
                                        alt="uploaded"
                                        style={
                                            { maxWidth: "100%" }
                                        }
                                    />
                                    ) : (<
                p > Drop image here or click to upload < /p>
                                        )
        } <
        /div> {
                                            isLoading ? (<
            div className="loading-animation-container" >
                                                <
                                                    ClipLoader color={"#36D7B7"}
                                                    loading={isLoading}
                                                    size={150}
                                                /> < /
            div >
                                                ) : null
    } {
                                                    predictions.length > 0 && ( // vérifie si predictions n'est pas vide
                                                        <div className="predictions">
                                                            {
                                                                predictions.some(p => p.probability >= 0.7) ? ( // vérifie si au moins une probabilité est supérieure ou égale à 60%
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Logo</th>
                                                                                <th>Probability</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                predictions
                                                                                    .filter(p => p.probability >= 0.7) // filtre les prédictions dont la probabilité est supérieure ou égale à 70%

                                                                                    .map(prediction => (
                                                                                        <tr key={prediction.tagId}>
                                                                                            <td>{prediction.tagName.charAt(0).toUpperCase() + prediction.tagName.slice(1)}</td>
                                                                                            <td>{(prediction.probability * 100).toFixed(2)}%</td>
                                                                                        </tr>
                                                                                    ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <p>Logo non détécté</p> // affiche "pas de logo détecté" si aucune probabilité n'est supérieure ou égale à 60%
                                                                )
                                                            }
                                                        </div>
                                                    )

                                                } < /    div > <
        div className="button-submit-container" >
                                                    <
        button className="submit-btn"
                                                        onClick={handleSubmit} >
                                                        Soumettre <
        /button> < /div > < /div > ) : (<div className="understood-container">  <
                                                            p class="typewriter" >Nous avons créé une interface Web qui permet de détecter des logos dans des images pour des entreprises comme Apple, Microsoft, Google, Nvidia, Samsung ainsi qu'Intel. Cette détection est réalisée grâce à une API de reconnaissance visuelle entraînée par le machine learning.

                                                            Les utilisateurs peuvent facilement télécharger une image ou la faire glisser et la déposer dans la zone de dépôt prévue à cet effet. En appuyant sur le bouton de soumission, l'API analyse l'image et renvoie les prédictions de logos détectés, avec leur probabilité respective.

                                                            Les résultats sont affichés à l'utilisateur sous forme de tableau, avec les noms de logo et les probabilités correspondantes. Cette interface est simple à utiliser et permet une reconnaissance rapide et précise des logos recherchés.</p> <
                                                                                                                    button className="understood-btn"
                                                                onClick={handleUnderstood} >
                                                                C'est compris < /
    button > <
        /div>
                                                                )
}  <
div class="container-footer" >
                                                                    <
                                                                        p > Application produite par Farah Dourouni, Mehdi Lallouche, Rami Moulla, Yvan Gunewou-Takam et Romain Eyquem dans le cadre du 5 days challenge à ESME Sudria < /p> < /
    div > < /
div ></body>
                                                                    );
}
                                                                    export default App;